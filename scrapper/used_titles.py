import pandas as pd


def get_titleId(i):
    """formats id to imdb format

        :param i:
        :return:
    """
    n = str(i)
    n = n.zfill(7)
    return 'tt' + n


ls_titles = []
df = pd.read_csv("used_titles.csv")
USERS = pd.read_csv("titles.csv")

for row in df.iterrows():
    start = int(row[1]["start"])
    end = int(row[1]["end"])
    for i in range(start, end + 1):
        ls_titles.append(get_titleId(i))

EXCLUDE = pd.DataFrame(ls_titles, columns=["titleId"])

USERS = USERS[~USERS.titleId.isin(EXCLUDE.titleId)]


USERS = USERS.reset_index(drop=True)
USERS.to_csv("titles_to_scrap.csv")
