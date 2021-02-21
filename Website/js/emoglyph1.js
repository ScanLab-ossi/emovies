(function (emovis) {
    const famousMovieID = ["tt00000012", "tt00000439", "tt00029942","tt00013442"];
    var filterMovieID = [];
    radarchartmovies = [];
    radarchartshow = {};
    radarchartshow1 = [];
    radarchartshow_id = [];
    radarchartshowarray = [];
    radarchartshow_name = [];
    radarchartshow_idnew = [];
    radarchartshow_namenew = [];
    /*
	266543, 435761 - Family
	1588170 - Horror
	1675434, 1049413 - Comedy
	*/
    let newFilteredData = [];
    let selectedGlyphOld;
    let selectedGlyph;

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

    emovis.getAllDirectors = function () {
        return emovis.allDirectors;
    };

    emovis.getAllWriters = function () {
        return emovis.allWriters;
    };

    emovis.getAllTitles = function () {
        return emovis.allTitles;
    };

    emovis.getAllCast = function () {
        return emovis.allCast;
    };

    emovis.getAllMovieGenres = function () {
        return emovis.allMovieGenres;
    };

    emovis.showLoadingWheel = function () {
        $(".ui-progressbar").removeClass("hide");
    };

    emovis.hideLoadingWheel = function () {
        $(".ui-progressbar").addClass("hide");
    };

    emovis.doFilter = function () {
        emovis.showLoadingWheel();
        var filters = emovis.getFilters();
        var filteredData = emovis.filterData(filters);
        //        emovis.bigSlideAPI.view.toggleClose();
        emovis.updateUIWithData(filteredData);
        emovis.hideLoadingWheel();
    };

    emovis.updateUIWithData = function (data) {
        emovis.loadGraphWithData(data);
    };
    emovis.filterData = function (filters) {
        var origData = $("#chart").data("origJson");

        newFilteredData = [];
        if (radarchartshow_id.length > 0) {
            closeDetailsPanel();
        }

        origData.forEach(function (element, index) {
            if (filters.title) {
                //                if(element.movieTitle === filters.title){
                if (element.movieTitle.toLowerCase().indexOf(filters.title.toLowerCase()) > -1) {
                    let el = JSON.parse(JSON.stringify(element));
                    el.filtered = true;
                    if (newFilteredData.lastIndexOf(el) === -1) {
                        newFilteredData.push(el);
                    }
                }
            }

            if (filters.director) {
                if (element.movie_directors.toLowerCase().indexOf(filters.director.toLowerCase()) > -1) {
                    let el = JSON.parse(JSON.stringify(element));
                    el.filtered = true;
                    if (newFilteredData.lastIndexOf(el) === -1) {
                        newFilteredData.push(el);
                    }
                }
            }

            if (filters.writer) {
                if (element.movie_writers.toLowerCase().indexOf(filters.writer.toLowerCase()) > -1) {
                    let el = JSON.parse(JSON.stringify(element));
                    el.filtered = true;
                    if (newFilteredData.lastIndexOf(el) === -1) {
                        newFilteredData.push(el);
                    }
                }
            }

            if (filters.cast) {
                if (element.movie_stars.toLowerCase().indexOf(filters.cast.toLowerCase()) > -1) {
                    let el = JSON.parse(JSON.stringify(element));
                    el.filtered = true;
                    if (newFilteredData.lastIndexOf(el) === -1) {
                        newFilteredData.push(el);
                    }
                }
            }

            /*           if(filters.genre){
                if(element.movie_genres.indexOf(filters.genre) > -1){
                    let el = JSON.parse(JSON.stringify(element));
                    el.filtered = true;
                    if (newFilteredData.lastIndexOf(el) === -1) {
                        newFilteredData.push(el);
                    }
                }
            }

*/

            if (newFilteredData.lastIndexOf(element) === -1) {
                newFilteredData.push(element);
            }
        });
        
        if (
            filters.angerLessThan ||
            filters.anticipationLessThan ||
            filters.joyLessThan ||
            filters.trustLessThan ||
            filters.fearLessThan ||
            filters.surpriseLessThan ||
            filters.disgustLessThan ||
            filters.sadLessThan ||
            filters["rating"] ||
            (filters.fromYear && filters.toYear) ||
            filters.genre
        ) {
            if (filters.angerLessThan == null) {
                filters.angerLessThan = 0;
            }
            if (filters.anticipationLessThan == null) {
                filters.anticipationLessThan = 0;
            }
            if (filters.joyLessThan == null) {
                filters.joyLessThan = 0;
            }
            if (filters.trustLessThan == null) {
                filters.trustLessThan = 0;
            }
            if (filters.fearLessThan == null) {
                filters.fearLessThan = 0;
            }
            if (filters.surpriseLessThan == null) {
                filters.surpriseLessThan = 0;
            }
            if (filters.disgustLessThan == null) {
                filters.disgustLessThan = 0;
            }
            if (filters.sadLessThan == null) {
                filters.sadLessThan = 0;
            }

            var filteredData = newFilteredData.filter((element, index, array) => {
                returntrue = false;
                filterisON = false;

                if (filters.angerLessThan || filters.anticipationLessThan || filters.joyLessThan || filters.trustLessThan || filters.fearLessThan || filters.surpriseLessThan || filters.disgustLessThan || filters.sadLessThan) {
                    filterisON = true;
                    if (
                        Number.parseInt(element["anger-Percentile"]) >= filters.angerLessThan &&
                        Number.parseInt(element["anticipation-Percentile"]) >= filters.anticipationLessThan &&
                        Number.parseInt(element["joy-Percentile"]) >= filters.joyLessThan &&
                        Number.parseInt(element["trust-Percentile"]) >= filters.trustLessThan &&
                        Number.parseInt(element["fear-Percentile"]) >= filters.fearLessThan &&
                        Number.parseInt(element["surprise-Percentile"]) >= filters.surpriseLessThan &&
                        Number.parseInt(element["disgust-Percentile"]) >= filters.disgustLessThan &&
                        Number.parseInt(element["sadness-Percentile"]) >= filters.sadLessThan
                    ) {
                        returntrue = true;
                    }
                }
                
                
                if (element.movieTitle.toLowerCase().indexOf("pursuit") > -1) {
                    abc = 0;
                }

                if (filters["rating"]) {
                    var ratingString = filters.rating;
                    if (Number.parseInt(element.movie_rating) >= Number.parseInt(ratingString)) {
                        if (filterisON && !returntrue) {
                            returntrue = false;
                        } else {
                            returntrue = true;
                        }
                    } else {
                        returntrue = false;
                    }
                    filterisON = true;
                }

                if (filters.genre) {
                    if (element.movie_genres.toLowerCase().indexOf(filters.genre.toLowerCase()) > -1) {
                        //				  var ratingString = filters.rating;
                        //				  if(element.movie_genres.toLowerCase() >= ratingString){
                        if (filterisON && !returntrue) {
                            returntrue = false;
                        } else {
                            returntrue = true;
                        }
                    } else {
                        returntrue = false;
                    }
                    filterisON = true;
                }

                if (filters.fromYear && filters.toYear) {
                    var fromYear = Number.parseInt(filters.fromYear);
                    var toYear = Number.parseInt(filters.toYear);

                    if (Number.parseInt(element.release_year) >= fromYear && Number.parseInt(element.release_year) <= toYear) {
                        if (filterisON && !returntrue) {
                            returntrue = false;
                        } else {
                            returntrue = true;
                        }
                    } else {
                        returntrue = false;
                    }
                    filterisON = true;
                }

                return returntrue;
            });
            return filteredData;
        } else {
            return newFilteredData;
        }
    };

    emovis.getFilters = function () {
        var angerValue = $("#slider-anger").slider("value");
        var anticipationValue = $("#slider-anticipation").slider("value");
        var joyValue = $("#slider-joy").slider("value");
        var trustValue = $("#slider-trust").slider("value");
        var fearValue = $("#slider-fear").slider("value");
        var surpriseValue = $("#slider-surprise").slider("value");
        var sadValue = $("#slider-sadness").slider("value");
        var disgustValue = $("#slider-disgust").slider("value");

        var filterJson = {};

        if (angerValue > 0) {
            filterJson["angerLessThan"] = angerValue;
        }
        if (anticipationValue > 0) {
            filterJson["anticipationLessThan"] = anticipationValue;
        }
        if (joyValue > 0) {
            filterJson["joyLessThan"] = joyValue;
        }
        if (trustValue > 0) {
            filterJson["trustLessThan"] = trustValue;
        }
        if (fearValue > 0) {
            filterJson["fearLessThan"] = fearValue;
        }
        if (surpriseValue > 0) {
            filterJson["surpriseLessThan"] = surpriseValue;
        }
        if (sadValue > 0) {
            filterJson["sadLessThan"] = sadValue;
        }
        if (disgustValue > 0) {
            filterJson["disgustLessThan"] = disgustValue;
        }

        if (emovis.movieRatingFilterValue) {
            filterJson["rating"] = emovis.movieRatingFilterValue;
        }

        if (emovis.movieFromYearFilter) {
            if (emovis.movieFromYearFilter != "NONE") {
                filterJson["fromYear"] = emovis.movieFromYearFilter;
            } else {
                filterJson["fromYear"] = "2003";
            }
        }
        if (emovis.movieToYearFilter) {
            if (emovis.movieToYearFilter != "NONE") {
                filterJson["toYear"] = emovis.movieToYearFilter;
            } else {
                filterJson["toYear"] = "2014";
            }
        }

        //        if (emovis.movieToYearFilter) {
        //            filterJson['toYear'] = emovis.movieToYearFilter;
        //        }

        if (emovis.movieTitleFilter) {
            filterJson["title"] = emovis.movieTitleFilter;
        }

        if (emovis.movieDirectorFilter) {
            filterJson["director"] = emovis.movieDirectorFilter;
        }

        if (emovis.movieWriterFilter) {
            filterJson["writer"] = emovis.movieWriterFilter;
        }

        if (emovis.movieCastFilter) {
            filterJson["cast"] = emovis.movieCastFilter;
        }

        if (emovis.moviewGenreFilter) {
            if (emovis.moviewGenreFilter != "NONE") {
                filterJson["genre"] = emovis.moviewGenreFilter;
            }
        }
        //        if (emovis.moviewGenreFilter) {
        //            filterJson['genre'] = emovis.moviewGenreFilter;
        //        }
        console.log(filterJson);
        return filterJson;
    };

    emovis.updateResultsSection = function (filterData) {
        emovis.showLoadingWheel();
        var origJson = $("#chart").data("origJson");
        var angerLessThan = filterData.angerLessThan / 100;
        var anticipationLessThan = filterData.anticipationLessThan / 100;
        var joyLessThan = filterData.joyLessThan / 100;
        var trustLessThan = filterData.trustLessThan / 100;
        var fearLessThan = filterData.fearLessThan / 100;
        var surpriseLessThan = filterData.surpriseLessThan / 100;
        var sadLessThan = filterData.sadLessThan / 100;
        var disgustLessThan = filterData.disgustLessThan / 100;
        var movieInfoContains = filterData.movieInfo;
        var x = new Date().getTime();
        var filteredData = origJson.filter((element, index, array) => {
            if (angerLessThan) {
                return angerLessThan > element.anger;
            }

            if (anticipationLessThan) {
                return anticipationLessThan > element.anticipation;
            }

            if (joyLessThan) {
                return joyLessThan > element.joy;
            }

            if (trustLessThan) {
                return trustLessThan > element.trust;
            }

            if (fearLessThan) {
                return fearLessThan > element.fear;
            }

            if (surpriseLessThan) {
                return surpriseLessThan > element.surprise;
            }

            if (disgustLessThan) {
                return disgustLessThan > element.disgust;
            }

            if (sadLessThan) {
                return sadLessThan > element.sadness;
            }

            if (movieInfoContains) {
                var titleHas = movieTitle.indexOf(movieInfoContains);
                var directorsHas = movie_directors.indexOf(movieInfoContains);
                var writersHas = movie_writers.indexOf(movieInfoContains);
                var starsHas = movie_stars.indexOf(movieInfoContains);
                var generesHas = movie_genres.indexOf(movieInfoContains);
                var releaseYearHas = release_year.indexOf(movieInfoContains);
                return titleHas || directorsHas || writersHas || starsHas || generesHas || releaseYearHas;
            }
            //            console.log(index);
        });

        var y = new Date().getTime();
        //        console.log(y - x);
        emovis.createFilterResultSections(filteredData);
        emovis.hideLoadingWheel();
    };

    emovis.createFilterResultSections = function (filteredMovieData) {
        var x1 = new Date().getTime();
        var resultsAccordion = $("#results-accordion");
        resultsAccordion[0].innerHTML = "";
        filteredMovieData.forEach(function (movie) {
            var sectionHeaderElem = $("<h3>" + movie.movieTitle + "</h3>");
            //var sectionContentContainerElem = $('<div class="results-accordion-section-contianer"></div>');

            //var sectionContent = "<div> <span>Id: </span> <span>"+ movie.movie_id +"</span> </div>" +
            "<div> <span>Title: </span> <span>" +
                movie.movieTitle +
                " </span> </div>" +
                "<div> <span>Anger: </span> <span>" +
                movie.anger +
                " </span> </div>" +
                "<div> <span>Anticipation: </span>" +
                movie.anticipation +
                " <span> </span> </div>" +
                "<div> <span>Joy: </span> <span>" +
                movie.joy +
                " </span> </div>" +
                "<div> <span>Trust: </span> <span>" +
                movie.trust +
                " </span> </div>" +
                "<div> <span>Fear: </span> <span>" +
                movie.fear +
                " </span> </div>" +
                "<div> <span>Surprise: </span> <span>" +
                movie.surprise +
                " </span> </div>" +
                "<div> <span>Disgust: </span> <span>" +
                movie.disgust +
                " </span> </div>" +
                "<div> <span>Sad: </span> <span>" +
                movie.sadness +
                " </span> </div>" +
                "<div> <span>Total: </span> <span>" +
                movie.Total +
                " </span> </div>" +
                "<div> <span>Rating: </span> <span>" +
                movie.movie_rating +
                " </span> </div>" +
                "<div> <span>Directors: </span> <span>" +
                movie.movie_directors +
                " </span> </div>" +
                "<div> <span>Writers: </span> <span>" +
                movie.movie_writers +
                " </span> </div>" +
                "<div> <span>Cast: </span> <span>" +
                movie.movie_stars +
                " </span> </div>" +
                "<div> <span>Genre: </span> <span>" +
                movie.movie_genres +
                " </span> </div>" +
                "<div> <span>Release: </span> <span>" +
                movie.release_year +
                " </span> </div>";
            resultsAccordion.append(sectionHeaderElem);
        });
    };

    emovis.turnOffFilters = function () {
        var origData = $("#chart").data("origJson");
        emovis.loadGraphWithData(origData);
    };

    emovis.resetFilters = function () {
        $(".emotion-range").each(function () {
            
            $(this).slider("value", 0);
        });
        //        $('.star-rating-checkbox').prop('checked', false);

        $(".movieGenre").val("NONE");
        $(".movieGenre").selectmenu("refresh");
        $("#rating-system").val("");
        $(".movie-info-filter-input-box").val("");
        $(".filter-movie-title").val("");
        emovis.movieTitleFilter = undefined;
        emovis.movieDirectorFilter = undefined;
        emovis.movieWriterFilter = undefined;
        emovis.movieCastFilter = undefined;
        emovis.moviewGenreFilter = undefined;
        emovis.movieFromYearFilter = undefined;
        emovis.movieToYearFilter = undefined;
        $(".movieYearSelect").val("NONE");
        $(".movieYearSelect1").val("NONE");
        radarchartshowarray = [];
        radarchartshow = {};
        radarchartshow1 = [];
        closeDetailsPanel();

        //$s2input.val("1");
        //$s2input.remove();

        $("#slider-anger").slider("value", 0);
        $("#s-anger").text(0);
        $("#slider-joy").slider("value", 0);
        $("#s-joy").text(0);
        $("#s-trust").text(0);
        $("#slider-trust").slider("value", 0);
        $("#s-fear").text(0);
        $("#slider-fear").slider("value", 0);
        $("#s-surprise").text(0);
        $("#slider-surprise").slider("value", 0);
        $("#s-sadness").text(0);
        $("#slider-sadness").slider("value", 0);
        $("#s-disgust").text(0);
        $("#slider-disgust").slider("value", 0);
        $("#s-anticipation").text(0);
        $("#slider-anticipation").slider("value", 0);
        filterMovieID = [];

        emovis.doFilter();
    };

    var iterations = 0
    emovis.loadGraphWithData = function (data, isInit) {
       
        
        function getConfig(filters) {
            var width = $("#chart").width(),
                height = $("#chart").height(),
                margin = 5;
            return {
                size: 18,
                emotions: emotions,
                colors1: colors1,
                colors: colors,
                colors0: colors0,
                colors2: colors2,
                title: "movieTitle",
                total: "Total",
                width: width - margin - margin,
                height: height - margin - margin,
                filters: filters,
            };
        }

        // function idled() {
        // 	idleTimeout = null;
        // }

        var w = 1000;
        var h = 500;
        var padding = 5;
        var xMax = 0;
        var yMax = 0;
        var xMin = 99999;
        var yMin = 99999;
        var iMax = {
            anger: 0,
            anticipation: 0,
            joy: 0,
            trust: 0,
            fear: 0,
            surprise: 0,
            sadness: 0,
            disgust: 0,
        };
        var iMin = {
            anger: 100,
            anticipation: 100,
            joy: 100,
            trust: 100,
            fear: 100,
            surprise: 100,
            sadness: 100,
            disgust: 100,
        };

        var filters = "";
        var zData;
        var emotions = ["anticipation", "joy", "trust", "anger", "fear", "disgust", "sadness", "surprise"];
        var colors = ["#ff1d1d", "#ff7f00", "#ffff09", "#984ea3", "#b2df8a", "#563dda", "#00bfff", "#4daf4a"];
        //        var emotions = ['anger', 'anticipation', 'joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust'];
        var colors1 = ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5"];
        //        var colors = ['#e41a1c', '#ff7f00', '#ffff09', '#b2df8a', '#4daf4a', '#f781bf', '#3a24ae', '#984ea3'];
        //		var colors = ['#FF0000','#FFA500','#FFFF00','#00FF00','#008000','#3BB9FF','#6960EC','#FF00FF'];
        var colors0 = ["#FF7200", "#FFE736", "#00AE00", "#D10000", "#007700", "#DC00DD", "#0000C5", "#007DDF"];
        var colors2 = ["#000000", "#DF0101", "#08298A", "#0080FF", "#424242", "#585858", "#848484", "#BDBDBD"];
        //Dark Colors:
        //var colors_dark = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf']
        //Bright Colors:
        //var colors_bright = ['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6','#ffffcc','#e5d8bd','#fddaec']

        var width = $("#chart").width(),
            height = $("#chart").height(),
            //height=383,
            margin = 10;
        var k = height / width,
            x0 = [-4.5, 4.5],
            y0 = [-4.5 * k, 4.5 * k],
            x = d3.scaleLinear().domain(x0).range([0, width]),
            y = d3.scaleLinear().domain(y0).range([height, 0]),
            z = d3.scaleOrdinal(d3.schemeCategory10);

        var xAxis = d3.axisTop(x).ticks(12),
            yAxis = d3.axisRight(y).ticks((12 * height) / width);

        var createNew = d3.select("#chart > svg").size() == 0;

        //var legendglyph = '<div class="legend"><p align="center">Glyph Legend</p><img src="css/images/emotion-glyph.PNG" height="180" width="180" alt="Movie emotions glyph"></div>';
        //$('#chart').append(legendglyph);

        var zoom = d3
            .zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([
                [0, 0],
                [width, height],
            ])
            .extent([
                [0, 0],
                [width, height],
            ])
            .on("zoom", zoomed);

        var svg;
        if (createNew) {
            svg = d3.select("#chart").append("svg");
        } else {
            svg = d3.select("#chart > svg");
            d3.selectAll("svg > *").remove();
        }
        svg = svg
            .attr("width", width - margin - margin) //g - main container
            .attr("height", height - margin - margin)
            .on("dblclick.zoom", null)
            .call(zoom)
            .append("g")
            .attr("class", "main")
            .attr("transform", "translate(" + margin + "," + margin + ")");

        function brushended() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3.event.transform;
            svg.attr("transform", "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")");
            // context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }
        var iteration = 0;
        data.forEach(function (d) {
            
           
            
            if (parseFloat(d["x"]) > xMax) {
                xMax = parseFloat(d["x"]);
            }
            if (parseFloat(d["y"]) > yMax) {
                yMax = parseFloat(d["y"]);
            }
            if (parseFloat(d["x"]) < xMin) {
                xMin = parseFloat(d["x"]);
            }
            if (parseFloat(d["y"]) < yMin) {
                yMin = parseFloat(d["y"]);
            }

            if (parseFloat(d["anger"]) > iMax.anger) {
                iMax.anger = parseFloat(d["anger"]);
            }
            if (parseFloat(d["anticipation"]) > iMax.anticipation) {
                iMax.anticipation = parseFloat(d["anticipation"]);
            }
            if (parseFloat(d["joy"]) > iMax.joy) {
                iMax.joy = parseFloat(d["joy"]);
            }
            if (parseFloat(d["trust"]) > iMax.trust) {
                iMax.trust = parseFloat(d["trust"]);
            }
            if (parseFloat(d["fear"]) > iMax.fear) {
                iMax.fear = parseFloat(d["fear"]);
            }
            if (parseFloat(d["surprise"]) > iMax.surprise) {
                iMax.surprise = parseFloat(d["surprise"]);
            }
            if (parseFloat(d["sadness"]) > iMax.sadness) {
                iMax.sadness = parseFloat(d["sadness"]);
            }
            if (parseFloat(d["disgust"]) > iMax.disgust) {
                iMax.disgust = parseFloat(d["disgust"]);
            }

            if (parseFloat(d["anger"]) < iMin.anger) {
                iMin.anger = parseFloat(d["anger"]);
            }
            if (parseFloat(d["anticipation"]) < iMin.anticipation) {
                iMin.anticipation = parseFloat(d["anticipation"]);
            }
            if (parseFloat(d["joy"]) < iMin.joy) {
                iMin.joy = parseFloat(d["joy"]);
            }
            if (parseFloat(d["trust"]) < iMin.trust) {
                iMin.trust = parseFloat(d["trust"]);
            }
            if (parseFloat(d["fear"]) < iMin.fear) {
                iMin.fear = parseFloat(d["fear"]);
            }
            if (parseFloat(d["surprise"]) < iMin.surprise) {
                iMin.surprise = parseFloat(d["surprise"]);
            }
            if (parseFloat(d["sadness"]) < iMin.sadness) {
                iMin.sadness = parseFloat(d["sadness"]);
            }
            if (parseFloat(d["disgust"]) < iMin.disgust) {
                iMin.disgust = parseFloat(d["disgust"]);
            }

            if (isInit) {
                emovis.allTitles.add(d["movieTitle"]);
                if (d["movie_directors"]) {
                    var directorsSplitted = d["movie_directors"].split("&");
                    directorsSplitted.forEach(function (director) {
                        emovis.allDirectors.add(director.trim());
                    });
                }
                if (d["movie_writers"]) {
                    var writersSplitted = d["movie_writers"].split("&");
                    writersSplitted.forEach(function (writer) {
                        emovis.allWriters.add(writer.trim());
                    });
                }
                if (d["movie_stars"]) {
                    var starsSplitted = d["movie_stars"].split("&");
                    starsSplitted.forEach(function (star) {
                        emovis.allCast.add(star.trim());
                    });
                }
                if (d["movie_genres"]) {
                    var genresSplitted = d["movie_genres"].split("&");
                    genresSplitted.forEach(function (genre) {
                        emovis.allMovieGenres.add(genre.trim());
                    });
                }
            }
        
        
        }); //end data.forEach(function(d)

        var emoChart = new emovis.emoglyph(padding, iMax, iMin, svg, data, getConfig(filters), xMin, xMax, yMin, yMax);

        if (isInit) {
            var titlesSource = Array.from(emovis.getAllTitles());
            $(".filter-movie-title").autocomplete({
                source: titlesSource
            });
         

            var directorsSource = Array.from(emovis.getAllDirectors());
            $(".filter-movie-director").autocomplete({
                source: directorsSource,
            });

            var writersSources = Array.from(emovis.getAllWriters());

            $(".filter-movie-writer").autocomplete({
                source: writersSources,
            });

            var castSource = Array.from(emovis.getAllCast());
            $(".filter-movie-cast").autocomplete({
                source: castSource,
            });

            var genresSources = Array.from(emovis.getAllMovieGenres());
            var genreMenu = $(".movieGenre");
            genreMenu.selectmenu();

            genresSources.forEach(function (genre) {
                genreMenu.append(
                    $("<option>", {
                        value: genre,
                        text: genre,
                    })
                );
            });
            var titlesSource = Array.from(emovis.getAllTitles());
            $("#filter-movie-title").autocomplete({
                source: titlesSource,
            });
            genreMenu.selectmenu("enable");
        }
   
    
    };

    emovis.emoglyph = function (padding, iMax, iMin, svg, data, config, xMin, xMax, yMin, yMax) {
        /* Colors:
//anger - e41a1c,ff0000
anger - ff1d1d
anticipation - ff7f00
joy - ffff09
disgust - 984ea3
trust - b2df8a
sadness - 3a24ae, 4429d0, 563dda
surprise - 00bfff
fear - 4daf4a





*/

        filterMovieID = [];

        //        console.log('csv = glyphs = ', data);
        // global variables set onlly once from the config, with default values
        //        var emotions = config.emotions || ['anger', 'anticipation', 'joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust'];
        //        var colors = config.colors || ['#e41a1c', '#ff7f00', '#ffff09', '#b2df8a', '#4daf4a', '#f781bf', '#3a24ae', '#984ea3'];
        var emotions = config.emotions || ["anticipation", "joy", "trust", "anger", "fear", "disgust", "sadness", "surprise"];
        var colors = config.colors || ["#ff7f00", "#ffff09", "#b2df8a", "#ff0000", "#4daf4a", "#984ea3", "#563dda", "#00bfff"];
        var emotions_per = ["anticipation-per", "joy-per", "trust-per", "anger-per", "fear-per", "disgust-per", "sadness-per", "surprise-per"];
        var emotions_Percentile = ["anticipation-Percentile", "joy-Percentile", "trust-Percentile", "anger-Percentile", "fear-Percentile", "disgust-Percentile", "sadness-Percentile", "surprise-Percentile"];

        //Dark Colors:
        //		var colors_dark = ['#984ea3','#ffff56','#e41a1c','#ff7f00','#ffff33','#4daf4a','#a65628','#f781bf']  //Peter's colors
        var colors_dark = ["#ff7f00", "#ffff33", "#a65628", "#e41a1c", "#4daf4a", "#f781bf", "#984ea3", "#377eb8"]; //Peter's colors2
        //		var colors_dark = ['#ff7f00','#ffff23','#8acf4e','#ff0000','#4daf4a','#ee39f2','#884692','#00bfff']  // old colors
        //Bright Colors:
        //		var colors_bright = ['#b3cde3','#decbe4','#ccebc5','#fbb4ae','#fed9a6','#ffffcc','#e5d8bd','#fddaec']   //Peter's colors
        var colors_bright = ["#fed9a6", "#ffffcc", "#e5d8bd", "#fbb4ae", "#ccebc5", "#fddaec", "#decbe4", "#b3cde3"]; //Peter's colors2
        //		var colors_bright = ['#ffb060','#ffffa3','#bfe49e','#ff4d4d','#7dc88e','#f7a4fb','#ae6cb8','#b4ecff']   //old colors
        /*
anticipation - colors_dark (ff7f00)ff7f00 , colors_bright (fed9a6)ffb060
joy - colors_dark (ffff33)#ffff23 , colors_bright (ffffcc)#ffffa3
trust - colors_dark (a65628)#8acf4e , colors_bright (e5d8bd)#bfe49e
anger - colors_dark (e41a1c)ff0000 , colors_bright (fbb4ae)#ff4d4d
fear - colors_dark (4daf4a)4daf4a , colors_bright (ccebc5)7dc88e
disgust - colors_dark (984ea3)#ee39f2 , colors_bright (decbe4)#f7a4fb
sadness - colors_dark (f781bf)#884692 , colors_bright (fddaec)#ae6cb8
surprise - colors_dark (377eb8)00bfff , colors_bright (b3cde3)b4ecff
*/
        var extremumsByEmotions = {};
        emotions.map(function (emotion, i) {
            em_per = emotion + "-per";
            extremumsByEmotions[emotion + "_max"] = -Infinity;
            extremumsByEmotions[emotion + "_min"] = Infinity;
        });
        //http://bl.ocks.org/perrie/a567f84d4e8ed7ce5ce9
        data.map(function (movie, i) {
            emotions.map(function (emotion, i) {
                em_per = emotion + "-per";
                extremumsByEmotions[emotion + "_max"] = movie[emotion] > extremumsByEmotions[emotion + "_max"] ? movie[emotion] : extremumsByEmotions[emotion + "_max"];
                //                extremumsByEmotions[emotion + '_min'] = movie[emotion] < extremumsByEmotions[emotion + '_min'] && movie[emotion] > 0 ? movie[emotion] : 0;
                extremumsByEmotions[emotion + "_min"] = movie[emotion] < extremumsByEmotions[emotion + "_min"] && movie[emotion] > 0 ? movie[emotion] : extremumsByEmotions[emotion + "_min"];
                extremumsByEmotions[emotion + "_max"] = "3";
                extremumsByEmotions[emotion + "_min"] = "0";
            });
        });
        //extremumsByEmotions["joy_max"] = "3.285424497";

        var colorsByEmotions = {};
        emotions.map(function (emotion, i) {
            em_per = emotion + "-per";
            var color = d3
                .scaleLinear()
                //                .domain([extremumsByEmotions[emotion + '_min']*0.975, extremumsByEmotions[emotion + '_max']*0.975])  //   *97.5%  so we take 95% of the data according to Zscore distribution
                .domain([extremumsByEmotions[emotion + "_min"], extremumsByEmotions[emotion + "_max"]])
                .interpolate(d3.interpolateHsl)
                .clamp(true)
                .range([d3.hsl(colors_bright[i]).brighter(0.01), d3.hsl(colors_dark[i]).darker(0.05)]); //colors[counter % colors.length]
            colorsByEmotions[emotion] = color;
        });

        //        console.log('extremumsByEmotions', extremumsByEmotions);
        //        console.log('colorsByEmotions', colorsByEmotions);

        var title = config.title || "movieTitle"; // attribute name in the data
        var total = config.total || "total"; // attribute name in the data
        var filters = config.filters || "";

        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        d3.selection.prototype.moveToFront = function () {
            return this.each(function () {
                this.parentNode.appendChild(this);
            });
        };

        var currentSizeCoeff = 1;

        var drawGlyph = function (svg, point) {
            var glyphData = []; // new dataset for the 8 emotions
            var counter = 0; // counts the 8 emotions for the positioning

            var sizeScale = d3
                .scaleLinear()
                .range([1, (currentSizeCoeff * config.size) / 3])
                .domain([0, 0.15])
                .clamp(true);
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if (i != 1 || j != 1) {
                        let key_per = emotions[counter];
                        //                        let key_per = emotions_per[counter];
                        ///                        let key_per = emotions_Percentile[counter];

                        let key = emotions[counter];

                        if (filters === "" || jQuery.inArray(key, filters) > -1) {
                            if (xScale(+point.x) === "NaN") {
                                return;
                            }
                            if (point.filtered) {
                                glyphData.push({
                                    x: xScale(+point.x) + j * sizeScale(+point.Total),
                                    y: yScale(+point.y) + i * sizeScale(+point.Total),
                                    size: sizeScale(+point.Total),
                                    //                                    emoValue: opacityScale(+point[key]),
                                    emoValue: "1",
                                    emoType: key,
                                    color: colorsByEmotions[key](point[key]), //colors[counter % colors.length],
                                    title: point[title],
                                    genres: point.movie_genres,
                                    rating: point.movie_rating,
                                    filtered: point.filtered,
                                    strokewidth: "0.5",
                                    stroke: "red",
                                    movie_id: point.movie_id,
                                });
                            } else {
                                //								if (point[key_per]>=50){
                                if (point[key_per] >= 0) {
                                    glyphData.push({
                                        x: xScale(+point.x) + j * sizeScale(+point.Total),
                                        y: yScale(+point.y) + i * sizeScale(+point.Total),
                                        size: sizeScale(+point.Total),
                                        //                                    emoValue: opacityScale1(+point[key_per]),
                                        emoValue: "1",
                                        emoType: key,
                                        color: colorsByEmotions[key](point[key]),
                                        title: point[title],
                                        genres: point.movie_genres,
                                        rating: point.movie_rating,
                                        filtered: point.filtered,
                                        strokewidth: "0.5",
                                        stroke: "black",
                                    });
                                } else {
                                    glyphData.push({
                                        x: xScale(+point.x) + j * sizeScale(+point.Total),
                                        y: yScale(+point.y) + i * sizeScale(+point.Total),
                                        size: sizeScale(+point.Total),
                                        //                                    emoValue: opacityScale1(+point[key_per]),
                                        emoValue: "1", //opacity
                                        emoType: key,
                                        color: "#f2f2f2",
                                        title: point[title],
                                        genres: point.movie_genres,
                                        rating: point.movie_rating,
                                        filtered: point.filtered,
                                        strokewidth: "0.5",
                                        stroke: "black",
                                    });
                                }
                            }
                        }

                        counter++;
                    } else {
                        if (point.filtered) {
                            glyphData.push({
                                x: xScale(+point.x) + j * sizeScale(+point.Total),
                                y: yScale(+point.y) + i * sizeScale(+point.Total),
                                size: sizeScale(+point.Total),
                                emoValue: 0.8,
                                emoType: "none",
                                color: "#333",
                                title: point[title],
                                genres: point.movie_genres,
                                rating: point.movie_rating,
                                filtered: point.filtered,
                                strokewidth: "4",
                                stroke: "black",
                            });
                        } else {
                            glyphData.push({
                                x: xScale(+point.x) + j * sizeScale(+point.Total),
                                y: yScale(+point.y) + i * sizeScale(+point.Total),
                                size: sizeScale(+point.Total),
                                //                                    emoValue: opacityScale1(+point[key_per]),
                                emoValue: "1",
                                emoType: "none",
                                color: "#f2f2f2",
                                title: point[title],
                                genres: point.movie_genres,
                                rating: point.movie_rating,
                                filtered: point.filtered,
                                strokewidth: "0.5",
                                stroke: "black",
                            });
                        }
                        /*						else {
                            glyphData.push({
                                x: xScale(+point.x) + j * sizeScale(+point.Total),
                                y: yScale(+point.y) + i * sizeScale(+point.Total),
                                size: sizeScale(+point.Total),
                                emoValue: 0.8,
                                emoType: 'none',
                                color: '#333',
                                title: point[title],
                                genres: point.movie_genres,
                                rating: point.movie_rating,
                                filtered: point.filtered

                            });
                        }*/
                    }
                }
            }

            // surrounds the group by a thin rectangle
            svg.append("rect")
                .attr("id", point.movie_id)
                .attr("class", "border")
                .attr("x", xScale(+point.x))
                .attr("y", yScale(+point.y))
                .attr("width", sizeScale(+point.Total) * 3)
                .attr("height", sizeScale(+point.Total) * 3)
                .attr("transform", "translate(" + -sizeScale(+point.Total) / 3 + "," + -sizeScale(+point.Total) / 3 + ")");

            var glyph = svg
                .append("g")
                .attr("class", "glyph")
                /*	.attr("class","border")
				.attr("x",xScale(+point.x) )
				.attr("y",yScale(+point.y) )
				.attr("width",sizeScale(+point.Total)*3)
				.attr("height",sizeScale(+point.Total)*3)
				.attr("transform","translate("+(-sizeScale(+point.Total)/3)+","+(-sizeScale(+point.Total)/3)+")")
		*/
                .each(function () {
                    //toottip
                    var domimentemotions = 0;
                    var content = '<div style=" width: 300px; font-weight: bold; color: #333">';
                    //right panel
                    var deatilsContent = '<div id ="chart1" class="movie-details md"><div class="movie-details-container md" style="position: relative">';
                    //                        deatilsContent += '<span class="closePanel" onclick="closeDetailsPanel()"><i class="fa fa-times-thin fa-2x" aria-hidden="true">Clean</i></span>';

                    //radarchartmovies = deatilsContent;
                    
                    for (let key in point) {
                        if (
                            key === "anger-Percentile" ||
                            key === "fear-Percentile" ||
                            key === "anticipation-Percentile" ||
                            key === "disgust-Percentile" ||
                            key === "joy-Percentile" ||
                            key === "sadness-Percentile" ||
                            key === "surprise-Percentile" ||
                            key === "trust-Percentile"
                        ) {
                            //radarchartmovies = radarchartmovies + key ;
                            let color = "#333";
                            if (key === "anger-Percentile") {
                                radarchartmovies.push({ moviename: point.movie_id, axis: key, value: point[key] });
                                color = "hsl(1, 85%, 57%)";
                            } else if (key === "fear-Percentile") {
                                radarchartmovies.push({ moviename: point.movie_id, axis: key, value: point[key] });
                                color = "hsl(137, 46%, 46%)";
                            } else if (key === "anticipation-Percentile") {
                                radarchartmovies.push({ moviename: point.movie_id, axis: key, value: point[key] });
                                color = "hsl(40, 87%, 56%)";
                            } else if (key === "disgust-Percentile") {
                                radarchartmovies.push({ moviename: point.movie_id, axis: key, value: point[key] });
                                color = "hsl(305, 87%, 60%)";
                            } else if (key === "joy-Percentile") {
                                radarchartmovies.push({ moviename: point.movie_id, axis: key, value: point[key] });
                                color = "hsl(61, 73%, 59%)";
                            } else if (key === "surprise-Percentile") {
                                radarchartmovies.push({ moviename: point.movie_id, axis: key, value: point[key] });
                                color = "hsl(201, 77%, 59%)";
                            } else if (key === "trust-Percentile") {
                                radarchartmovies.push({ moviename: point.movie_id, axis: key, value: point[key] });
                                color = "hsl(21, 43%, 45%)";
                            } else if (key === "sadness-Percentile") {
                                radarchartmovies.push({ moviename: point.movie_id, axis: key, value: point[key] });
                                color = "hsl(251, 33%, 61%)";
                            }
                            let Key = key.substring(0, key.lastIndexOf("-"));
                            //                            content = content + `<p style="margin:0; padding: 5px"><span style="display: inline-block; width: 6px;height: 6px; margin-right: 5px; border-radius: 50%;background: ${color}"></span>${Key}: <b style="float: right; margin-left: 5px; color: ${color}">${(+point[key]).toFixed(2)} %</b></p>` //key.replace('_',' ').capitalize()
                            if (+point[key] >= 50) {
                                domimentemotions++;
                                //                            content = content + `<p style="text-transform: capitalize;margin:0; padding: 5px; font-size:12px; line-height: 0.7;"><span style="display: inline-block; width: 6px;height: 6px; margin-right: 5px; border-radius: 50%;background: ${color}"></span>${Key}: <b style="float: right; margin-left: 5px; color: ${color}">${(+point[key]).toFixed(2)} %</b></p>` //key.replace('_',' ').capitalize()
                                content =
                                    content +
                                    `<p style="text-transform: capitalize;margin:0; padding: 5px; font-size:12px; line-height: 0.7;"><span style="display: inline-block; width: 9px;height: 9px; margin-right: 5px; border-radius: 0%;background: ${color}"></span>${Key}: <b style="float: right; margin-left: 5px; ">${(+point[
                                        key
                                    ]).toFixed(0)} %</b></p>`; //key.replace('_',' ').capitalize()
                            }
                            //                            deatilsContent = deatilsContent + `<p class="movie-details-line md" > <span class="md"> ${Key}:</span> <b class="movie-details-value md" style="color: ${color}"">${(+point[key]).toFixed(2)} %</b></p>` //key.replace('_',' ').capitalize()
                            //deatilsContent3 = +point["anticipation-Percentile"];
                            //                            deatilsContent = deatilsContent + `<p class="movie-details-line md" > <span class="md"> ${Key}:</span> <b class="movie-details-value md" style=""">${(+point[key]).toFixed(0)} %</b></p>` //key.replace('_',' ').capitalize()
                        } else if (key === "movieTitle") {
                            content = content + `<p style="margin:0; padding: 5px"><b style="float: left; margin-left: 0px;">${point[key]}</b></p><p style="margin: 40px 5px 10px 5px; font-size:12px;">Dominant Emotions:</p>`; //key.replace('_',' ').capitalize()
                            deatilsContent = deatilsContent + `<p  class="movie-details-line md"><span class="md">Movie Name: </span><b class="movie-details-value md">${point[key]}</b></p>`; //key.replace('_',' ').capitalize()
                            deatilsContent = deatilsContent + `<p  class="movie-details-line md"><span class="md">Movie ID: </span><b class="movie-details-value md">${point.movie_id}</b></p>`; //key.replace('_',' ').capitalize()
                        } else if (key === "movie_rating" || key === "movie_genres" || key === "movie_directors" || key === "movie_writers" || key === "movie_stars") {
                            let newKey = key.replace(/_/gi, " ");
                            deatilsContent = deatilsContent + `<p class="movie-details-line md"><span class="md">${newKey}:</span> <b class="movie-details-value md">${point[key]}</b></p>`; //key.replace('_',' ').capitalize()
                        } else if (key === "movie_id") {
                            //                            deatilsContent = deatilsContent + `<p  class="movie-details-line md"><span class="md">Link to the movie: </span><b class="movie-details-value md"> <a href="http://dddd.com/${point[key]}" target="_blank" style="text-transform: none">http://dddd.com/${point[key]}</a> </b></p>` //key.replace('_',' ').capitalize()
                        }
                    }
                    // if movie_id's number of digit < 7, to add '0' before the id, for the imdb link
                    movieidlen = point.movie_id;
                    if (Math.ceil(Math.log(point.movie_id) / Math.LN10) < 7) {
                        var movieidlen = (number = ("000" + point.movie_id).slice(-7));
                    }
                    if (domimentemotions == 0) {
                        content = content + '<p style="margin: 4px; font-size:12px;">None</p>';
                    }
                    content = content + `<p style=" margin: 7px; font-size:12px;">Click on the movie <img src="css/images/glyph-black.PNG" height="10" width="10" alt="Emotions glyph"> for details</p>`;
                    deatilsContent =
                        deatilsContent +
                        `<p  class="movie-details-line"><span>iMDB Movie link:</span><b class="movie-details-value"><a target="_blank" rel="Movie Emotions imdb" href="https://www.imdb.com/title/tt${movieidlen}">iMDB</a></b></p>`;
                    //deatilsContent = deatilsContent += point.movie_id;
                    $(d3.select(this).node()).tooltipster({
                        trigger: "hover",
                        arrow: true,
                        side: ["top", "left", "right", "bottom"],
                        content: $(`<div>${content}</div>`),
                        contentAsHTML: true,
                        interactive: true,
                        theme: "tooltipster-shadow",
                        delay: 800,
                        //position: 'right',
                        functionPosition: function (instance, helper, position) {
                            position.coord.top += -20;
                            position.coord.left += 10;
                            return position;
                        },
                        elementOrigin: function () {
                            origin.tooltipster("content", data);
                        },
                    });

                    //$(d3.select(this).node()).attr("class", "border");

                    $(d3.select(this).node()).hover(function (event) {
                        var sel = d3.select(this);
                        sel.moveToFront();
                        //						this.parentNode.firstElementChild.width = "5px";
                        //						d3.select(this).style("width", "5px");
                    });

                    $(d3.select(this).node()).click(function (event) {
                        //console.log('this', this);
                        selectedGlyphOld = selectedGlyph;
                        selectedGlyph = this;
                        this.style.stroke = "blue";
                        this.style.strokeOpacity = 1;
                        // for (let i=0; i<this.childNodes.length; i++) {
                        //     console.log('this', this.childNodes[i].attributes);
                        //     this.childNodes[i].attributes[0].value = +(this.childNodes[i].attributes[0].value) + (+(this.childNodes[i].attributes[2].value)) ;
                        //     this.childNodes[i].attributes[1].value = +(this.childNodes[i].attributes[1].value) + (+(this.childNodes[i].attributes[2].value)) ;
                        //     this.childNodes[i].attributes[2].value = +(this.childNodes[i].attributes[2].value) * 2;
                        //     this.childNodes[i].attributes[3].value = +(this.childNodes[i].attributes[3].value) * 2;
                        //     // console.log('this', this.childNodes[i].attributes[0].value);
                        //     // console.log('this after', this.childNodes[i].attributes);
                        // }
                        // deatilsContent += '<span class="closePanel" onclick="closeDetailsPanel()"><i class="fa fa-times-thin fa-2x" aria-hidden="true"></i></span>';
                        if ($("#chart")[0].lastElementChild.classList[0] === "movie-details") {
                            $("#chart")[0].lastElementChild.remove();
                            selectedGlyphOld.style.stroke = "";
                            selectedGlyphOld.style.strokeOpacity = "";
                        }
                        var pos1 = deatilsContent.indexOf('Movie ID: </span><b class="movie-details-value md">') + 51;
                        var pos2 = deatilsContent.indexOf('</b></p><p class="movie-details-line md"><span class="md">movie rating');
                        var res2 = "" + deatilsContent.substring(pos1, pos2); // Movie ID
                        var pos11 = deatilsContent.indexOf('Movie Name: </span><b class="movie-details-value md">') + 53;
                        var pos12 = deatilsContent.indexOf('</b></p><p  class="movie-details-line md"><span class="md">Movie ID:');
                        var res = "" + deatilsContent.substring(pos11, pos12); // Movie Name
                        //var result = res in radarchartshow;
                        //var result1 = res in radarchartmovies;

                        index = radarchartshow_namenew.indexOf(res);
                        if (index > -1) {
                            radarchartshow_namenew.splice(index, 1);
                        }
                        index = radarchartshow_name.indexOf(res);
                        if (index > -1) {
                            radarchartshow_name.splice(index, 1);
                        }

                        index = radarchartshow_idnew.indexOf(res2);
                        if (index > -1) {
                            radarchartshow_idnew.splice(index, 1);
                        }
                        index = radarchartshow_id.indexOf(res2);
                        if (index > -1) {
                            radarchartshow_id.splice(index, 1);
                        }

                        if (radarchartshow[res2]) {
                            radarchartshow[res2] = null;
                            //radarchartshow1[res] = null;
                            radarchartshow1.splice(radarchartshow1.indexOf(res), 1);
                            //							radarchartshow_id.splice( radarchartshow1.indexOf(res2), 1 );
                            //							radarchartshow_name.splice( radarchartshow1.indexOf(res2), 1 );
                            //							radarchartshow_namenew.splice( radarchartshow1.indexOf(res2), 1 );
                        } else {
                            radarchartshow[res2] = [];
                            radarchartshow1.push(res);
                            //radarchartshow_id.push(res2);

                            //radarchartshow1[res] = [];
                            for (var i = 0; i < radarchartmovies.length; i++) {
                                if (radarchartmovies[i].moviename == res2) {
                                    radarchartshow[res2].push(radarchartmovies[i]);
                                    index = radarchartshow_id.indexOf(res2);
                                    if (index < 0) {
                                        radarchartshow_id.push(res2);
                                    }
                                    index = radarchartshow_name.indexOf(res);
                                    if (index < 0) {
                                        radarchartshow_name.push(res);
                                    }
                                }
                            }
                        }
                        radarchartshowarray = [];
                        radarchartshow_namenew = [];
                        radarchartshow_idnew = [];
                        
                        for (var key in radarchartshow) {
                            if (radarchartshow[key]) {
                                radarchartshowarray.push(radarchartshow[key]);
                                //								radarchartshow_idnew.push(key);
                                //								radarchartshow_namenew.push(radarchartshow_name[key]);
                                index = radarchartshow_id.indexOf(key);
                                index1 = radarchartshow_idnew.indexOf(key);
                                if (index1 < 0 && index > -1) {
                                    radarchartshow_idnew.push(key);
                                    radarchartshow_namenew.push(radarchartshow_name[index]);
                                }
                                //radarchartshow1.push(res)
                            }
                        }

                        for(var i = 0; i < radarchartmovies.length; i++) {
                         var found = false;
							if (radarchartmovies[i].moviename == res) {
								for(var j = 0; j < radarchartshow.length-1; j++) {
									if ((radarchartshow[j].moviename == radarchartmovies[i].moviename) && (radarchartshow[j].axis == radarchartmovies[i].axis)) {
										found = true;
									}
								}
								if (found == false){
									radarchartshow.push({moviename:radarchartmovies[i].moviename,axis:radarchartmovies[i].axis,value:parseFloat(radarchartmovies[i].value,10)});
								}
								radarchartshow.pushIfNotExist(radarchartmovies, function(e) { 
										return e.moviename === radarchartmovies.moviename && e.axis === radarchartmovies.axis; 
									});				
								found = false;
							}

                        }
                        var margin = { top: 100, right: 100, bottom: 100, left: 100 },
                            width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
                            height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
                        var mycfg = {
                            LegendOptions: Object(radarchartshow1),
                            LegendOptions_idnew: Object(radarchartshow_idnew),
                            LegendOptions_namenew: Object(radarchartshow_namenew),
                            //						  LegendOptions: Object.keys(radarchartshow)
                            //						  h: h,
                            //						  maxValue: 0.6,
                            //						  levels: 6,
                            //						  ExtraWidthX: 300
                        };

                        var color = d3.scaleOrdinal().range(["#EDC951", "#CC333F", "#00A0B0"]);
                        /*						var radarChartOptions = {
						  w: width,
						  h: height,
						  margin: margin,
						  maxValue: 100,
						  levels: 5,
						  roundStrokes: true,
						  color: color,
						  LegendOptions: Object.keys(radarchartshow)
						}; */
                        //Call function to draw the Radar chart
                        //RadarChart(".radarChart", radarchartshow, radarChartOptions);
                        $("#chart").append(deatilsContent);

                        //						RadarChart.draw("#radarModal", radarchartshowarray, mycfg);
                        
                        RadarChart.draw("#chart1", radarchartshowarray, mycfg);

                        event.stopPropagation();
                    });
                });

            // check if an element exists in array using a comparer function
            // comparer : function(currentElement)
            Array.prototype.inArray = function (comparer) {
                for (var i = 0; i < this.length; i++) {
                    if (comparer(this[i])) return true;
                }
                return false;
            };

            // adds an element to the array if it does not already exist using a comparer
            // function
            Array.prototype.pushIfNotExist = function (element, comparer) {
                if (!this.inArray(comparer)) {
                    this.push(element);
                }
            };

            // adds each of the emotion rectangles to the group
            glyph
                .selectAll(".emo")
                .data(glyphData)
                .enter()
                .append("rect")
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", function (d) {
                    return d.size;
                })
                .attr("height", function (d) {
                    return d.size;
                })
                .attr("transform", function (d) {
                    return "translate(" + -d.size / 3 + "," + -d.size / 3 + ")";
                })
                .style("fill", function (d) {
                    return d.color;
                })
                .style("fill-opacity", function (d) {
                    return d.emoValue;
                })
                .style("stroke", function (d) {
                    if (d.filtered) {
                        return "red";
                    }
                })
                .style("stroke-width", function (d) {
                    if (d.filtered) {
                        return "2px";
                    }
                })
                //                .style("stroke", function (d) {
                //					if (d.filtered) {
                //						return '2'
                //					}
                //                })
                .attr("font-size", "21px")
                .attr("font-weight", "bold");

            //.attr("class","border");

            glyph
                .selectAll(".emo")
                .data(glyphData)
                .enter()
                .append("g")
                .style("stroke-width", function (d) {
                    if (d.filtered) {
                        filterMovieID.push(d.movie_id);
                        d3.select(this).moveToFront;
                        return "2px";
                    }
                })
                .style("stroke", function (d) {
                    if (d.filtered) {
                        return "blue";
                    }
                });

            // add labels for glyphs

            // add labels for glyphs
            if (famousMovieID.indexOf(point.movie_id) !== -1 && $("#labels")[0].checked) {
                let Poiont = [point];

                glyph
                    .selectAll(".emo")
                    .data(Poiont)
                    .enter()
                    .append("text")
                    .text(function (d) {
                        let that = this;
                        setTimeout(function () {
                            that.parentNode.parentNode.appendChild(that.parentNode);
                        }, 5000);
                        return d.movieTitle;
                    })
                    .attr("x", function (d) {
                        return glyphData[0].x;
                    })
                    .attr("y", function () {
                        return glyphData[0].y;
                    })
                    .attr("fill", function () {
                        return "blue";
                    });
            }

            if (filterMovieID.indexOf(point.movie_id) !== -1) {
                let Poiont = [point];
                glyph
                    .selectAll(".emo")
                    .data(Poiont)
                    .enter()
                    .append("text")
                    .text(function (d) {
                        let that = this;
                        setTimeout(function () {
                            that.parentNode.parentNode.appendChild(that.parentNode);
                        }, 500);
                        return d.movieTitle;
                    })
                    .attr("x", function (d) {
                        return glyphData[0].x;
                    })
                    .attr("y", function () {
                        return glyphData[0].y;
                    })
                    .attr("font-weight", "bold")
                    .attr("fill", function () {
                        return "red";
                    });
            }
        }; //end drawGlyph

        // creates a scale function for the opacity / intensity of the emotion-rectangles
        var opacityScale = d3.scaleLinear().domain([0, 0.4]).range([0.0, 1.0]).clamp(true);

        var opacityScale1 = d3.scaleLinear().domain([49, 50]).range([0.1, 1]).clamp(true);

        var perecentScale = d3.scaleLinear().domain([-3, 3]).range([0, 100]).clamp(true);

        var s = function (counter, rgbin) {
            if (counter == 0) {
                RGB1 = "#e41a1c";
            }
            if (counter == 1) {
                RGB1 = "#ff7f00";
            }
            if (counter == 2) {
                RGB1 = "#ffff09";
            }
            if (counter == 3) {
                RGB1 = "#b2df8a";
            }
            if (counter == 4) {
                RGB1 = "#4daf4a";
            }
            if (counter == 5) {
                RGB1 = "#f781bf";
            }
            if (counter == 6) {
                RGB1 = "#3a24ae";
            }
            if (counter == 7) {
                RGB1 = "#984ea3";
            }

            return d3.scaleLinear().interpolate(d3.interpolateRgb).range([RGB1, "#984ea3"]).domain([-3, 3]).clamp(true);
        };

        var s1 = d3.scaleLinear().interpolate(d3.interpolateRgb).range(["#e41a1c", "#984ea3"]).domain([-3, 3]).clamp(true);

        padding = padding + 50;
        var xScale = d3
            .scaleLinear()
            .range([padding, config.width - padding * 2])
            .domain([xMin, xMax]);
        var yScale = d3
            .scaleLinear()
            .range([config.height - padding, padding])
            .domain([yMin, yMax]);

        svg.selectAll(".glyph")
            .data(data)
            .enter()
            .call(function (d) {
                d._groups[0].forEach(function (point, pointIndex) {
                    if (point.__data__.x) {
                        drawGlyph(svg, point.__data__);
                    }
                });
            });

        $("#chart-slider")
            .off("change")
            .on("change", function () {
                var value = $(this).val();
                currentSizeCoeff = value;
               
                // var glyphs = svg.selectAllg.selectAll(".glyph");
                svg.selectAll(".glyph").remove();
                svg.selectAll(".glyph")
                    .data(data)
                    .enter()
                    .call(function (d) {
                        d._groups[0].forEach(function (point, pointIndex) {
                            if (point.__data__.x) {
                                drawGlyph(svg, point.__data__);
                            }
                        });
                    });
            });
            jQuery(document).ready(function($){
	var timelines = $('.cd-horizontal-timeline'),
		eventsMinDistance = 60;

	(timelines.length > 0) && initTimeline(timelines);

	function initTimeline(timelines) {
		timelines.each(function(){
			var timeline = $(this),
				timelineComponents = {};
			//cache timeline components 
			timelineComponents['timelineWrapper'] = timeline.find('.events-wrapper');
			timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
			timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
			timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
			timelineComponents['timelineDates'] = parseDate(timelineComponents['timelineEvents']);
			timelineComponents['eventsMinLapse'] = minLapse(timelineComponents['timelineDates']);
			timelineComponents['timelineNavigation'] = timeline.find('.cd-timeline-navigation');
			timelineComponents['eventsContent'] = timeline.children('.events-content');

			//assign a left postion to the single events along the timeline
			setDatePosition(timelineComponents, eventsMinDistance);
			//assign a width to the timeline
			var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
			//the timeline has been initialize - show it
			timeline.addClass('loaded');

			//detect click on the next arrow
			timelineComponents['timelineNavigation'].on('click', '.next', function(event){
				event.preventDefault();
				updateSlide(timelineComponents, timelineTotWidth, 'next');
			});
			//detect click on the prev arrow
			timelineComponents['timelineNavigation'].on('click', '.prev', function(event){
				event.preventDefault();
				updateSlide(timelineComponents, timelineTotWidth, 'prev');
			});
			//detect click on the a single event - show new event content
			timelineComponents['eventsWrapper'].on('click', 'a', function(event){
				event.preventDefault();
				timelineComponents['timelineEvents'].removeClass('selected');
				$(this).addClass('selected');
				updateOlderEvents($(this));
				updateFilling($(this), timelineComponents['fillingLine'], timelineTotWidth);
				updateVisibleContent($(this), timelineComponents['eventsContent']);
			});

			//on swipe, show next/prev event content
			timelineComponents['eventsContent'].on('swipeleft', function(){
				var mq = checkMQ();
				( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'next');
			});
			timelineComponents['eventsContent'].on('swiperight', function(){
				var mq = checkMQ();
				( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'prev');
			});

			//keyboard navigation
			$(document).keyup(function(event){
				if(event.which=='37' && elementInViewport(timeline.get(0)) ) {
					showNewContent(timelineComponents, timelineTotWidth, 'prev');
				} else if( event.which=='39' && elementInViewport(timeline.get(0))) {
					showNewContent(timelineComponents, timelineTotWidth, 'next');
				}
			});
		});
	}

	function updateSlide(timelineComponents, timelineTotWidth, string) {
		//retrieve translateX value of timelineComponents['eventsWrapper']
		var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
			wrapperWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', ''));
		//translate the timeline to the left('next')/right('prev') 
		(string == 'next') 
			? translateTimeline(timelineComponents, translateValue - wrapperWidth + eventsMinDistance, wrapperWidth - timelineTotWidth)
			: translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
	}

	function showNewContent(timelineComponents, timelineTotWidth, string) {
		//go from one event to the next/previous one
		var visibleContent =  timelineComponents['eventsContent'].find('.selected'),
			newContent = ( string == 'next' ) ? visibleContent.next() : visibleContent.prev();

		if ( newContent.length > 0 ) { //if there's a next/prev event - show it
			var selectedDate = timelineComponents['eventsWrapper'].find('.selected'),
				newEvent = ( string == 'next' ) ? selectedDate.parent('li').next('li').children('a') : selectedDate.parent('li').prev('li').children('a');
			
			updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotWidth);
			updateVisibleContent(newEvent, timelineComponents['eventsContent']);
			newEvent.addClass('selected');
			selectedDate.removeClass('selected');
			updateOlderEvents(newEvent);
			updateTimelinePosition(string, newEvent, timelineComponents, timelineTotWidth);
		}
	}

	function updateTimelinePosition(string, event, timelineComponents, timelineTotWidth) {
		//translate timeline to the left/right according to the position of the selected event
		var eventStyle = window.getComputedStyle(event.get(0), null),
			eventLeft = Number(eventStyle.getPropertyValue("left").replace('px', '')),
			timelineWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', '')),
			timelineTotWidth = Number(timelineComponents['eventsWrapper'].css('width').replace('px', ''));
		var timelineTranslate = getTranslateValue(timelineComponents['eventsWrapper']);

        if( (string == 'next' && eventLeft > timelineWidth - timelineTranslate) || (string == 'prev' && eventLeft < - timelineTranslate) ) {
        	translateTimeline(timelineComponents, - eventLeft + timelineWidth/2, timelineWidth - timelineTotWidth);
        }
	}

	function translateTimeline(timelineComponents, value, totWidth) {
		var eventsWrapper = timelineComponents['eventsWrapper'].get(0);
		value = (value > 0) ? 0 : value; //only negative translate value
		value = ( !(typeof totWidth === 'undefined') &&  value < totWidth ) ? totWidth : value; //do not translate more than timeline width
		setTransformValue(eventsWrapper, 'translateX', value+'px');
		//update navigation arrows visibility
		(value == 0 ) ? timelineComponents['timelineNavigation'].find('.prev').addClass('inactive') : timelineComponents['timelineNavigation'].find('.prev').removeClass('inactive');
		(value == totWidth ) ? timelineComponents['timelineNavigation'].find('.next').addClass('inactive') : timelineComponents['timelineNavigation'].find('.next').removeClass('inactive');
	}

	function updateFilling(selectedEvent, filling, totWidth) {
		//change .filling-line length according to the selected event
		var eventStyle = window.getComputedStyle(selectedEvent.get(0), null),
			eventLeft = eventStyle.getPropertyValue("left"),
			eventWidth = eventStyle.getPropertyValue("width");
		eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', ''))/2;
		var scaleValue = eventLeft/totWidth;
		setTransformValue(filling.get(0), 'scaleX', scaleValue);
	}

	function setDatePosition(timelineComponents, min) {
		for (i = 0; i < timelineComponents['timelineDates'].length; i++) { 
		    var distance = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][i]),
		    	distanceNorm = Math.round(distance/timelineComponents['eventsMinLapse']) + 2;
		    timelineComponents['timelineEvents'].eq(i).css('left', distanceNorm*min+'px');
		}
	}

	function setTimelineWidth(timelineComponents, width) {
		var timeSpan = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][timelineComponents['timelineDates'].length-1]),
			timeSpanNorm = timeSpan/timelineComponents['eventsMinLapse'],
			timeSpanNorm = Math.round(timeSpanNorm) + 4,
			totalWidth = timeSpanNorm*width;
		timelineComponents['eventsWrapper'].css('width', totalWidth+'px');
		updateFilling(timelineComponents['timelineEvents'].eq(0), timelineComponents['fillingLine'], totalWidth);
	
		return totalWidth;
	}

	function updateVisibleContent(event, eventsContent) {
		var eventDate = event.data('date'),
			visibleContent = eventsContent.find('.selected'),
			selectedContent = eventsContent.find('[data-date="'+ eventDate +'"]'),
			selectedContentHeight = selectedContent.height();

		if (selectedContent.index() > visibleContent.index()) {
			var classEnetering = 'selected enter-right',
				classLeaving = 'leave-left';
		} else {
			var classEnetering = 'selected enter-left',
				classLeaving = 'leave-right';
		}

		selectedContent.attr('class', classEnetering);
		visibleContent.attr('class', classLeaving).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
			visibleContent.removeClass('leave-right leave-left');
			selectedContent.removeClass('enter-left enter-right');
		});
		eventsContent.css('height', selectedContentHeight+'px');
	}

	function updateOlderEvents(event) {
		event.parent('li').prevAll('li').children('a').addClass('older-event').end().end().nextAll('li').children('a').removeClass('older-event');
	}

	function getTranslateValue(timeline) {
		var timelineStyle = window.getComputedStyle(timeline.get(0), null),
			timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
         		timelineStyle.getPropertyValue("-moz-transform") ||
         		timelineStyle.getPropertyValue("-ms-transform") ||
         		timelineStyle.getPropertyValue("-o-transform") ||
         		timelineStyle.getPropertyValue("transform");

        if( timelineTranslate.indexOf('(') >=0 ) {
        	var timelineTranslate = timelineTranslate.split('(')[1];
    		timelineTranslate = timelineTranslate.split(')')[0];
    		timelineTranslate = timelineTranslate.split(',');
    		var translateValue = timelineTranslate[4];
        } else {
        	var translateValue = 0;
        }

        return Number(translateValue);
	}

	function setTransformValue(element, property, value) {
		element.style["-webkit-transform"] = property+"("+value+")";
		element.style["-moz-transform"] = property+"("+value+")";
		element.style["-ms-transform"] = property+"("+value+")";
		element.style["-o-transform"] = property+"("+value+")";
		element.style["transform"] = property+"("+value+")";
	}

	//based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
	function parseDate(events) {
		var dateArrays = [];
		events.each(function(){
			var dateComp = $(this).data('date').split('/'),
				newDate = new Date(dateComp[2], dateComp[1]-1, dateComp[0]);
			dateArrays.push(newDate);
		});
	    return dateArrays;
	}

	function parseDate2(events) {
		var dateArrays = [];
		events.each(function(){
			var singleDate = $(this),
				dateComp = singleDate.data('date').split('T');
			if( dateComp.length > 1 ) { //both DD/MM/YEAR and time are provided
				var dayComp = dateComp[0].split('/'),
					timeComp = dateComp[1].split(':');
			} else if( dateComp[0].indexOf(':') >=0 ) { //only time is provide
				var dayComp = ["2000", "0", "0"],
					timeComp = dateComp[0].split(':');
			} else { //only DD/MM/YEAR
				var dayComp = dateComp[0].split('/'),
					timeComp = ["0", "0"];
			}
			var	newDate = new Date(dayComp[2], dayComp[1]-1, dayComp[0], timeComp[0], timeComp[1]);
			dateArrays.push(newDate);
		});
	    return dateArrays;
	}

	function daydiff(first, second) {
	    return Math.round((second-first));
	}

	function minLapse(dates) {
		//determine the minimum distance among events
		var dateDistances = [];
		for (i = 1; i < dates.length; i++) { 
		    var distance = daydiff(dates[i-1], dates[i]);
		    dateDistances.push(distance);
		}
		return Math.min.apply(null, dateDistances);
	}

	/*
		How to tell if a DOM element is visible in the current viewport?
		http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
	*/
	function elementInViewport(el) {
		var top = el.offsetTop;
		var left = el.offsetLeft;
		var width = el.offsetWidth;
		var height = el.offsetHeight;

		while(el.offsetParent) {
		    el = el.offsetParent;
		    top += el.offsetTop;
		    left += el.offsetLeft;
		}

		return (
		    top < (window.pageYOffset + window.innerHeight) &&
		    left < (window.pageXOffset + window.innerWidth) &&
		    (top + height) > window.pageYOffset &&
		    (left + width) > window.pageXOffset
		);
	}

	function checkMQ() {
		//check if mobile or desktop device
		return window.getComputedStyle(document.querySelector('.cd-horizontal-timeline'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
	}
});

        $("#labels").change(function () {
            emovis.showLoadingWheel();
            svg.selectAll(".glyph").remove();
            svg.selectAll(".glyph")
                .data(data)
                .enter()
                .call(function (d) {
                    d._groups[0].forEach(function (point, pointIndex) {
                        if (point.__data__.x) {
                            drawGlyph(svg, point.__data__);
                            setTimeout(function () {
                                emovis.hideLoadingWheel();
                            }, 5000);
                        }
                    });
                });
        });
        closeDetailsPanel = function () {
            $("#chart")[0].lastElementChild.remove();
            if (radarchartshow_id.length > 0) {
                selectedGlyph.style.stroke = "";
                selectedGlyph.style.strokeOpacity = "";
            }
            radarchartshowarray = [];
            radarchartshow = {};
            radarchartshow1 = [];
            radarchartshowarray = [];
            radarchartshow_name = [];
            radarchartshow_idnew = [];
            radarchartshow_namenew = [];
            radarchartshow_id = [];
        };

        window.onclick = function (event) {
            if ($("#chart")[0].lastElementChild.classList[0] === "movie-details" && event.target.classList[0] !== "md" && event.target.classList[1] !== "md") {
                //   $('#chart')[0].lastElementChild.remove();
                //   selectedGlyph.style.stroke = '';
                //	selectedGlyph.style.strokeOpacity = '';
            }
            if (event.target == $("#myModal")[0]) {
                $("#myModal")[0].style.display = "none";
            }
            event.stopPropagation();
        };

        return this;
    };
    emovis.emoglyph.prototype = {
        constructor: emovis.emoglyph,
    };
})((this.emovis = {}));

