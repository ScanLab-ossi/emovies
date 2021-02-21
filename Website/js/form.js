
class Image {


  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.selected = false;
    this.final = false;
  }


}

let images = []
let selected_videos = []
let temp_response = null;

function collect_selected() {
  for (i in images) {
    if (images[i].selected) {
      selected_videos.push(images[i].id);
      images[i].final = true;
      images[i].selected = false;
    }

  }


}


function select_images() {

  $("#images_row").empty()


  let count = 0;

  while (count < 4) {

    let img = images[Math.floor(Math.random() * images.length)];

    if (!img.final) {
      count++;
      let div = '<div class="col-sm-3">' +
        '<strong>' + img.title + '</strong>' +
        '<div class="flip-card">' +
        ' <div class="flip-card-inner">' +
        '<div class="flip-card-front">' +

        ' <img style=" width: 151px; height: 200px;box-shadow:5px 5px 5px grey;" src="data/top_250/' + img.id + '" class="image" id="' + img.id + '">' +
        '</div>' +
        '<div class="flip-card-back">' +
        '<img style=" width: 151px; height: 200px;box-shadow:5px 5px 5px grey; border: 8px solid #008000; border-radius:8px;" src="data/top_250/' + img.id + '" class="image" id="' + img.id + '">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'


      $("#images_row").prepend(div);
    }

  }
}
// read folder with images
function load_images() {

  return $.ajax({
    url: "data/top_250/",

    success: function (data) {

      $(data).find("a").attr("href", function (i, val) {
        if (val.match(/\.(jpe?g|png|gif)$/) && !val.includes("selected-mark")) {

          val = val.replace('/data/top_250/', '');

          $.ajax({
            method: "POST",
            url: " http://127.0.0.1:5000/getNameById",
            data: JSON.stringify({ "data": val.replace(".jpg", "") }),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
              let img = new Image(val, data);
              images.push(img);

            }
          })
        }
      });
    }

  });// loaded images to memory 
}


function finish() {

  for (let i = 0; i < selected_videos.length; i++) {
    selected_videos[i] = selected_videos[i].replace(".jpg", "")
  }

  $.ajax({
    method: "POST",
    url: "http://127.0.0.1:5000/",
    data: JSON.stringify({ "data": selected_videos }),
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
    },
    complete: function (data) {

      window.location.reload(true);

    }
  });

  images = []
  selected_videos = []

  $("#formModal").modal('hide');
}

$(document).ready(function () {


  $("#formBtnn").click(function () {
    load_images();
  });

  // select a movie
  $("body").on("click", ".image", function () {

    // get image element 
    let img_id = $(this).attr("id");
    let card = $(this).parents(".flip-card");
    let image_obj = null;



    // find object and mark as selected 
    for (let i = 0; i < images.length; i++) {
      if (images[i].id == img_id) {
        image_obj = images[i];
        break;
      }
    }

    // case image was not selected
    if (!image_obj.selected) {

      // mark as selected
      image_obj.selected = true;


      // change HTML
      // remove elements
      card.empty();

      // put selected image
      let div = '<img style=" width: 151px; height: 200px;box-shadow:5px 5px 5px grey; border: 8px solid #008000; border-radius:8px;" src="data/top_250/' + image_obj.id + '"  id="' + image_obj.id + '" class="image" ;>'
      card.prepend(div);
    }

    // case image was already selected
    else {


      // mark image as not selected
      image_obj.selected = false;

      // change HTML
      // remove elements
      card.empty();

      // return html to unselected mode
      let div = ' <div class="flip-card-inner">' +
        '<div class="flip-card-front">' +
        ' <img style="width: 151px; height: 200px; box-shadow:5px 5px 5px grey" src="data/top_250/' + image_obj.id + '" class="image" id="' + image_obj.id + '">' +
        '</div>' +
        '<div class="flip-card-back">' +
        '<img style="width: 151px; height: 200px;" src="data/top_250/' + image_obj.id + '" class="image" id="' + image_obj.id + '">' +
        '</div>' +
        '</div>'

      card.prepend(div);

    }

  });


  // process selected movie

  $("#next").click(function () {

    collect_selected();

    if (selected_videos.length <= 20) {
      select_images();
    } else {
      finish();

    }

  });

  $("#finishBtn").click(function () {
    collect_selected();

    finish();
  });


});
