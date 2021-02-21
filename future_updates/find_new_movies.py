import pandas as pd

old = pd.read_csv('database_zero_final.csv', sep=',')
new = pd.read_csv('new2.csv', sep=',')

# for index, row in old.iterrows():
#     print(row['titleId'])
for index, row in new.iterrows():
    print(row['titleId'])