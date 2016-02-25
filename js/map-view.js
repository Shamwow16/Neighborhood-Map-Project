var contentString = '<div id="content">Hello Shamyleeeeee!</div>';

/*function createInfoWindowContent(geoLocation){
	var contentString = '<div id="info-title">' + geoLocation.name + '</div>' +
	'<div id="info-category">' + geoLocation.categories[0][0] + '</div>';

	return contentString;
}*/

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

  			var infowindow = new google.maps.InfoWindow(
  			{
    			content: contentString,
  			});

  			for(var i=0;i<markers.length;i++){
  			markers[i].addListener('click', function(infowindowCopy, marker){

  				return function(){
  				infowindowCopy.setPosition(marker.position);
  				infowindowCopy.open(map,marker);
  			}
  			}(infowindow, markers[i]));

   	   }
  }



    	function removeMarkers(){
    		for(var i = 0; i<markerArray.length;i++){
    			markerArray[i].setMap(null);
    		}
    	}




