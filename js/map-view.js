var contentString = '<div id="content">Hello Shamyleeeeee!</div>';

/*function createInfoWindowContent(geoLocation){
	var contentString = '<div id="info-title">' + geoLocation.name + '</div>' +
	'<div id="info-category">' + geoLocation.categories[0][0] + '</div>';

	return contentString;
}*/

var map;
var infowindow;
var markerArray = [];
      function initMap(locations) {

        map = new google.maps.Map(document.getElementById('map'), {

         center:({lat:neighborhood.latitude, lng:neighborhood.longitude}),
          zoom: 14
        });

       	initializeMarkers(locations);
      }

      function initializeMarkers(locations){
      	for(var i=0; i<locations.length ; i++){
        var marker = new google.maps.Marker({
    	position: {lat:locations[i].latitude, lng:locations[i].longitude},
    	map: map,
    	title: locations[i].name
    })
        markerArray.push(marker);
  	};
  		initializeInfoWindows(markerArray)

      }

var selectedMarker;
      function initializeInfoWindows(markers){

  			infowindow = new google.maps.InfoWindow(
  			{
    			content: contentString,
  			});

  			for(var i=0;i<markers.length;i++){
  			markers[i].addListener('click', function(infowindowCopy, marker){

  				return function(){
  				/*selectedMarker = ko.observable(marker);*/
  				/*infowindowCopy.setContent(marker.title);*/
  				/*console.log(marker);*/
  				getInfoWindowContent(marker);
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




