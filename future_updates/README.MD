
# Future Updates


## UpdateCurrent.py
1. Gets a current state of the MongoDB
2. The script checks if current title needs to be updates
    * If there are more than 20 new reviews AND it is at least 10% addition
    * Example: 1000 current reviews with additional 50, WILL NOT be scrapper because less than  10%
3. Returns "update.csv" - list of titles required updates


## databaseZero_creation.py

1. Download title.basics.tsv.gz from https://datasets.imdbws.com/
2. EXTRACT IT AND RENAME IT TO "new.tsv"
3. The code will remove all TT's that are not movies and that are older than 2020
4. These are possible new movies required scrapping.



## HOW TO SCRAP?

1. Go to scrapper_linux.py / scrapper_win.py
2. Copy paste the titles gathered from any of the future update scripts into "totalmovies2.csv" 
3. Run scrapper. 




