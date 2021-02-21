import json

from flask import Flask
from flask_cors import CORS
from flask import request
import csv
import pandas as pd
from backend.mongo_functions import *
from backend.NRC_api import nrcLexicon

app = Flask(__name__)
CORS(app)


@app.route("/", methods=['GET', 'POST'])
def get_most_relative():
    data = request.json['data']
    get_most_relative_(data, 200)

    return "200"


@app.route("/getNameById", methods=['GET', 'POST'])
def get_movie_by_id():
    data = request.json['data']
    data = getNameById(data)
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )

    return response


@app.route("/getGlyph", methods=['GET', 'POST'])
def get_movies_by_text():
    data = request.json['data']
    vec = nrcLexicon.get_emotional_signature(data)
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )

    return response


@app.route("/byVector", methods=['GET', 'POST'])
def get_movies_by_vector():
    vector = request.json['data']
    get_most_relative_by_vector(vector,200)

    return "200"


if __name__ == '__main__':
    app.run()
