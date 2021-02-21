from sklearn.cluster import MeanShift
from sklearn.metrics import silhouette_score

from config.config_functions import save_config, load_config
from backend.MongoDB import db, MOVIES
import pandas as pd
import math
from sklearn.manifold import TSNE
from tqdm import tqdm
from itertools import product
import numpy as np
from backend.mongo_functions import update_db, get_percentiles

def _calc_zscore(df):
    print("calculate zscore")

    documents = []
    for row in tqdm(df.iterrows()):
        dc = {"titleId": row[1]["titleId"]}
        for emotion in ["anger", "anticipation", "disgust", "fear", "joy", "negative", "positive", "sadness",
                        "surprise", "trust"]:
            # TODO bug with zscore when df[emotion].min() = 0 and emotion score=0
            min_emotion = df[emotion].min()
            if min_emotion == 0:
                min_emotion = 0.0000001

            emotion_score = row[1][emotion]
            if emotion_score == 0:
                emotion_score = 0.0000001

            dc[emotion] = (math.log(emotion_score) - math.log(min_emotion)) / (
                    math.log(df[emotion].max()) - math.log(min_emotion))

        documents.append(dc)

    df = pd.DataFrame(documents)
    return df


def _calc_zscore_2(documents):
    """
    (H7-AVERAGE(H:H))/STDEV.P(H:H)
    """
    print("calculate zscore")

    ls = []
    for doc in documents.values():
        dc = {"titleId": doc["titleId"]}
        for k, v in doc["signature"].items():
            dc[k] = v

        ls.append(dc)

    df = pd.DataFrame(ls)

    for row in tqdm(df.iterrows()):
        titleId = row[1]["titleId"]
        dc = {}
        for emotion in ["anger", "anticipation", "disgust", "fear", "joy", "negative", "positive", "sadness",
                        "surprise", "trust"]:
            # (H7-AVERAGE(H:H))/STDEV.P(H:H)
            mean_emotion = df[emotion].mean()
            sdtev_p = np.std(df[emotion])

            dc[emotion] = (row[1][emotion] - mean_emotion) / sdtev_p

        documents[titleId]["signature_zscore"] = dc

    return documents


def _leveL_mesurment_calc(documents):
    """

    (C2-AVERAGE(C:C))/(STDEV.P(C:C))

    """
    print("updating the level of measurement")

    ls = []
    for doc in documents.values():
        dc = {"titleId": doc["titleId"]}
        for k, v in doc["signature_zscore"].items():
            dc[k] = v
        ls.append(dc)

    df = pd.DataFrame(ls)

    for row in tqdm(df.iterrows()):
        titleId = row[1]["titleId"]
        dc = {}
        for emotion in ["anger", "anticipation", "disgust", "fear", "joy", "negative", "positive", "sadness",
                        "surprise", "trust"]:
            dc[emotion] = (((row[1][emotion]) - df[emotion].min()) / (df[emotion].max() - df[emotion].min())) * 100

        documents[titleId]["signature_per"] = dc

    return documents


def _normalize(movies, documents):

    print("normalize signatures")
    for document in tqdm(movies):

        result = db["MovieDetails"].find({"_id": document["details_id"]}, {"_id": 0, "signature": 1})

        # normalizing emotional scores
        for signature in result:
            total_words = signature["signature"].pop("total_words")
            for key in signature["signature"]:
                signature["signature"][key] /= total_words

            document["signature"] = signature["signature"]
            document.update(signature)
            documents[document["titleId"]] = document

    return documents


def _calc_percentile(documents):
    print("calculate percentile")

    ls = []
    for doc in documents.values():
        dc = {"titleId": doc["titleId"]}
        for k, v in doc["signature_per"].items():
            dc[k] = v
        ls.append(dc)

    df = pd.DataFrame(ls)
    size_df = len(df)
    dc_temp = df["titleId"].to_dict()
    dc = {}
    for key in dc_temp.values():
        dc[key] = {}

    for emotion in tqdm(["anger", "anticipation", "disgust", "fear", "joy", "negative", "positive", "sadness",
                    "surprise", "trust"]):
        
        df = df.sort_values(by=[emotion])
        for row in df.iterrows():
            titleId = row[1]["titleId"]
            val_per = row[1][emotion]
            index = np.searchsorted(df[emotion], val_per, side='left')
            dc[titleId][emotion] = index/size_df * 100

    for key in dc:
        documents[key]["signature_percentile"] = dc[key]

    return documents



