from datetime import time
from operator import index
import re
import requests
from bs4 import BeautifulSoup
from requests.exceptions import ChunkedEncodingError
import csv
import pandas as pd
import numpy as np
import os
try:
    new2 = pd.read_csv("new2.csv")
    temp = pd.read_csv("temp.csv", usecols =["titleId"])
except:
    print("Couldn't open new2.csv or temp.csv properly, check files")
    exit(0)
index = 0
new2 = np.array(new2)
temp = np.array(temp)
counter = 0
queue = []

try:
    os.remove('update2.csv')
    print("Old update file deleted")
except:
    pass
print("Gathering updates starting")
# if "tt00983946" in temp:
#     print ("THIS SHOULD WORK ")
for i in new2:
    tt = "tt" + i[0][2:].zfill(8)
    # if tt == "tt00983946":
    #     print("THIS TOO")
    if tt not in temp:
       # print(i)
       # if tt == "tt00983946":
       #     print("HOW THE FUCK IS THIS POSSIBLE? ")
       with open('updatefinal.csv', mode='a', newline='') as update_file:
            update_writer = csv.writer(update_file)
            update_writer.writerow([tt])

            counter = counter + 1
print("Amount of possible new movies: " + str(counter))

counter = 0
with open('updatefinal.csv', newline='') as csv_file:
    csv_reader = csv.reader(csv_file)
    for i in csv_reader:
        counter = counter + 1
        if counter % 500 == 0:
            print("Current Index: " + str(counter))
        tt = str(i[0])
        url = 'https://www.imdb.com/title/' + tt + '/reviews/'
        # print(url)
        got_page = False
        while not got_page:
            try:
                page = requests.get(url)
                got_page = True
            except ChunkedEncodingError as e:
                time.sleep(5)
                continue
            except ConnectionResetError as e:
                time.sleep(5)
                continue
            except Exception as e:
                time.sleep(5)
                continue
        reviews_on_page = 0
        soup = BeautifulSoup(page.content, 'html.parser')
        for div in soup.find_all("div", {"class": "header"}):
            reviews_on_page = str(div.find("span").text).split(" ")[0]
            break
        try:
            reviews_on_page = re.sub("[^0-9]", "", reviews_on_page)
        except TypeError as e:
            pass
        except Exception as e:
            pass
        if int(float(reviews_on_page)) < 30:
            pass
        else:
            print("TT: " + tt + " There are: " + str(reviews_on_page) + " reviews on the page.")
            with open('update2.csv', mode='a', newline='') as update_file:
                update_writer = csv.writer(update_file)
                #update_writer.writerow([tt, str(reviews_on_page)]) with review amount
                update_writer.writerow([tt])
    print("Total new movies: " + str(counter))
    print("PROCESS ENDED SUCCESSFULLY")
