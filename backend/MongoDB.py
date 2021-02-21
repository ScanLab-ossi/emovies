import csv
import os
import time

from tqdm import tqdm
from pymongo import MongoClient
import json
from backend import NRC_Processor
import glob
import pandas as pd
import math

from config.config_functions import load_config
from definitions import DATA_DIR, ROOT_DIR

MOVIES = "Movies"
MOVIES_DETAILS = "MovieDetails"


# TODO refactor this class
class MongoDB:
    def __init__(self, ip="localhost", port=27017, data_dir=DATA_DIR, fill=False):
        self._ip = ip
        self._port = port
        self._db = None
        self._data_dir = data_dir
        self._fill = fill

    @property
    def db(self):
        if self._db is None:
            self._setup_db()
        return self._db

    def _connect_db(self):
        """ connects to db  """
        client = MongoClient(self._ip, self._port)
        self._db = client["EmotionDB"]

    def _fill_db(self):
        """ fill database with data from given dir path"""
        MongoClient(self._ip, self._port).drop_database('EmotionDB')
        self._connect_db()

        jsons = glob.glob(os.path.join(self._data_dir, "*.json"))
        for js in tqdm(jsons):
            js = os.path.join(self._data_dir, js)

            if js.endswith('.json'):
                with open(js) as file:
                    js_dict = json.load(file)

                    # create document for movie
                    signature = NRC_Processor.process_movie(js_dict)

                    # insert reviews
                    movie_details_insert = {
                        "reviews": js_dict["reviews"],
                        "signature": signature
                    }

                    result = self._db["MovieDetails"].insert_one(movie_details_insert)

                    movie_insert = {
                        "titleId": js_dict["titleId"],
                        "name": js_dict["name"],
                        "details_id": result.inserted_id,
                        "reviews_num": len(js_dict["reviews"])

                    }

                    result = self._db["Movies"].insert_one(movie_insert)

        additional_data = os.path.join(self._data_dir, "new_data.csv")
        with open(additional_data, newline='') as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
            for row in spamreader:
                dc = {
                    "movie_rating": row[1],
                    "movie_directors": row[2],
                    "movie_writers": row[3],
                    "movie_stars": row[4],
                    "movie_genres": row[5],
                    "release_year": row[6]
                }

                self._db[MOVIES].update_one({"titleId": row[0]}, {"$set": {"additional_data": dc}})

    def _setup_db(self):
        self._connect_db()
        if self._fill:
            start = time.time()
            self._fill_db()
            print(time.time() - start)


config = load_config("backend_config")
db = MongoDB(port=config["port"],ip=config["ip"],fill=config["fill"]).db
