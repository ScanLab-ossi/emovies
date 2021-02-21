from tqdm import tqdm
import pandas as pd
import csv
from backend.MongoDB import *
import numpy as np

from definitions import ROOT_DIR, WEBSITE, FULL_CSV, SMALL_CSV


def getNameById(titleid):
    query = db["Movies"].find({"titleId": titleid}, {"_id": 0, "name": 1})
    for result in query:
        return result["name"]


def get_titles_review_count():
    """
    returns dataframe of titleId and number of reviews in it
    """
    query = db["Movies"].find({}, {"_id": 0, "titleId": 1, "reviews_num": 1})
    df = pd.DataFrame(list(query))
    return df


def update_db(collection: str, documents: list, key: str):
    print("inserting updated document")
    for doc in tqdm(documents):
        titleId = doc.pop("titleId")
        result = db[collection].update({"titleId": titleId}, {"$set": {key: doc}})


def get_percentiles():
    """ get all glyphes from the db"""

    movies = db["Movies"].find({}, {"_id": 0, "titleId": 1, "signature_percentile": 1})
    ls_data = []
    for movie in movies:
        data = movie.pop("signature_percentile")
        data["titleId"] = movie['titleId']
        ls_data.append(data)

    df = pd.DataFrame(ls_data)
    return df


# TODO refactor method
def get_movies_for_web():
    """ returns dataframe format of movies collection """
    query = db[MOVIES].find({}, {"_id": 0, "titleId": 1, "name": 1, "glyph": 1, "tsne_glyph": 1})

    ls_results = []
    for result in query:
        glyph = result.pop('glyph')
        tsne = result.pop('tsne_glyph')

        result.update(glyph)
        result.update(tsne)
        ls_results.append(result)

    df = pd.DataFrame(ls_results)
    path = os.path.join(ROOT_DIR, 'backend', 'temp3.csv')

    df_2 = pd.read_csv(path)
    df = pd.concat([df, df_2], axis=1, sort=False)
    for col in df_2:
        df[col] = df[col].fillna(df[col].value_counts().index[0])

    df = df.rename(columns={"titleId": "movie_id"})

    return df


def get_vectors(selected_videos):
    """
    return a dict with a glyph,name,id,title of the video given
    """
    ls_vectors = []
    for video in selected_videos:
        dc = {}
        query = db["Movies"].find({"titleId": video}, {"_id": 0, "signature_percentile": 1})
        for vector in query:
            for emotion in vector["signature_percentile"]:
                dc[emotion + "-Percentile"] = vector["signature_percentile"][emotion]

            ls_vectors.append(dc)

    df = pd.DataFrame(ls_vectors)
    return df


def _calc_vector(df: pd.DataFrame):
    """
    Calculate the base vector of the dataframe
    """
    dc = {}
    for col in df.columns:
        dc[col] = [df[col].mean()]

    return pd.DataFrame(dc)


def _get_similar_videos(df, num=50):
    """
    returns the titles with the closest euclidean distance from the given dataframe.


    :param df: vector given
    :param num: then amount of similar closest videos
    :return: list of titles
    """
    startVector = df.values
    ls_vectors = []

    query = db["Movies"].find({}, {"_id": 0, "signature_percentile": 1, "titleId": 1})
    for vector in query:
        dc = {}
        for emotion in vector["signature_percentile"]:
            dc[emotion + "-Percentile"] = vector["signature_percentile"][emotion]

        dc["titleId"] = vector["titleId"]
        ls_vectors.append(dc)

    df = pd.DataFrame(ls_vectors)

    df["dist"] = df.loc[:, df.columns != 'titleId'].apply(lambda x: np.linalg.norm(x.values - startVector), axis=1)
    df = df.sort_values("dist")
    return df["titleId"][:num]

    # # read full csv data
    # with open(FULL_CSV, newline='') as csvfile:
    #     spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    #     temp = []
    #     next(spamreader)
    #     index = 0
    #     for i in spamreader:
    #         # get the precntile data
    #         print(index)
    #         index+=1
    #         arr = np.array([i[20], i[21], i[22], i[23], i[24], i[25], i[26], i[27], i[28], i[29]], float)
    #         print(arr)
    #         # distance from vector
    #         dist = np.linalg.norm(startVector - arr)
    #         temp.append((i[32], dist))
    #
    #     # sort by distance
    #     sorted_by_second = sorted(temp, key=lambda tup: tup[1])
    #     sorted_by_second = sorted_by_second[:num]
    #
    #     return sorted_by_second


