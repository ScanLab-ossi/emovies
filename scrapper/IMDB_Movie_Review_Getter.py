import requests
from bs4 import BeautifulSoup
import json

# Code checks current amount of reviews for each movie in IMDB
# Output : Json file with movie id : amount of reviews
# if no reviews -> 0
# if movie doesn't exist it skips the ID

data = {}
print(" Running ... ")
for i in range(1, 99999999):
    n = str(i)
    n = n.zfill(8)
    # n - is the movie ID here
    url = 'https://www.imdb.com/title/tt' + str(n) + '/reviews/'
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    if i % 10000 == 0:
        with open('data.json', 'w') as fp:
            json.dump(data, fp)
        print("Checked: " + str(i) + " movies, JSON saved")
    for div in soup.find_all("div", {"class": "header"}):
        reviews = str(div.find("span").text).split(" ")[0]
        data[n] = reviews
        break
print(" You can turn me off, I've finished")
with open('data.json', 'w') as fp:
    json.dump(data, fp)
