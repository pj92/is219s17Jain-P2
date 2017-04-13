// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

var mCurrentIndex = 0;

function swapPhoto() {
  if(mCurrentIndex < 0)
	{
		mCurrentIndex +=  mImages.length;
	}
  $("#photo").attr('src', mImages[mCurrentIndex].img);
  $(".location").text("Location: "+mImages[mCurrentIndex].location);
	$(".description").text("Description: "+mImages[mCurrentIndex].description);
	$(".date").text("Date: "+mImages[mCurrentIndex].date);

  mCurrentIndex++;

  if(mCurrentIndex >=  mImages.length){
		mCurrentIndex = 0;
	}

}

function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }
    return params;
}
var $_GET = getQueryParams(document.location.search);

var mRequest = new XMLHttpRequest();
var mImages = [];
var mJson;
var mURL;

var mURL;
if($_GET["json"] == undefined)
{
	mURL = "images.json";
}
else{
	mURL = $_GET["json"];
}


mRequest.onreadystatechange = function() {
  if (mRequest.readyState == 4 && mRequest.status == 200) {
    try {
      mJson = JSON.parse(mRequest.responseText);
      console.log(mJson);

      for(var i=0; i < mJson.images.length;i++)
			{
				mImages.push(new GalleryImage(mJson.images[i].imgLocation,mJson.images[i].description,mJson.images[i].date,mJson.images[i].imgPath));
			}

		} catch(err) {
			console.log(err.message);
		}
  }
};

mRequest.open("GET",mURL, true);
mRequest.send();

function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {

	$('.details').eq(0).hide();

  $(".moreIndicator").click(function()
	{
		$( "img.rot90" ).toggleClass("rot270",3000);
		$(".details").slideToggle(1000);

});

window.addEventListener('load', function() {

	console.log('window loaded');

}, false);

function GalleryImage(location, description, date, img) {
  this.location = location;
  this.description = description;
  this.date = date;
  this.img = img;
	}
