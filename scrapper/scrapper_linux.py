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
from webdriver_manager.chrome import ChromeDriverManager

import argparse
import pandas as pd


def user_review(number):
    """ returns all user reviews from the movie with given number id

        :param number: movie id
        :return: list of reviews
    """

    url = 'https://www.imdb.com/title/tt' + str(number[2:]) + '/reviews'

    chrome_options = Options()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-dev-shm-usage')

    # code to stop driver crash
    # https://stackoverflow.com/questions/53073411/selenium-webdriverexceptionchrome-failed-to-start-crashed-as-google-chrome-is
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    # end of code

    init_driver = False
    count_tries = 0

    # try to connect to driver
    while not init_driver:
        try:
            if count_tries > 50:
                break
            driver = webdriver.Chrome('/usr/bin/chromedriver', chrome_options=chrome_options)
            init_driver = True
        except Exception:
            count_tries+=1
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
    users = soup.findAll("a", attrs={"href": re.compile("^/user/")})
    helpful = soup.findAll("div", {"class": "actions text-muted"})
    titles = soup.findAll("a", {"class": "title"})
    expand_reviews = soup.findAll("div", {"class": "text show-more__control clickable"})

    reviews = [str(r) for r in reviews]
    dates = [str(r) for r in dates]
    titles = [str(r) for r in titles]
    users = [str(r) for r in users]
    helpful = [str(r) for r in helpful]
    expand_reviews = [str(r) for r in expand_reviews]

    reviews = reviews + expand_reviews

    ls = zip(reviews, dates, titles, users, helpful)


    time.sleep(10)
    driver.quit()
    return ls


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


def check_valid(titleId):
    """checks if the id given represents a movie

    :param titleId: id
    :return: True if a movie, False other
    """

    url = 'https://www.imdb.com/title/tt' + str(titleId[2:]) + '/reviews/'
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

    soup = BeautifulSoup(page.content, 'html.parser')
    reviews = 0
    ia = imdb.IMDb()

    titleId = int(re.sub("[^0-9]", "", titleId))
    episode_tester = ia.get_movie(titleId)
    # Use this movie/tv series/episode/video movie/tv movie... and maybe more?
    try:
        test = episode_tester['kind']
    except KeyError as e:
        return False
    except IndexError as e:
        return False

    if not 'movie' in episode_tester['kind']:
        return False

    for div in soup.find_all("div", {"class": "header"}):
        reviews = str(div.find("span").text).split(" ")[0]
        break
    try:
        reviews = re.sub("[^0-9]", "", reviews)
    except TypeError as e:
        return False
    except Exception as e:
        return False
    if int(float(reviews)) < 30:
        return False
    return True


def main(start, end):
    if not os.path.exists("data"):
        os.makedirs("data")

    skipped = 0  # counts movie skipped
    total_reviews = 0  # counts total reviews scrapped

    # loads parameters from log file
    if os.path.exists("scrapper.log"):
        with open("scrapper.log", "r") as logger:
            lines = logger.read().splitlines()
            line = lines[-1].split()
            total_reviews = int(line[6])
            skipped = int(line[9])
            print("load parameters", skipped, total_reviews)

    # create range for iteration
    months = {
        "January": '1',
        "February": '2',
        "March": '3',
        "April": '4',
        "May": '5',
        "June": '6',
        "July": '7',
        "August": '8',
        "September": '9',
        "October": '10',
        "November": '11',
        "December": '12'

    }

    # create range for iteration
    df = pd.read_csv("totalmovies2.csv")
    title_range = df.iloc[start:end].values.tolist()
    # scrapping loop
    for index, titleId in enumerate(title_range):
        titleId = titleId[0]
        now = datetime.now()
        progress_precntage = index / (end - start)

        # log message
        with open("scrapper.log", "a") as logger:
            stream = os.popen('du -sh data')
            output = stream.read()


            date_time = now.strftime("%m/%d/%Y, %H:%M:%S")
            message = "time:" + date_time + " title: " + titleId + " total reviews: " + str(
                total_reviews) + " skipped movies: " + str(skipped) + " size: " + output.split()[0] + " start: " + str(
                start) + " end: " + str(end) + " progress " + "{:.3f}".format(
                progress_precntage) + " row number " + str(start + index) + " LATEST ID CHECKED" + "\n"

            print(message, end='')
            logger.write(message)
        print("check id " + titleId)
        name = get_title_name(titleId)
        if (name == None):
            skipped += 1
            print("skipped " + titleId)
            continue
        if not check_valid(titleId):
            skipped += 1
            print("skipped " + titleId)
            continue

        js = {"name": name, "titleId": titleId, "reviews": [], "reviews_amount": 0}

        # scrapping procedure
        print("scrapping movie", js)

        for review, date, title, user, help in user_review(js["titleId"]):
            review = clean_text(review)
            date = clean_text(date)
            date = date.split(" ")

            day = date[0]
            month = months[date[1]]
            year = date[2]

            review_id = title.split("review")[1].split("/")[1]
            title = clean_text(title)
            user = clean_text(user)
            help = clean_text(help).split("helpful")[0].strip() + " useful"

            js["reviews"].append({
                "id": review_id,
                "title": title,
                "user": user,
                "text": review,
                "help": help,
                "day": day,
                "month": month,
                "year": year
            })
        # log message
        with open("scrapper.log", "a") as logger:

            stream = os.popen('du -sh data')
            output = stream.read()

            date_time = now.strftime("%m/%d/%Y, %H:%M:%S")
            message = "time:" + date_time + " title: " + js["titleId"] + " total reviews: " + str(
                total_reviews) + " skipped movies: " + str(skipped) + " size: " + output.split()[0] + " start: " + str(
                start) + " end: " + str(end) + " progress " + "{:.2f}".format(progress_precntage) + " row number " + str(start + index)+ "\n"

            print(message, end='')
            logger.write(message)

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
    final = pd.read_csv("totalmovies2.csv")
    print(final.size)
    parser.add_argument("--end", type=int, default=final.size)
    args = parser.parse_args()
    main(args.start, args.end)