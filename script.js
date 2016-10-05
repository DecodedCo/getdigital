// Draw the map and centre it on our target.
var map;
var mapLat = 1;
var mapLon = 1;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: mapLat, lng: mapLon},
	  zoom: 12,
	  disableDefaultUI: true
	});
	// Once map has loaded, add the ATMs
	addATMs();
}


// Load our exchange rate data
$.getJSON("", function(result){
	// Run this code on Success
  console.log(result);
  var exchangeContent = "1 GBP = " + result.destinationAmount + " AUD";
  $('#exchangeRate').html(exchangeContent);
});

// This function is called from initMap
function addATMs() {
  $.getJSON("", function(result){
    console.log(result);
    if(!result.responseData){
      alert("No ATMs returned");
      return false;
    }
    var data = result.responseData[0].foundATMLocations;
    console.log(data);
    drawpoints(data);
  });



} // end addATMs

// Draw the ATMs on the map
function drawpoints(data){

  //Define an icon for our markers to overwrite the default
  var icon = {
    url: "http://www.clker.com/cliparts/Y/y/f/f/p/U/atm-machine-sign-hi.png",
    scaledSize: new google.maps.Size(30, 30), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0), // anchor
  }; // End icon

  //Loop through our list o fATMs and put them on the map
  for(i = 0; i < data.length; i++) {  

    // You hgave to create a point first
    var point = new google.maps.LatLng(data[i].location.coordinates.latitude, data[i].location.coordinates.longitude);

    // And then add a marker to the point
    var marker = new google.maps.Marker({
      position: point,
      map: map,
      icon: icon
    });
  } 
}
