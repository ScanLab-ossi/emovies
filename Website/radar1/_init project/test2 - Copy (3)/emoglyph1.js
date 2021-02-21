
(function(emovis){

	emovis.bigSlideAPI = undefined;

	emovis.movieRatingFilterValue = undefined;
	emovis.movieFromYearFilter = undefined;
	emovis.movieToYearFilter = undefined;
	emovis.movieTitleFilter = undefined;
	emovis.movieDirectorFilter = undefined;
	emovis.movieWriterFilter = undefined;
	emovis.movieCastFilter = undefined;
	emovis.moviewGenreFilter = undefined;

	emovis.allDirectors = new Set();
	emovis.allWriters = new Set();
	emovis.allTitles = new Set();
	emovis.allCast = new Set();
	emovis.allMovieGenres = new Set();

	emovis.getAllDirectors = function(){
		return emovis.allDirectors;
	}

	emovis.getAllWriters = function(){
		return emovis.allWriters;
	}

	emovis.getAllTitles = function(){
		return emovis.allTitles;
	}

	emovis.getAllCast = function(){
		return emovis.allCast;
	}

	emovis.getAllMovieGenres = function(){
		return emovis.allMovieGenres;
	}

	emovis.disableFilters = function(){
		$(".filters-sidebar").accordion('disable');
		$(".emotion-range").each(function () {
			$(this).slider("disable");
		});
		$(".star-rating-checkbox").each(function(){
			this.setAttribute('disabled',true);
		});
		$(".movieYearSelect").each(function(){
			this.setAttribute('disabled',true);
		});
		$(".movie-info-filter-input-box").each(function(){
			this.setAttribute('disabled',true);
		});
		$(".filter-action")[0].setAttribute('disabled',true);
	}

	emovis.enableFilters= function(){
		$(".filters-sidebar").accordion('enable');
		$(".emotion-range").each(function () {
			$(this).slider("enable");
		});
		$(".star-rating-checkbox").each(function(){
			this.removeAttribute('disabled');
		});
		$(".movieYearSelect").each(function(){
			this.removeAttribute('disabled');
		});
		$(".movie-info-filter-input-box").each(function(){
			this.removeAttribute('disabled');
		});
		$(".filter-action")[0].removeAttribute('disabled');
	}

	emovis.showLoadingWheel = function(){
		$('.ui-progressbar').removeClass('hide');
	}

	emovis.hideLoadingWheel = function(){
		$('.ui-progressbar').addClass('hide');
	}

	emovis.doFilter = function(){
		emovis.showLoadingWheel();
		var filters = emovis.getFilters();
		var filteredData = emovis.filterData(filters);
		emovis.bigSlideAPI.view.toggleClose();
		emovis.updateUIWithData(filteredData)
		emovis.hideLoadingWheel();
	}

	emovis.updateUIWithData = function(data){
		emovis.loadGraphWithData(data);
	}

	emovis.filterData = function(filters){
		var origData = $("#chart").data('origJson');
		var filteredData = origData.filter((element, index, array) => {
/*
			if((filters.angerLessThan) || (filters.anticipationLessThan) || (filters.joyLessThan) || (filters.trustLessThan) ||
				(filters.fearLessThan) || (filters.surpriseLessThan) || (filters.disgustLessThan) || (filters.sadLessThan)) {
					if(!filters.angerLessThan) {
							filters.angerLessThan = 0;
					}
					if(!filters.anticipationLessThan) {
							filters.anticipationLessThan = 0;
					}

					if(!filters.joyLessThan) {
						filters.joyLessThan = 0;
					}

					if(!filters.trustLessThan) {
							filters.trustLessThan = 0;
					}

					if(!filters.fearLessThan) {
						filters.fearLessThan =0;
					}

					if(!filters.surpriseLessThan) {
						filters.surpriseLessThan = 0;
					}

					if(!filters.disgustLessThan) {
						filters.disgustLessThan = 0;
					}

					if(!filters.sadLessThan) {
						filters.sadLessThan = 0;
					}


					if((element.anger >= ((filters.angerLessThan)/100)) &&
						(element.anticipation >= ((filters.anticipationLessThan)/100)) &&
						(element.joy >= ((filters.joyLessThan)/100)) &&
						(element.trust >= ((filters.trustLessThan)/100)) &&
						(element.fear >= ((filters.fearLessThan)/100)) &&
						(element.surprise >= ((filters.surpriseLessThan)/100)) &&
						(element.disgust >= ((filters.disgustLessThan)/100)) &&
						(element.sadness >= ((filters.sadLessThan)/100)))
						{
							return true;
						}

				}

*/
			returntrue = false;
			if(filters.angerLessThan) {
//				if(((filters.angerLessThan)/100) >= element.anger){
				if(element.anger >= ((filters.angerLessThan)/100)){
					returntrue = true;
//					return true;
				}
			}
			if(filters.anticipationLessThan) {
//				if(((filters.anticipationLessThan)/100) >= element.anticipation){
				if(element.anticipation >= ((filters.anticipationLessThan)/100)){
					returntrue = true;
//					return true;
				}
			}

			if(filters.joyLessThan) {
//				if(((filters.joyLessThan)/100) >= element.joy){
				if(element.joy >= ((filters.joyLessThan)/100)){
					returntrue = true;
//					return true;
				}
			}

			if(filters.trustLessThan) {
//				if(((filters.trustLessThan)/100) >= element.trust){
				if(element.trust >= ((filters.trustLessThan)/100)){
					returntrue = true;
//					return true;
				}
			}

			if(filters.fearLessThan) {
//				if(((filters.fearLessThan)/100) >= element.fear){
				if(element.fear >= ((filters.fearLessThan)/100)){
					returntrue = true;
//					return true;
				}
			}

			if(filters.surpriseLessThan) {
//				if(((filters.surpriseLessThan)/100) >= element.surprise){
				if(element.surprise >= ((filters.surpriseLessThan)/100)){
					returntrue = true;
//					return true;
				}
			}

			if(filters.disgustLessThan) {
//				if(((filters.disgustLessThan)/100) >= element.disgust){
				if(element.disgust >= ((filters.disgustLessThan)/100)){
					returntrue = true;
//					return true;
				}
			}

			if(filters.sadLessThan) {
//				if(((filters.sadLessThan)/100) >= element.sadness){
				if(element.sadness >= ((filters.sadLessThan)/100)){
					returntrue = true;
//					return true;
				}

			}

			if(filters['rating']){
				var ratingString = filters.rating
				switch (ratingString) {
					case "9+":
						if(element.movie_rating >= 9){
							returntrue = true;
//							return true;
						}
						break;
					case "8+":
						if(element.movie_rating >= 8){
							returntrue = true;
//							return true;
						}
						break;
					case "7+":
						if(element.movie_rating >= 7){
							returntrue = true;
//							return true;
						}
						break;
					case "6+":
						if(element.movie_rating >= 6){
							returntrue = true;
//							return true;
						}
						break;
					case "5+":
						if(element.movie_rating >= 5){
							returntrue = true;
//							return true;
						}
						break;
					case "4+":
						if(element.movie_rating >= 4){
							returntrue = true;
//							return true;
						}
						break;
					case "3+":
						if(element.movie_rating >= 3){
							returntrue = true;
//							return true;
						}
						break;
					case "2+":
						if(element.movie_rating >= 2){
							returntrue = true;
//							return true;
						}
						break;
					case "1+":
						if(element.movie_rating >= 1){
							returntrue = true;
//							return true;
						}
//						break;
				}
			}

			if(filters.fromYear && filters.toYear){
				var fromYear = Number.parseInt(filters.fromYear)
				var toYear = Number.parseInt(filters.toYear)
				if((element.release_year >= fromYear && element.release_year <= toYear)){
							returntrue = true;
//							return true;
				}
			}

			if(filters.title){
				if(element.movieTitle.indexOf(filters.title) > -1){
							returntrue = true;
//							return true;
				}
			}

			if(filters.director){
				if(element.movie_directors.indexOf(filters.director) > -1){
							returntrue = true;
//							return true;
				}
			}

			if(filters.writer){
				if(element.movie_writers.indexOf(filters.writer) > -1){
							returntrue = true;
//							return true;
				}
			}

			if(filters.cast){
				if(element.movie_stars.indexOf(filters.cast) > -1){
							returntrue = true;
//							return true;
				}
			}

			if(filters.genre){
				if(element.movie_genres.indexOf(filters.genre) > -1){
							returntrue = true;
//							return true;
				}
			}

			return returntrue
//			return false;
		});
		console.log('filter Data', filteredData);
		return filteredData;
	}

	emovis.getFilters = function(){
		var angerValue = $('.emotion-range.anger').slider( "value" );
		var anticipationValue = $('.emotion-range.anticipation').slider( "value" );
		var joyValue = $('.emotion-range.joy').slider( "value" );
		var trustValue = $('.emotion-range.trust').slider( "value" );
		var fearValue = $('.emotion-range.fear').slider( "value" );
		var surpriseValue = $('.emotion-range.surprise').slider( "value" );
		var sadValue = $('.emotion-range.sadness').slider( "value" );
		var disgustValue = $('.emotion-range.disgust').slider( "value" );

		var filterJson = {};

		if(angerValue > 0){
			filterJson['angerLessThan'] = angerValue;
		}
		if(anticipationValue > 0){
			filterJson['anticipationLessThan'] = anticipationValue;
		}
		if(joyValue > 0){
			filterJson['joyLessThan'] = joyValue;
		}
		if(trustValue > 0){
			filterJson['trustLessThan'] = trustValue;
		}
		if(fearValue > 0){
			filterJson['fearLessThan'] = fearValue;
		}
		if(surpriseValue > 0){
			filterJson['surpriseLessThan'] = surpriseValue;
		}
		if(sadValue > 0){
			filterJson['sadLessThan'] = sadValue;
		}
		if(disgustValue > 0){
			filterJson['disgustLessThan'] = disgustValue;
		}

		if(emovis.movieRatingFilterValue){
			filterJson['rating'] = emovis.movieRatingFilterValue;
		}

		if(emovis.movieFromYearFilter){
			filterJson['fromYear'] = emovis.movieFromYearFilter;
		}

		if(emovis.movieToYearFilter){
			filterJson['toYear'] = emovis.movieToYearFilter;
		}

		if(emovis.movieTitleFilter){
			filterJson['title'] = emovis.movieTitleFilter;
		}

		if(emovis.movieDirectorFilter){
			filterJson['director'] = emovis.movieDirectorFilter;
		}


		if(emovis.movieWriterFilter){
			filterJson['writer'] = emovis.movieWriterFilter;
		}

		if(emovis.movieCastFilter){
			filterJson['cast'] = emovis.movieCastFilter;
		}

		if(emovis.moviewGenreFilter){
			filterJson['genre'] = emovis.moviewGenreFilter;
		}

		return filterJson;
	}

	emovis.updateResultsSection = function(filterData){
		emovis.showLoadingWheel();

		var origJson = $("#chart").data('origJson');
		var angerLessThan = filterData.angerLessThan/100;
		var anticipationLessThan = filterData.anticipationLessThan/100;
		var joyLessThan = filterData.joyLessThan/100;
		var trustLessThan = filterData.trustLessThan/100;
		var fearLessThan = filterData.fearLessThan/100;
		var surpriseLessThan = filterData.surpriseLessThan/100;
		var sadLessThan = filterData.sadLessThan/100;
		var disgustLessThan = filterData.disgustLessThan/100;
		var movieInfoContains = filterData.movieInfo;
		var x = new Date().getTime();
		var filteredData = origJson.filter((element, index, array) => {
			if(angerLessThan) {
				return angerLessThan > element.anger ;
			}

			if(anticipationLessThan) {
				return anticipationLessThan > element.anticipation ;
			}

			if(joyLessThan) {
				return joyLessThan > element.joy ;
			}

			if(trustLessThan) {
				return trustLessThan > element.trust ;
			}

			if(fearLessThan) {
				return fearLessThan > element.fear ;
			}

			if(surpriseLessThan) {
				return surpriseLessThan > element.surprise ;
			}

			if(disgustLessThan) {
				return disgustLessThan > element.disgust ;
			}

			if(sadLessThan) {
				return sadLessThan > element.sadness ;
			}

			if(movieInfoContains){
				var titleHas = movieTitle.indexOf(movieInfoContains);
				var directorsHas = movie_directors.indexOf(movieInfoContains);
				var writersHas = movie_writers.indexOf(movieInfoContains);
				var starsHas = movie_stars.indexOf(movieInfoContains);
				var generesHas = movie_genres.indexOf(movieInfoContains);
				var releaseYearHas = release_year.indexOf(movieInfoContains);
				return (titleHas || directorsHas || writersHas || starsHas || generesHas || releaseYearHas);
			}
			console.log(index);
		});

		var y = new Date().getTime();
		console.log(y-x);
		emovis.createFilterResultSections(filteredData);
		emovis.hideLoadingWheel();
	}

	emovis.createFilterResultSections = function(filteredMovieData){
		var x1 = new Date().getTime();
		var resultsAccordion = $('#results-accordion');
		resultsAccordion[0].innerHTML = '';
		filteredMovieData.forEach(function(movie){
			var sectionHeaderElem = $('<h3>'+ movie.movieTitle +'</h3>');
			//var sectionContentContainerElem = $('<div class="results-accordion-section-contianer"></div>');

			//var sectionContent = "<div> <span>Id: </span> <span>"+ movie.movie_id +"</span> </div>" +
								 "<div> <span>Title: </span> <span>"+ movie.movieTitle +" </span> </div>" +
								 "<div> <span>Anger: </span> <span>"+ movie.anger +" </span> </div>" +
								 "<div> <span>Anticipation: </span>"+ movie.anticipation +" <span> </span> </div>" +
								 "<div> <span>Joy: </span> <span>"+ movie.joy +" </span> </div>" +
								 "<div> <span>Trust: </span> <span>"+ movie.trust +" </span> </div>" +
								 "<div> <span>Fear: </span> <span>"+ movie.fear +" </span> </div>" +
								 "<div> <span>Surprise: </span> <span>"+ movie.surprise +" </span> </div>" +
								 "<div> <span>Disgust: </span> <span>"+ movie.disgust +" </span> </div>" +
								 "<div> <span>Sad: </span> <span>"+ movie.sadness +" </span> </div>" +
								 "<div> <span>Total: </span> <span>"+ movie.Total +" </span> </div>" +
								 "<div> <span>Rating: </span> <span>"+ movie.movie_rating +" </span> </div>" +
								 "<div> <span>Directors: </span> <span>"+ movie.movie_directors +" </span> </div>" +
								 "<div> <span>Writers: </span> <span>"+ movie.movie_writers +" </span> </div>" +
								 "<div> <span>Cast: </span> <span>"+ movie.movie_stars +" </span> </div>" +
								 "<div> <span>Genre: </span> <span>"+ movie.movie_genres +" </span> </div>" +
								 "<div> <span>Release: </span> <span>"+ movie.release_year +" </span> </div>";
			//var sectionContent = $(sectionContent);
			//sectionContentContainerElem.append(sectionContent);
			resultsAccordion.append(sectionHeaderElem);//.append(sectionContentContainerElem);
		});
	}

	emovis.turnOffFilters = function(){
		var origData = $("#chart").data('origJson');
		emovis.loadGraphWithData(origData);
	}

	emovis.resetFilters = function(){
		$(".emotion-range").each(function () {
			$(this).slider("value",0);
		});
		$('.star-rating-checkbox').prop('checked', false);

		$( '.filter-movie-genre' ).val("NONE");
		$( '.filter-movie-genre' ).selectmenu( "refresh" );

		$(".movie-info-filter-input-box").val("");
	}

	emovis.loadGraphWithData = function(data, isInit){
		function getConfig(filters){
			var width= $("#chart").width(),
				height=$("#chart").height(),
				margin=5;
			return {
				  size:12,
				  emotions: emotions,
				  colors1: colors1,
				  colors: colors,
				  colors0: colors0,
				  colors2: colors2,
				  title: "movieTitle",
				  total: "Total",
				  width:width-margin-margin,
				  height:height-margin-margin,
				  filters:filters,
				};
		  }

		  function doFilters(filters){
			//console.log(zData);
			//d3.selectAll("svg").remove();
			svg = d3.selectAll("svg");
			d3.selectAll(".glyph").remove();

			var emoChart = new emovis.emoglyph(padding,iMax, iMin, svg,zData,getConfig(filters,xMin,xMax,yMin,yMax));
		  }
		  function brushended() {
			var s = d3.event.selection;
			var scale = 1;
			console.log(s);
			if (!s) {
			  if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
			  x.domain(x0);
			  y.domain(y0);
			} else {
			  x.domain([s[0][0], s[0][1]].map(x.invert, x));
			  y.domain([s[1][0], s[1][1]].map(y.invert, y));
			  svg.select(".brush").call(brush.move, null);
			  scale = s[0][0]/s[1][1];
			}
			//console.log(scale);
			//svg.attr('transform', 'translate(' + s[0][1] + ',' + s[1][1] + ') scale(' + scale + ')');
			svg.attr('transform', 'scale(' + scale + ')');
			//zoom();
		  }

		  function idled() {
			idleTimeout = null;
		  }

		  function zoom() {
			var t = svg.transition().duration(750);

			//console.log(d3.event.transform );
			// svg.select(".axis--x").transition(t).call(xAxis);
			// svg.select(".axis--y").transition(t).call(yAxis);
			// svg.selectAll(".glyph rect").transition(t)
			//     .attr("x", function(d) {
			//       console.log(d.x);
			//       return x(d.x);
			//     })
			//     .attr("y", function(d) {
			//       console.log(d.y);
			//       return y(d.y);
			//     });
		  }


		  var w = 1000;
		var h = 500;
		var padding = 5;
		var xMax = 0;
		var yMax = 0;
		var xMin = 99999;
		var yMin = 99999;
		var iMax = {anger:0, anticipation:0, joy:0, trust:0, fear:0, surprise:0, sadness:0, disgust:0};
		var iMin = {anger:100, anticipation:100, joy:100, trust:100, fear:100, surprise:100, sadness:100, disgust:100};

		var filters = '';
		var zData;
		var emotions = ['anger', 'anticipation' , 'joy' , 'trust' , 'fear' , 'surprise' , 'sadness', 'disgust' ];
		var colors1 = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5'];
		var colors = ['#e41a1c','#ff7f00','#ffff33','#b2df8a','#4daf4a','#f781bf','#377eb8','#984ea3'];
//		var colors = ['#FF0000','#FFA500','#FFFF00','#00FF00','#008000','#3BB9FF','#6960EC','#FF00FF'];
		var colors0 = ["#FF7200","#FFE736","#00AE00","#D10000","#007700","#DC00DD","#0000C5","#007DDF"];
		var colors2 = ["#000000","#DF0101","#08298A","#0080FF","#424242","#585858","#848484","#BDBDBD"];


		var width= $("#chart").width(),
		height= $("#chart").height(),
		//height=383,
		margin=10;
		var k = height / width,
		x0 = [-4.5, 4.5],
		y0 = [-4.5 * k, 4.5 * k],
		x = d3.scaleLinear().domain(x0).range([0, width]),
		y = d3.scaleLinear().domain(y0).range([height, 0]),
		z = d3.scaleOrdinal(d3.schemeCategory10);

		var xAxis = d3.axisTop(x).ticks(12),
		yAxis = d3.axisRight(y).ticks(12 * height / width);

		var createNew = (d3.select("#chart > svg").size() == 0);

		var svg;
		if(createNew){
			svg = d3.select("#chart").append("svg");
		}else {
			svg = d3.select("#chart > svg");
			d3.selectAll("svg > *").remove();
		}
		svg.attr("width", width-margin-margin)
		.attr("height", height-margin-margin)
		.on("dblclick.zoom", null)
		.call(d3.zoom().on("zoom", function () {
		  //console.log(d3.event.transform );
		  svg.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
		 }))
		.append("g")
		.attr("transform","translate("+margin+","+margin+")");

		var brush = d3.brush().on("end", brushended),
		idleTimeout,
		idleDelay = 350;

		svg.append("g")
		.attr("class", "brush")
		.call(brush);

        data.forEach(function(d){
          //console.log(d);
          if (parseFloat(d['x']) > xMax) {xMax = parseFloat(d['x'])};
          if (parseFloat(d['y']) > yMax) {yMax = parseFloat(d['y'])};
          if (parseFloat(d['x']) < xMin) {xMin = parseFloat(d['x'])};
          if (parseFloat(d['y']) < yMin) {yMin = parseFloat(d['y'])};

          if (parseFloat(d['anger']) > iMax.anger) {iMax.anger = parseFloat(d['anger'])};
          if (parseFloat(d['anticipation']) > iMax.anticipation) {iMax.anticipation = parseFloat(d['anticipation'])};
          if (parseFloat(d['joy']) > iMax.joy) {iMax.joy = parseFloat(d['joy'])};
          if (parseFloat(d['trust']) > iMax.trust) {iMax.trust = parseFloat(d['trust'])};
          if (parseFloat(d['fear']) > iMax.fear) {iMax.fear = parseFloat(d['fear'])};
          if (parseFloat(d['surprise']) > iMax.surprise) {iMax.surprise = parseFloat(d['surprise'])};
          if (parseFloat(d['sadness']) > iMax.sadness) {iMax.sadness = parseFloat(d['sadness'])};
          if (parseFloat(d['disgust']) > iMax.disgust) {iMax.disgust = parseFloat(d['disgust'])};

          if (parseFloat(d['anger']) < iMin.anger) {iMin.anger = parseFloat(d['anger'])};
          if (parseFloat(d['anticipation']) < iMin.anticipation) {iMin.anticipation = parseFloat(d['anticipation'])};
          if (parseFloat(d['joy']) < iMin.joy) {iMin.joy = parseFloat(d['joy'])};
          if (parseFloat(d['trust']) < iMin.trust) {iMin.trust = parseFloat(d['trust'])};
          if (parseFloat(d['fear']) < iMin.fear) {iMin.fear = parseFloat(d['fear'])};
          if (parseFloat(d['surprise']) < iMin.surprise) {iMin.surprise = parseFloat(d['surprise'])};
          if (parseFloat(d['sadness']) < iMin.sadness) {iMin.sadness = parseFloat(d['sadness'])};
		  if (parseFloat(d['disgust']) < iMin.disgust) {iMin.disgust = parseFloat(d['disgust'])};

		  if(isInit){
				emovis.allTitles.add(d['movieTitle']);
			  	if(d['movie_directors']){
				  var directorsSplitted = d['movie_directors'].split("&");
				  directorsSplitted.forEach(function(director){
					emovis.allDirectors.add(director.trim());
				  });
			  	}
			  	if(d['movie_writers']){
					var writersSplitted = d['movie_writers'].split("&");
					writersSplitted.forEach(function(writer){
					emovis.allWriters.add(writer.trim());
					});
				}
				if(d['movie_stars']){
					var starsSplitted = d['movie_stars'].split("&");
					starsSplitted.forEach(function(star){
						emovis.allCast.add(star.trim());
					});
				}
				if(d['movie_genres']){
					var genresSplitted = d['movie_genres'].split("&");
					genresSplitted.forEach(function(genre){
						emovis.allMovieGenres.add(genre.trim());
					});
				}
		  }
        });//end data.forEach(function(d)

        //zData = data;
        // creates an EMOCHART from the data, with the defined configuration object
        // console.log(xMin+'::'+xMax);
        // console.log(yMin+'::'+yMax);
		var emoChart = new emovis.emoglyph(padding,iMax, iMin, svg,data,getConfig(filters),xMin,xMax,yMin,yMax);

		if(isInit){
			var titlesSource = Array.from(emovis.getAllTitles());
			$(".filter-movie-title").autocomplete({
				  source: titlesSource
			});

			var directorsSource = Array.from(emovis.getAllDirectors());
			$(".filter-movie-director").autocomplete({
				  source: directorsSource
			});

			var writersSources = Array.from(emovis.getAllWriters());
			$(".filter-movie-writer").autocomplete({
				  source: writersSources
			});

			var castSource = Array.from(emovis.getAllCast());
			$(".filter-movie-cast").autocomplete({
				  source: castSource
			});

			var genresSources = Array.from(emovis.getAllMovieGenres());
			var genreMenu = $(".filter-movie-genre");
			genreMenu.selectmenu();

			genresSources.forEach(function(genre){
				genreMenu.append($('<option>', {
					value: genre,
					text: genre
				}));
			});
			genreMenu.selectmenu("enable");
		}
	  }

	emovis.emoglyph = function(padding, iMax, iMin, svg,data,config,xMin,xMax,yMin,yMax){
		// console.log(padding);
		// console.log(iMax);
		// console.log(iMin);
		// console.log(svg);
		// console.log(data);
		// console.log(config);
		// global variables set onlly once from the config, with default values
		var emotions = config.emotions || ['anger', 'anticipation' , 'joy' , 'trust' , 'fear' , 'surprise' , 'sadness', 'disgust' ];
		var colors = config.colors || ['#e41a1c','#ff7f00','#ffff33','#b2df8a','#4daf4a','#f781bf','#377eb8','#984ea3'];
//		var colors = config.colors || ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5'];
		//var colors = ['red','green','blue','yellow','ping','purple','grey','black'];
		//var colors = ['red'];
		var title = config.title || "movieTitle"; // attribute name in the data
		var total = config.total || "total"; // attribute name in the data
		var filters = config.filters || '';

		var drawGlyph = function(svg,point){
			var glyphData = []; // new dataset for the 8 emotions
			var counter = 0;	// counts the 8 emotions for the positioning


			//var offset = (config.size || 27)/3*(point[total] || 1) // reletive positioning of the rectangles
			var sizeScale = d3.scaleLinear().range([1,config.size/3]).domain([0,0.15]).clamp(true);
			for (var i = 0; i < 3; i++){
				for (var j=0; j <3; j++){
					if (i!=1 || j!=1){
						//console.log(emotions[counter]);
						//filters = ["joy","fear"];
						//console.log(jQuery.inArray( emotions[counter],filters));
						if(filters === '' || jQuery.inArray( emotions[counter],filters) > -1){
							//console.log(point);
							//console.log(emotions[counter]);
							//console.log(colors[counter % colors.length]);
							if(xScale(+point.x) === 'NaN'){
								//console.log(point.x);
								return;
							}

							glyphData.push({
								x: xScale(+point.x)+j*sizeScale(+point.Total),
								y: yScale(+point.y)+i*sizeScale(+point.Total),
								size: sizeScale(+point.Total),
								//emoValue: (point[emotions[counter]]-(iMin[emotions[counter]]))/ ((iMax[emotions[counter]])-(iMin[emotions[counter]])),
	//						emoValue: "1",    //need to normalize it!!!!!
//								emoValue: (+point[emotions[counter]]),
								emoValue: opacityScale(+point[emotions[counter]]),
								emoType: emotions[counter],
								color: colors[counter % colors.length],
//								color: s(counter,+point[emotions[counter]]),
//								color: s1(+point[emotions[counter]]),
								title: point[title],
								genres: point.movie_genres
							});
								//fCounter++;
							}

							counter++;
							//console.log(counter);
						}
						else{
							glyphData.push({
								x: xScale(+point.x)+j*sizeScale(+point.Total),
								y: yScale(+point.y)+i*sizeScale(+point.Total),
								size: sizeScale(+point.Total),
								//emoValue: (point[emotions[counter]]-(iMin[emotions[counter]]))/ ((iMax[emotions[counter]])-(iMin[emotions[counter]])),
	//						emoValue: "1",    //need to normalize it!!!!!
								emoValue: 0.8,
//								emoValue: opacityScale(+point[emotions[counter]]),
								emoType: 'none',
								color: 'black',
								title: point[title],
								genres: point.movie_genres
							});

						}
					}
				}

				var glyph = svg.append("g").attr("class","glyph");
//console.log(glyphData);
			// adds each of the emotion rectangles to the group
				glyph.selectAll(".emo").data(glyphData).enter().append("rect")
				.attr("x",function(d){
					//console.log(d);
					return (d.x);})
				.attr("y",function(d){
					return (d.y);})
				.attr("width",function(d){
					return d.size;})
				.attr("height",function(d){
					return d.size;})
				.attr("transform",function(d){
					return "translate("+(-d.size/3)+","+(-d.size/3)+")";})
				.style("fill",function(d){
					return d.color;})
				.style("fill-opacity",function(d){
					return d.emoValue;})
				.attr("font-size", "21px")
				.attr("font-weight", "bold")
				.append("svg:title")
				.text(function(d){
//					return "Movie: " + d.title + "\nGenre: " + d.genres + "\nemotion: (" + d.emoType + ":" + d.emoValue + ")";})
					return "Movie: " + d.title + "\nGenre: " + d.genres + "\nemotion: (" + d.emoType + ":" + Math.round(d.emoValue*100)/100 + ")";})
				.attr("class","border");

		}; //end drawGlyph

		// creates a scale function for the opacity / intensity of the emotion-rectangles
		//console.log(d3);
		var opacityScale = d3.scaleLinear()
			.range([0.0,1.0])
			.domain([0,0.4]).clamp(true);

		var s = function(counter, rgbin){
			if (counter==0){RGB1='#e41a1c'}
			if (counter==1){RGB1='#ff7f00'}
			if (counter==2){RGB1='#ffff33'}
			if (counter==3){RGB1='#b2df8a'}
			if (counter==4){RGB1='#4daf4a'}
			if (counter==5){RGB1='#f781bf'}
			if (counter==6){RGB1='#377eb8'}
			if (counter==7){RGB1='#984ea3'}

		return d3.scaleLinear()
		  .interpolate(d3.interpolateRgb)
		  .range([RGB1, "#984ea3"])
		  .domain([-3,3]).clamp(true);
		}

		var s1 = d3.scaleLinear()
		  .interpolate(d3.interpolateRgb)
		  .range(["#e41a1c", "#984ea3"])
		  .domain([-3,3]).clamp(true);

			padding = padding + 50;
		var xScale = d3.scaleLinear().range([padding, config.width - padding * 2]).domain([xMin, xMax]);
		var yScale = d3.scaleLinear().range([config.height - padding, padding]).domain([yMin, yMax]);

		svg.selectAll(".glyph").data(data).enter().call(function(d){
			//console.log(d._groups[0]);
			//d[0].forEach(function(point){
			d._groups[0].forEach(function(point){
				if(point.__data__.x){
					drawGlyph(svg,point.__data__);
					//console.log(point.__data__);
				}

			});
		});

		return this;

	};
	emovis.emoglyph.prototype = {constructor: emovis.emoglyph};

})(this.emovis = {});
