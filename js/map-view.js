
var map;
var markerArray = [];
      function initMap() {

        map = new google.maps.Map(document.getElementById('map'), {

         center:({lat:neighborhood.latitude, lng:neighborhood.longitude}),
          zoom: 14
        });

       	initializeMarkers(geoLocations);
      }

      function initializeMarkers(geoLocations){
      	for(var i=0; i<geoLocations.length ; i++){
        var marker = new google.maps.Marker({
    	position: {lat:geoLocations[i].latitude, lng:geoLocations[i].longitude},
    	map: map,
    	title: geoLocations[i].name
    })
        markerArray.push(marker);
  	};
      }

      function updateMarkers(){
      	for(var i=0; i<placeList().length ; i++){
        var marker = new google.maps.Marker({
    	position: {lat:placeList()[i].latitude(), lng:placeList()[i].longitude()},
    	map: map,
    	title: placeList()[i].name()
    })
  	};
    }

    	function removeMarkers(){
    		for(var i = 0; i<markerArray.length;i++){
    			markerArray[i].setMap(null);
    		}
    	}




