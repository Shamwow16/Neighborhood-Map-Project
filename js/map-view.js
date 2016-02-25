var contentString = '<div id="content">Hello Shamyleeeeee!</div>';

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
  		initializeInfoWindows(markerArray)

      }

      function initializeInfoWindows(markers){
      	for(var i=0;i<markers.length;i++){
  			var infowindow = new google.maps.InfoWindow(
  			{
    			content: contentString,
    			position: markers[i].position
  			});

  			markers[i].addListener('click', function(infowindowCopy){
  				return function(){
  				infowindowCopy.open(map,markers[i]);
  				console.log(infowindowCopy);
  			}
  			}(infowindow));

   	   }
  }



    	function removeMarkers(){
    		for(var i = 0; i<markerArray.length;i++){
    			markerArray[i].setMap(null);
    		}
    	}




