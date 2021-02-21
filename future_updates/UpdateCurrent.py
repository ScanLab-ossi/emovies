from datetime import time
from operator import index
import re
import requests
from bs4 import BeautifulSoup
from requests.exceptions import ChunkedEncodingError
import csv
import os

from backend.mongo_functions import get_titles_review_count

try:
    os.remove('temp2.csv')
    os.remove('update.csv')
    print("Old update file deleted")
except:
    pass
counter = 0
print("Gathering updates starting")

df = get_titles_review_count()
df.to_csv("temp2.csv")
with open('temp2.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
    for i in spamreader:
        tt = re.search(',(.+?),', i[0]).group(1)
        current_reviews = i[0].split(',')[2]
        tt = str(tt).replace(",", "")
        url = 'https://www.imdb.com/title/' + tt + '/reviews/'
        # print(url)
        got_page = False

        while not got_page:
            try:
                page = requests.get(url)
                got_page = True
            except ChunkedEncodingError as e:
                time.sleep(10)
                continue
            except ConnectionResetError as e:
                time.sleep(10)
                continue
            except Exception as e:
                time.sleep(10)
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
        print("TT: " + tt + " We Scrapped: " + str(current_reviews) + " There are: " + str(
            reviews_on_page) + " reviews on the page.")
        if int(float(reviews_on_page)) > 0 and int(current_reviews) < int(float(reviews_on_page)):
            diff = int(float(reviews_on_page)) - int(current_reviews)
            prc = float(diff / int(current_reviews))
            # print(prc)
            if prc > 0.1 and diff > 20:
                counter = counter + 1
                with open('update.csv', mode='a', newline='') as update_file:
                    update_writer = csv.writer(update_file)
                    # update_writer.writerow([tt, diff]) shows difference
                    update_writer.writerow([tt])
    print("Total new movies: " + str(counter))
    print("PROCESS ENDED SUCCESSFULLY")
