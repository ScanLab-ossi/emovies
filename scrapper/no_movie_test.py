from imdb import IMDb

ia = IMDb()
movie = ia.get_movie('652')
print(movie)