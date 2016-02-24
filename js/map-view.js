var map;
      function initMap() {

        map = new google.maps.Map(document.getElementById('map'), {

         center:({lat:neighborhood.latitude, lng:neighborhood.longitude}),
          zoom: 14
        });

        for(var i=0; i<geoLocations.length ; i++){
        var marker = new google.maps.Marker({
    	position: {lat:geoLocations[i].latitude, lng:geoLocations[i].longitude},
    	map: map,
    	title: geoLocations[i].name
    })
  	};

      }


