import csv
import pandas as pd
import re
import requests
from bs4 import BeautifulSoup
from requests.exceptions import ChunkedEncodingError

# GO HERE https://datasets.imdbws.com/
# DOWNLOAD: title.basics.tsv.gz
# EXTRACT IT AND RENAME IT TO new.tsv
# The code will remove all TT's that are not movies and that are older than 2020.
#
tsv_file = open("new.tsv", encoding='UTF8')
import os
try:
    tsv_file = open("new.tsv", encoding='UTF8')
except:
    print("Download title.basics.tsv.gz from https://datasets.imdbws.com/ and rename it to new.tsv")
    pass
try:
    os.remove('new_movies.csv')
    print("Old data file deleted")
except:
    pass
tsv_file = open("new.tsv", encoding='UTF8')
print("Starting process")
read_tsv = csv.reader(tsv_file, delimiter="\t")
with open('new_movies.csv', 'a', newline='') as csv_file:
    csv_reader = csv.reader(csv_file)
    writer = csv.writer(csv_file)

    for row in read_tsv:
        if 'movie' in str(row[1]):
            if row[5] != '\\N' and int(row[5]) >= 2020:
                writer.writerow([row[0]])
df = pd.read_csv('new_movies.csv', sep=',')
print(df.size)
print("Done")
# with open('data.tsv', 'a', newline='') as csv_file:
#     csv_reader = csv.reader(csv_file)
#     writer = csv.writer(csv_file)
#     for i in csv_reader:
#         print(i)
# with open('file.csv', 'a', newline='') as csv_file:
#     csv_reader = csv.reader(csv_file)
#     writer = csv.writer(csv_file)
#     with open('titles_to_scrap.csv', 'r', ) as titles:
#         read1 = csv.reader(titles)
#         for i in read1:
#             writer.writerow([i[1]])
#     for i in range (1,70511):
#         tt = "tt" + str(i).zfill(7)
#         writer.writerow([tt])
#     for i in range (7000000,7207497):
#         tt = "tt" + str(i).zfill(7)
#         writer.writerow([tt])
#     for i in range (11000000,11230649):
#         tt = "tt" + str(i).zfill(7)
#         writer.writerow([tt])
#     for i in range (9000000,9247643):
#         tt = "tt" + str(i).zfill(7)
#         writer.writerow([tt])
#     for i in range (8000000,8154482):
#         tt = "tt" + str(i).zfill(7)
#         writer.writerow([tt])
#     for i in range (6000000,6149244):
#         tt = "tt" + str(i).zfill(7)
#         writer.writerow([tt])
#     for i in range (2000000,2077911):
#         tt = "tt" + str(i).zfill(7)
#         writer.writerow([tt])
#     for i in range (4000000,4141676):
#         tt = "tt" + str(i).zfill(7)
#         writer.writerow([tt])
#     for i in range (10000000,10173600):
#         tt = "tt" + str(i).zfill(7)
#         writer.writerow([tt])
#     for i in range (12000000,12157325):
#         tt = "tt" + str(i).zfill(7)
#         writer.writerow([tt])
# with open('file.csv', 'r', newline='') as csv_file2:
#     csv_reader2 = csv.reader(csv_file2)
#     lines = len(list(csv_reader2))
#     print(lines)