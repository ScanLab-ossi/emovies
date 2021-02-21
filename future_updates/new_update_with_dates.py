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

counter = 0
with open('new.csv', newline='') as csv_file:
    csv_reader = csv.reader(csv_file)
    for i in csv_reader:
        counter = counter + 1
        if counter % 250 == 0:
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
        #print(reviews_on_page)
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
            with open('good_ones.csv', mode='a', newline='') as update_file:
                update_writer = csv.writer(update_file)
                #update_writer.writerow([tt, str(reviews_on_page)]) with review amount
                update_writer.writerow([tt])
    print("Total new movies: " + str(counter))
    print("PROCESS ENDED SUCCESSFULLY")