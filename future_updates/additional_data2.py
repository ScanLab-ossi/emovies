import re

import imdb
import csv

from numpy import unicode

ia = imdb.IMDb()
counter = 0
import os
try:
    os.remove('the_data.csv')
    print("Old data file deleted")
except:
    pass
print("Starting ADDITIONAL DATA gathering")
index = 0
with open('the_data.csv', mode='a', newline='') as update_file:
    update_writer = csv.writer(update_file)
    update_writer.writerow(
        ["title_id", "movie_rating", "movie_directors", "movie_writers", "movie_stars", "movie_genres", "release_year"])
with open('totalmovies.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
    for i in spamreader:
        index = index + 1
        if index % 100 == 0:
            print("Current: " + str(index))
        if counter == 0:
            counter = +1
            continue
        tt = str(i[0])
        #print(tt)
        # tt = "tt07286456"
        movie = ia.get_movie(int(float(tt[2:])))
        # print(movie.infoset2keys)
        try:
            movie_rating = movie['rating']
        except Exception:
            movie_rating = 0
        try:
            movie_directors = (movie['directors'])
        except Exception:
            movie_directors = ""
        try:
            movie_writers = (movie['writer'])
        except Exception:
            movie_writers = ""
        try:
            movie_stars = (movie['cast'])
            movie_stars = movie_stars[:5]
        except Exception:
            movie_stars = ""
        try:
            movie_genres = (movie['genres'])
        except Exception:
            movie_genres = ""
        try:
            release_year = movie['year']
        except Exception:
            release_year = 0
        movie_directors2 = ""
        for s in movie_directors:
            if s != "":
                movie_directors2 = movie_directors2 + s['name'] + ' & '
        movie_writers2 = ""
        for s in movie_writers:
            if s != "" or s is not None:
                movie_writers2 = movie_writers2 + str(s) + ' & '
        movie_stars2 = ""
        for s in movie_stars:
            if s != "":
                movie_stars2 = movie_stars2 + str(s) + ' & '
        movie_genres2 = ""
        for s in movie_genres:
            if s != "":
                movie_genres2 = movie_genres2 + str(s) + ' & '
        with open('the_data.csv', mode='a', newline='') as update_file:
            update_writer = csv.writer(update_file)
            update_writer.writerow(
                [tt,movie_rating, movie_directors2[:-2], movie_writers2[:-2], movie_stars2[:-2], movie_genres2[:-2],
                 release_year])
print("ADDITIONAL DATA gathering FINISHED successfully")