def _glyph_process():
    """This method generates glyph for each movie in the database

    The process is built for 3 steps:

        1) normalize the amount of  words per emotion in the reviews to the number of the total words in the reviews

        2)  standard something (H7-AVERAGE(H:H))/STDEV.P(H:H)

        3) calculate zscore for each emotion

        4) level of measurement tuning

    :return: documents for DB
    """
    # create Movies collection
    movies = db["Movies"].find({}, {"_id": 0, "titleId": 1, "details_id": 1})

    documents = {}

    # stage 1:
    documents = _normalize(movies, documents)

    # stage 2
    documents = _calc_zscore_2(documents)

    # stage 3
    documents = _leveL_mesurment_calc(documents)

    # stage 4
    documents = _calc_percentile(documents)



    for doc in tqdm(documents.values()):
        titleId = doc.pop("titleId")
        result = db[MOVIES].update({"titleId": titleId}, {"$set": doc})


def _optimize_tsne(tsne, data):
    """ optimizes hyperparameters of TSNE model, this is done by trying many possible combinations of parameters.
    which are later clustered using MeanShift algorithm and then evaluated by silhouette metric

    :param tsne: The model optimized
    :param data: glyphs from the database, which are used for optimization
    :return: tsne model
    """

    print("optimize started")
    config = {
        "perplexity": [2, 5, 30, 50, 100],
        "learning_rate": [200, 400, 800, 1000],
        "init": ["random", "pca"]
    }

    experiments = [dict(zip(config.keys(), value)) for value in product(*config.values())]

    sil = 0

    for e in tqdm(experiments):

        tsne = tsne.set_params(**e)
        X_embedded = tsne.fit_transform(data)

        meanshift = MeanShift(bandwidth=5)
        clustering = meanshift.fit(X_embedded)

        score = silhouette_score(X_embedded, clustering.labels_, metric='euclidean')
        if sil < score:
            sil = score

    save_config(tsne.get_params(), "tsne_config")

    return tsne


def _load_tsne(tsne):
    """ loads hyperparameter from a saved config file

    :param tsne: tsne model
    :return: tsne model tuned with parameters
    """
    conf = load_config("tsne_config")
    tsne.set_params(**conf)
    return tsne


def _tsne_process(batch_update=False, optimize=False):
    """ This method transforms data given to 2D data using optimized tsne model.

    :param data: glyph data from database
    :param batch_update: Case the update is preformed for batch reasons
    :param optimize: optimizes the tsne model and saves as a new config
    """
    print("tsne process started")
    df = _load_glyphs()
    titles = df["titleId"]
    data = df.drop("titleId", axis=1)

    tsne = TSNE()

    if batch_update or optimize:
        tsne = _optimize_tsne(tsne, data)
    else:
        tsne = _load_tsne(tsne)

    print("transform data")
    tsne_data = tsne.fit_transform(data)
    tsne_data = pd.DataFrame(tsne_data, columns=["x", "y"])
    tsne_data["titleId"] = titles

    documents = []

    print("adding tsne glyphs to db")
    for row in tsne_data.iterrows():
        row = row[1]
        dc = {'titleId': row['titleId'], 'x': row['x'], 'y': row['y']}
        documents.append(dc)

    update_db("Movies", documents, 'tsne_glyph')

    
def _load_glyphs():
    """ loads glyphs from Database to memory

    :return: dataframe with titleId and glyphs
    """
    return get_percentiles()


def glyph_creation(batch_update=False, create_glyph=False, create_tsne_glyph=False, optimize=False):
    """ This is entry point of the glyph process, this method creates glyphs and tsne glyphs which are in the DB

    :param create_tsne_glyph: creates tsne glyphs, this boolean is decides if glyph creation is needed
    :param create_glyph: creates glyphs, this boolean is decides if glyph creation is needed
    :param batch_update: case batch update is on so all process start from scratch
    :param optimize: if true optimize the TSNE model, case false load it from config
    :return:
    """
    if create_glyph or batch_update:
        _glyph_process()

    if create_tsne_glyph or batch_update:
        _tsne_process(batch_update, optimize)


if __name__ == '__main__':
    config = load_config("backend_config")
    print(glyph_creation(batch_update=config["batch_update"],
                         create_glyph=config["create_glyph"],
                         create_tsne_glyph=config["create_tsne_glyph"],
                         optimize=config["optimize"]
                         ))
