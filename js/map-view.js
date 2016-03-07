var contentString = '<div id="content">Hello Shamyleeeeee!</div>';

/*function createInfoWindowContent(geoLocation){
  var contentString = '<div id="info-title">' + geoLocation.name + '</div>' +
  '<div id="info-category">' + geoLocation.categories[0][0] + '</div>';

  return contentString;
}*/

var map;
/*var infowindow;*/
var markerArray = [];
var searchBox;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {

        center: ({ lat: neighborhood.latitude, lng: neighborhood.longitude }),
        zoom: 14
    });

    var titleDiv = $('#title');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(titleDiv[0]);
    var input = document.getElementById('neighborhood-search');
    searchBox = new google.maps.places.SearchBox(input);


    /*initializeMarkers(locations);*/
}

/*function initializeMarkers(locations){
        for(var i=0; i<locations.length ; i++){
        var marker = new google.maps.Marker({
      position: {lat:locations[i].latitude, lng:locations[i].longitude},
      map: map,
      title: locations[i].name
    })
        markerArray.push(marker);
    };
      initializeInfoWindows(markerArray)

      }*/

/*var selectedMarker;
      function initializeInfoWindow(infowindow, place){

      /*  infowindow = new google.maps.InfoWindow(
        {
          content: contentString,
        });*/


/*  place.marker.addListener('click', function(infowindowCopy, marker){

          return function(){
          getInfoWindowContent(infowindowCopy,marker);
          toggleBounce();
          infowindowCopy.setPosition(marker.position);
          infowindowCopy.open(map,marker);
        }
        }(infowindow,place.marker));


  }*/

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function removeMarker(marker) {
    marker.setMap(null);
}
