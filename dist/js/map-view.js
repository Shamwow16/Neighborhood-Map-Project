function initMap(){map=new google.maps.Map(document.getElementById("map"),{center:{lat:neighborhood.latitude,lng:neighborhood.longitude},zoom:15});var e=map.getCenter();google.maps.event.addDomListener(window,"resize",function(){map.setCenter(e)})}function toggleBounce(e,n){n.forEach(function(n){n.marker_id!=e.marker_id&&n.setAnimation(null)}),null!==e.getAnimation()?e.setAnimation(null):e.setAnimation(google.maps.Animation.BOUNCE)}function removeMarker(e){e.setMap(null)}var contentString='<div id="content">Hello Shamyleeeeee!</div>',map,markerArray=[],searchBox;