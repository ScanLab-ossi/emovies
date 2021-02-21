import re

import imdb
import csv
import urllib.request

from numpy import unicode

ia = imdb.IMDb()
counter = 0
print("Starting PICTURE gathering")
index = 0
with open('temp.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
    for i in spamreader:
        index = index + 1
        if index % 100 == 0:
            print("Current: " + str(index))
        if counter == 0:
            counter = +1
            continue
        tt = re.search(',(.+?),', i[0]).group(1)
        tt = str(tt).replace(",", "")
        # getting information
        tt = int(float(tt[2:]))
        movie = ia.get_movie(tt)

        # getting cover url of the series
        url = ""
        try:
            url = movie.data['cover url']
        except Exception:
            pass
        # printing the object i.e name
        print(movie)

        # print the cover
        print(url)
        if url == "":
            pass
        final_tt = "tt" + str(tt).zfill(8) + ".jpg"
        try:
            urllib.request.urlretrieve(url, final_tt)
        except Exception:
            pass

print("Process Finished")