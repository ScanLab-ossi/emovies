let dataOrig = null;

/**adds row to table
 * 
 * @param {index} index 
 * @param {data of a movie} row 
 */
function add_row(data, index) {


  let link = "https://www.imdb.com/title/" + data["movie_id"] + "/";

  let row = '<tr id = ' + data["movie_id"] + '>' +
    '<td>' + data["movieTitle"] + '</td>' +
    '<td>' + data["release_year"] + '</td>' +
    '<td>' + data["movie_rating"] + '</td>' +
    '<td>' + (Math.round((data["anticipation-Percentile"]) * 100) / 100).toFixed(2) + '</td>' +
    '<td>' + (Math.round((data["joy-Percentile"]) * 100) / 100).toFixed(2) + '</td>' +
    '<td>' + (Math.round((data["trust-Percentile"]) * 100) / 100).toFixed(2)  + '</td>' +
    '<td>' + (Math.round((data["surprise-Percentile"]) * 100) / 100).toFixed(2) + '</td>' +
    '<td>' + (Math.round((data["anger-Percentile"]) * 100) / 100).toFixed(2) + '</td>' +
    '<td>' + (Math.round((data["fear-Percentile"]) * 100) / 100).toFixed(2) + '</td>' +
    '<td>' + (Math.round((data["disgust-Percentile"]) * 100) / 100).toFixed(2) + '</td>' +
    '<td>' + (Math.round((data["sadness-Percentile"]) * 100) / 100).toFixed(2) + '</td>' +
    '</tr>'

  $("#table_movies").children("tbody").append(row);

};
$(window).on("load resize ", function() {
  var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
  $('.tbl-header').css({'padding-right':scrollWidth});
}).resize();
/** load table with movies table
* 
* @param {loaded movies} data 
*/
function load_table(data) {
  $("#table_movies").children("tbody").empty();
  data.forEach(function (element, index) {
    add_row(element, index)
  });
};


/**color and uncolor a row
 * 
 *  
 * 
 * @param {selected row} row 
 * @param {color it or not} selected 
 */
function color_row(row,selected){
  if (selected) {
    row.style.backgroundColor = "#d3cfcf";
    row.className += " selected";

  } else {
    row.style.backgroundColor = "";
    row.classList.remove('selected');
  }
};

/**get movie by ID
 * 
 * @param {id of a movie} id 
 */
function get_movie(id){
  let movie = null;
  for(let i = 0 ; i < dataOrig.length; i++){
    if(dataOrig[i].movie_id == id){
      movie = dataOrig[i];
    }
  }

  return movie;
};

/**
* Highlights row in the table
* 
*/
function clicked_row() {
  let table = document.getElementById('table_movies');
  let cells = table.getElementsByTagName('td');
  for (let i = 0; i < cells.length; i++) {

    // Take each cell
    let cell = cells[i];

    // do something on onclick event for cell
    cell.onclick = function () {

      // Get the row id where the cell exists
      let rowId = this.parentNode.rowIndex;
      let rowSelected = table.getElementsByTagName('tr')[rowId];

      let selected = !rowSelected.className.includes("selected")


      //TODO connection to glyphs
      color_row(rowSelected,selected);
      movie = get_movie(rowSelected.id)
      update_rader(movie, selected);


    }
  }

};



/**
 * update the rader according to the selection on the table
 * 
 * 
 * @param {titleId of the movie selected in the table} movie_title 
 * @param {boolean which says if the element is selected or not} selected 
 */
