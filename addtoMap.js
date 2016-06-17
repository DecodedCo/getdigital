function drawpoints(data){
 	for(i = 0; i < data.length; i++) {  
	  	var point = new google.maps.LatLng(data[i].location.coordinates.latitude, data[i].location.coordinates.longitude);
	    
	    var icon = {
	    	url: "https://www.clker.com/cliparts/Y/y/f/f/p/U/atm-machine-sign-hi.png",
	        scaledSize: new google.maps.Size(30, 30), // scaled size
	        origin: new google.maps.Point(0,0), // origin
	        anchor: new google.maps.Point(0, 0), // anchor
	    }; // End icon

	    var marker = new google.maps.Marker({
	    	position: point,
	      	map: map,
	      	labelClass: "label",
	     	 optimized:false
	    });
    } 
}