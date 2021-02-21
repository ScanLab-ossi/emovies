import pandas as pd
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--title")
args = parser.parse_args()

title = args.title
df = pd.read_csv("titles_to_scrap.csv")
idx = df.index[df['titleId']==title][0]
print(idx)
#print(df.index[df['titleId']])



