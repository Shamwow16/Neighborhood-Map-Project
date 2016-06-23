var contentString = '<div id="content">Hello Shamyleeeeee!</div>';

/*function createInfoWindowContent(geoLocation){
  var contentString = '<div id="info-title">' + geoLocation.name + '</div>' +
  '<div id="info-category">' + geoLocation.categories[0][0] + '</div>';

  return contentString;
}*/

var map;
var infowindow;
var markerArray = [];


function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {

        center: ({ lat: neighborhood.latitude, lng: neighborhood.longitude }),
        zoom: 15


    });
    /* ViewModel.infoWindow = new google.maps.InfoWindow();
     */

    /*var titleDiv = $('#title');
map.controls[google.maps.ControlPosition.TOP_CENTER].push(titleDiv[0]);
var input = document.getElementById('neighborhood-search');
searchBox = new google.maps.places.SearchBox(input);
*/
    var center = map.getCenter();

    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(center);
    })
}







function toggleBounce(marker, markerArray) {
    markerArray.forEach(function(markerItem) {
        if (markerItem.marker_id != marker.marker_id) {
            markerItem.setAnimation(null);
        }
    });
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function removeMarker(marker) {
    marker.setMap(null);
}