def create_sidebar(base_vector: pd.DataFrame):
    """
    write sidebar data to filesystem for later use
    """
    path = os.path.join(WEBSITE, "data", "sidebar.json")
    base_vector.to_json(path)


# TODO api connection
def get_most_relative_(selected_videos, num):
    """
    Get most similar videos to the selected videos
    :param data: video ids
    :return: 50 most relative videos
    """

    df = get_vectors(selected_videos)

    base_vector = _calc_vector(df)

    similar_movies = _get_similar_videos(base_vector, num)

    create_csv(similar_movies)

    create_sidebar(base_vector)


def get_most_relative_by_vector(base_vector, num):
    base_vector = pd.DataFrame(base_vector, index=[0])
    base_vector["positive"] = 50
    base_vector["negative"] = 50

    similar_movies = _get_similar_videos(base_vector, num)

    create_csv(similar_movies)

    create_sidebar(base_vector)


def create_csv(similar_movies=None):
    file_path = os.path.join(WEBSITE, 'data', 'data.csv')
    filter = {}
    if not similar_movies.empty:
        filter = {"$or": [{"titleId": x} for x in similar_movies.values.tolist()]}

    movies = db[MOVIES].find(filter, {"_id": 0, "details_id": 1, "titleId": 1, "name": 1,
                                      "signature_per": 1, "signature_zscore": 1
        , "tsne_glyph": 1, "signature_percentile": 1, "additional_data": 1})
    ls = []
    for movie in tqdm(movies):
        dc = {}
        for emotion in movie["signature_per"]:
            dc[emotion + "-per"] = movie["signature_per"][emotion]

        for emotion in movie["signature_zscore"]:
            dc[emotion] = movie["signature_zscore"][emotion]

        for emotion in movie["signature_percentile"]:
            dc[emotion + "-Percentile"] = movie["signature_percentile"][emotion]

        for emotion in movie["tsne_glyph"]:
            dc[emotion] = movie["tsne_glyph"][emotion]

        for emotion in movie["additional_data"]:
            dc[emotion] = movie["additional_data"][emotion]

        dc["movie_id"] = movie["titleId"]
        dc["movieTitle"] = movie["name"]

        query = db[MOVIES_DETAILS].find({"_id": movie["details_id"]}, {"_id": 0, "signature": 1})
        for movie_details in query:
            for emotion in movie_details["signature"]:
                if emotion != "total_words":
                    dc[emotion + "-orig"] = movie_details["signature"][emotion]
                else:
                    dc["Total"] = movie_details["signature"][emotion]

        ls.append(dc)

    df = pd.DataFrame(ls)
    df = df[
        ["movieTitle", "anticipation", "trust", "anger", "fear", "disgust", "joy", "sadness", "surprise", "Total", "x",
         "y", "movie_rating", "movie_directors", "movie_writers", "movie_stars", "movie_genres", "release_year",
         "anticipation-orig", "joy-orig", "trust-orig", "anger-orig", "fear-orig", "disgust-orig", "sadness-orig",
         "surprise-orig", "anticipation-per", "joy-per", "trust-per", "anger-per", "fear-per", "disgust-per",
         "sadness-per", "surprise-per", "anger-Percentile", "anticipation-Percentile", "disgust-Percentile",
         "fear-Percentile", "joy-Percentile", "negative-Percentile", "positive-Percentile", "sadness-Percentile",
         "surprise-Percentile", "trust-Percentile", "movie_id"]]

    df.to_csv(file_path, index=False)
