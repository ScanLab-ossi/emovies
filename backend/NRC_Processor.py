import json


from backend.NRC_api import nrcLexicon
import numpy as np


def _create_signature(reviews):
    """ Creates emotional signature from the reviews given

    :param reviews:
    :return:
    """
    movie_signature = {
        "anger": 0,
        "anticipation": 0,
        "disgust": 0,
        "fear": 0,
        "joy": 0,
        "negative": 0,
        "positive": 0,
        "sadness": 0,
        "surprise": 0,
        "trust": 0,
        "total_words": 0
    }

    for review in reviews:

        emotional_signature, amount_words = nrcLexicon.get_emotional_signature(review["text"])
        # text_object = NRCLex(review["text"])
        # emotional_signature = text_object.raw_emotion_scores
        # amount_words = len(text_object.words)

        for key in emotional_signature:
            movie_signature[key] += emotional_signature[key]

        movie_signature["total_words"] += amount_words

    return movie_signature


def process_movie(movie: dict) -> dict:
    """ this function returns dictionary witn the emotional signature of the move

    :param movie:
    :return: dcit with emotional signature added
    """
    name, titlId, reviews = movie["name"], movie["titleId"], movie["reviews"]
    signature = _create_signature(reviews)

    return signature


def main():
    with open("../00010806.json") as file:
        movie = json.load(file)

    print(process_movie(movie))


if __name__ == '__main__':
    # #main()
    # import nltk
    # nltk.download('punkt')
    # text_object = NRCLex("Toy Story 3 in my opinion is by far the best of the trilogy! It is the most emotionally investing out of all the Toy Story installments and is an outstanding entry to the Pixar library!")
    # emotional_signature = text_object.raw_emotion_scores
    # amount_words = len(text_object.words)
    # for i in text_object.words:
    #     text_object = NRCLex(i)
    #     print(i)
    #     print(text_object.raw_emotion_scores)

    #print(emotional_signature,amount_words)
    with open(r"C:\xampp\htdocs\2020_havent-been-decided\data\tt00435761.json") as file:
        movie = json.load(file)

    print(process_movie(movie))