function update_rader(point) {

  var domimentemotions = 0;
  var content = '<div style=" width: 300px; font-weight: bold; color: #333">';
  var deatilsContent = '<div id ="chart1" class="movie-details md"><div class="movie-details-container md" style="position: relative">';
  let radarchartmovies = [];

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
      

      if (point[key] >= 50) {
        domimentemotions++;
        content =
          content +
          `<p style="text-transform: capitalize;margin:0; padding: 5px; font-size:12px; line-height: 0.7;"><span style="display: inline-block; width: 9px;height: 9px; margin-right: 5px; border-radius: 0%;background: ${color}"></span>${Key}: <b style="float: right; margin-left: 5px; ">${(+point[
            key
          ]).toFixed(0)} %</b></p>`;
      }
      //deatilsContent = deatilsContent + `<p class="movie-details-line md" > <span class="md"> ${Key}:</span> <b class="movie-details-value md" style=""">${(+point[key]).toFixed(0)} %</b></p>` //key.replace('_',' ').capitalize()
  
    } else if (key === "movieTitle") {

      content = content + `<p style="margin:0; padding: 5px"><b style="float: left; margin-left: 0px;">${point[key]}</b></p><p style="margin: 40px 5px 10px 5px; font-size:12px;">Dominant Emotions:</p>`; //key.replace('_',' ').capitalize()
      deatilsContent = deatilsContent + `<p  class="movie-details-line md"><span class="md">Movie Name: </span><b class="movie-details-value md">${point[key]}</b></p>`; //key.replace('_',' ').capitalize()
      deatilsContent = deatilsContent + `<p  class="movie-details-line md"><span class="md">Movie ID: </span><b class="movie-details-value md">${point.movie_id}</b></p>`; //key.replace('_',' ').capitalize()
    
    } 
    else if (key === "movie_rating" || key === "movie_genres" || key === "movie_directors" || key === "movie_writers" || key === "movie_stars") {

      let newKey = key.replace(/_/gi, " ");
      deatilsContent = deatilsContent + `<p class="movie-details-line md"><span class="md">${newKey}:</span> <b class="movie-details-value md">${point[key]}</b></p>`; //key.replace('_',' ').capitalize()
    
    } 
    else if (key === "movie_id") {

    }
  }
  var movieidlen = point.movie_id;
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


  if ($("#chart")[0].lastElementChild.classList[0] === "movie-details") {
    $("#chart")[0].lastElementChild.remove();
  }

  var pos1 = deatilsContent.indexOf('Movie ID: </span><b class="movie-details-value md">') + 51;
  var pos2 = deatilsContent.indexOf('</b></p><p class="movie-details-line md"><span class="md">movie rating');
  var res2 = "" + deatilsContent.substring(pos1, pos2); // Movie ID
  var pos11 = deatilsContent.indexOf('Movie Name: </span><b class="movie-details-value md">') + 53;
  var pos12 = deatilsContent.indexOf('</b></p><p  class="movie-details-line md"><span class="md">Movie ID:');
  var res = "" + deatilsContent.substring(pos11, pos12); // Movie Name


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
    radarchartshow1.splice(radarchartshow1.indexOf(res), 1);

  } else {
    radarchartshow[res2] = [];
    radarchartshow1.push(res);

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
      index = radarchartshow_id.indexOf(key);
      index1 = radarchartshow_idnew.indexOf(key);
      if (index1 < 0 && index > -1) {
        radarchartshow_idnew.push(key);
        radarchartshow_namenew.push(radarchartshow_name[index]);
      }
      //radarchartshow1.push(res)
    }
  }

  for (var i = 0; i < radarchartmovies.length; i++) {
    var found = false;
    if (radarchartmovies[i].moviename == res) {
      for (var j = 0; j < radarchartshow.length - 1; j++) {
        if ((radarchartshow[j].moviename == radarchartmovies[i].moviename) && (radarchartshow[j].axis == radarchartmovies[i].axis)) {
          found = true;
        }
      }
      if (found == false) {
        radarchartshow.push({ moviename: radarchartmovies[i].moviename, axis: radarchartmovies[i].axis, value: parseFloat(radarchartmovies[i].value, 10) });
      }
      radarchartshow.pushIfNotExist(radarchartmovies, function (e) {
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

  };

  var color = d3.scaleOrdinal().range(["#EDC951", "#CC333F", "#00A0B0"]);


  console.log(d3.selection.prototype.nodes);

  $("#chart").append(deatilsContent);


  RadarChart.draw("#chart1", radarchartshowarray, mycfg);
























}







/**
 * updates map according to the selection of table
 * @param {*} movie_title 
 * @param {*} selected 
 */
function update_map(movie_title, selected) {

}


$(document).ready(function () {

  let filetoload = "data.csv";

  d3.csv('data/' + filetoload, function (data) {
    load_table(data)
    dataOrig = data;
  });


  $("#table_movies").click(function () {
    clicked_row();
  });



});
