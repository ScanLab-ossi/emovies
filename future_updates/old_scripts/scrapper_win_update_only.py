from datetime import datetime

import requests
from bs4 import BeautifulSoup
import re
import os
import imdb
from requests.exceptions import ChunkedEncodingError
from selenium import webdriver
import time
import json
from selenium.webdriver.chrome.options import Options
import argparse
import pandas as pd
from webdriver_manager.chrome import ChromeDriverManager


def user_review(number):
    """ returns all user reviews from the movie with given number id

        :param number: movie id
        :return: list of reviews
    """

    url = 'https://www.imdb.com/title/tt' + str(number[2:]) + '/reviews'

    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=chrome_options)

    try:
        driver.get(url)
        r = requests.get(url)
        soup = BeautifulSoup(r.content, "lxml")
        t = soup.findAll('div', {"class": 'header'})
    except Exception as e:
        return []

    no = [re.search('an>(.+?) Re', str(text)).group(1) for text in t[0::2]]
    no[0] = no[0].replace(",", "")
    no = int(no[0])
    no = no / 25

    while True:
        try:
            if (no < 1):
                break
            loadMoreButton = driver.find_element_by_xpath('//*[@id="load-more-trigger"]')

            loadMoreButton.click()

            no -= 1
            time.sleep(4)
        except Exception as e:
            break

    page = driver.execute_script('return document.body.innerHTML')
    soup = BeautifulSoup(''.join(page), 'html.parser')
    reviews = soup.findAll("div", {"class": "text show-more__control"})
    dates = soup.findAll("span", {"class": "review-date"})
    print(dates)
    expand_reviews = soup.findAll("div", {"class": "text show-more__control clickable"})
    reviews = [str(r) for r in reviews]
    expand_reviews = [str(r) for r in expand_reviews]
    reviews = reviews + expand_reviews

    time.sleep(10)
    driver.quit()
    return reviews


def clean_text(text):
    """Remove html tags from a string"""
    clean = re.compile('<.*?>')
    text = re.sub(clean, '', text)
    return text.replace('\n', ' ').replace('\r', '').replace("\"", "")


def get_titleId(i):
    """formats id to imdb format

        :param i:
        :return:
    """
    n = str(i)
    n = n.zfill(8)
    return n


def get_title_name(id):
    """returns the name of the movie

        :param id: movie id
        :return: movie name
    """
    id = int(re.sub("[^0-9]", "", id))

    ia = imdb.IMDb()
    title = ia.get_movie(id)
    return title.get('title')



def main(start, end):
    if not os.path.exists("data"):
        os.makedirs("data")

    skipped = 0  # counts movie skipped
    total_reviews = 0  # counts total reviews scrapped

    # create range for iteration
    df = pd.read_csv("lasttest.csv")
    title_range = df.iloc[start:end].values.tolist()

    # scrapping loop
    for titleId in title_range:

        titleId = titleId[0]
        number = int(re.sub("[^0-9]", "", titleId))
        now = datetime.now()
        progress_precntage = (number - start) / (end - start)

        # log message

        print("check id " + titleId)
        name = get_title_name(titleId)
        if (name == None):
            skipped += 1
            print("skipped " + titleId)
            continue

        js = {"name": name, "titleId": titleId, "reviews": [], "reviews_amount": 0}

        # scrapping procedure
        print("scrapping movie", js)
        for id, review in enumerate(user_review(js["titleId"])):
            review = clean_text(review)
            js["reviews"].append({"id": id, "text": review})


        # write JSON to file system
        if len(js["reviews"]) > 30:
            js_path = os.path.join("data", js["titleId"] + ".json")
            js["reviews_amount"] = len(js["reviews"])

            total_reviews += js["reviews_amount"]

            print("creating JSON", {"titleId": js["titleId"], "reviews_amount": js["reviews_amount"]})
            with open(js_path, "w") as write_file:
                json.dump(js, write_file)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", type=int, default=0)
    final = pd.read_csv("lasttest.csv")
    print(final.size)
    parser.add_argument("--end", type=int, default=final.size)
    args = parser.parse_args()
    main(args.start, args.end)
