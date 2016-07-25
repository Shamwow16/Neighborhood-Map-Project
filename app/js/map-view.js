var map;
var markerArray = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: ({ lat: neighborhood.latitude, lng: neighborhood.longitude }),
        zoom: 15
    });
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
