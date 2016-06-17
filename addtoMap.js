function drawpoints(data){

	//Define an icon for our markers to overwrite the default
  	var icon = {
    	url: "https://www.clker.com/cliparts/Y/y/f/f/p/U/atm-machine-sign-hi.png",
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
	      	map: map
	    });
    } 
}