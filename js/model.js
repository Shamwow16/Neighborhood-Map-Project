if (map == null) {
    initMap();
}
/*var searchedPlace = [];
var locationLatLng;
searchBox.addListener('places_changed', function() {
    searchedPlace = searchBox.getPlaces();
    if (searchedPlace.length == 0) {
        return;
    }
    var position_lat = searchedPlace[0].geometry.location.lat();
    var position_lng = searchedPlace[0].geometry.location.lng();
    /*onsole.log(position);
     */
   /* locationLatLng = new google.maps.LatLng(position_lat, position_lng);
    map.setCenter(new google.maps.LatLng(position_lat, position_lng));
    request['location'] = locationLatLng;
    placeService = new google.maps.places.PlacesService(map);
    self.placeService.nearbySearch(request, placesCallback);
    neighborhood.name = searchedPlace[0].address_components[0].short_name + searchedPlace[0].address_components[1].short_name + searchedPlace[0].address_components[2].short_name;

})

if (searchedPlace.length == 0) {
    locationLatLng = new google.maps.LatLng(41.968667, -87.674609);
}*/

/*var locationLatLng = new google.maps.LatLng(41.968667, -87.674609);*/

/*var request = {
    location: locationLatLng, //({lat:41.968667,lng: -87.674609})
    radius: '1000',
    type: 'restaurant',
    rankby: 'distance'
};
*/
var initialPlaces = [];


/*function placesCallback(results, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {
        initialPlaces = results.slice(0, 10);
        dataLoaded(true);
    }
}*/


var geoLocations = [{
        name: 'Big Jones',
        latitude: 41.979444,
        longitude: -87.668036,
        streetAddress: "5347 N Clark St"
    }, {
        name: 'Old Town School of Folk Music',
        latitude: 41.964223,
        longitude: -87.686013,
        streetAddress: "4544 North Lincoln Avenue"
    }, {
        name: 'Riviera Theatre',
        latitude: 41.968852,
        longitude: -87.659878,
        streetAddress: "4746 N Racine Ave"

    }, {
        name: "Mariano's",
        latitude: 41.969294,
        longitude: -87.675058,
        streetAddress: "1800 W Lawrence Ave"
    }, {
        name: "Montrose Beach",
        latitude: 41.965804,
        longitude: -87.636410,
        streetAddress: "4400 North Lake Shore Drive"
    }, {
        name: "The Bongo Room",
        latitude: 41.973190,
        longitude: -87.668225,
        streetAddress: "5022 N Clark St"
    }

]

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


var counter = 0;
var yelpLocations = [];

var yelpData = [];
var dataLoaded = ko.observable(false);

function dataHasLoaded() {
    if (initialPlaces.length != 0) {
        dataLoaded(true);
        return true;
    }

    return false;
}




/*self.showInfoWindowOnClick = function(element) {
    console.log(element.marker);
    self.getInfoWindowContent(self.infoWindow, element.marker);
    self.infoWindow.open(map, element.marker);
}
*/


var geoLocation = function(data) {
    var self = this;
    self.name = ko.observable(data.name);

    /*self.longitude = ko.observable(data.longitude);
    self.latitude = ko.observable(data.latitude);*/
    self.longitude = ko.observable(data.longitude);
    self.latitude = ko.observable(data.latitude);
    self.streetAddress = ko.observable(data.streetAddress);
    self.place_id = ko.observable(data.place_id);
    self.city = "Chicago, IL";
    self.createMarker = function() {
        self.marker = new google.maps.Marker({
            position: { lat: self.latitude(), lng: self.longitude() },
            map: map,
            animation: google.maps.Animation.DROP,
            title: self.name(),
            marker_id: self.place_id()
        })
    };
};

var updatedList = [];
var ViewModel = function() {

    var self = this;
    self.neighborhoodInput = ko.observable('');
    self.places = ko.observableArray([]);
    self.infoWindow = new google.maps.InfoWindow();
    self.selectedLocation = ko.observable('');
    self.selectedLocationName = ko.observable('');
    self.selectedLocationCategory = ko.observable('');
    self.selectedLocationImageUrl = ko.observable('');
    self.selectedLocationRatingUrl = ko.observable('');
    self.selectedLocationSnippetText = ko.observable('');
    self.selectedLocationYelpUrl = ko.observable('');
    self.selectedLocationAddress = ko.observable('');
    self.yelpDataArray = ko.observableArray([]);
    self.categories = ko.observableArray([]);
    self.dataLoaded = ko.observable(false);
    self.selectedCategories = ko.observableArray([]);
    self.wantsCategory = ko.observable(true);
    self.setInfoWindowPosition = function(marker) {
        self.infoWindow.open(map, marker)
    };
    self.filter = ko.observable('');



    self.showInfoWindowOnClick = function(element) {
        console.log(element.marker);
        self.getInfoWindowContent(self.infoWindow, element.marker);
        self.infoWindow.open(map, element.marker);
    }
    self.getYelpData = function(terms) {
        var yelpUrl = "https://api.yelp.com/v2/search";
        var parameters = {
            term: terms,
            location: neighborhood.name,
            limit: 1,
            oauth_consumer_key: '6Chkx9mYhCssQqXHPxvNQQ',
            oauth_token: 'XQRWzlGQFGOlualvBLVTpJYi6EtszzBV',
            oauth_nonce: makeid(),
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_signature_method: 'HMAC-SHA1',
            callback: 'cb'
        }
        var consumerSecret = '-J7YlB_RuZ7mfk3lxM8n0c3nT1s';
        var tokenSecret = 'D7t2lRihVRUyZrGh2gMRZqFLlQ8';
        var signature = oauthSignature.generate('GET', yelpUrl, parameters, consumerSecret, tokenSecret, { encodeSignature: false });
        parameters['oauth_signature'] = signature;


        var settings = {
            url: yelpUrl,
            data: parameters,
            cache: true,
            dataType: 'jsonp',
            success: function(results) {

                /*results.businesses[0].place_id = place_id;*/
                self.yelpDataArray.push(results);
                self.categories.push(results.businesses[0].categories[0][0]);
                counter++;
            },
            error: function(error) {
                // Do stuff on fail
                console.log(error);
            }
        };

        $.ajax(settings);

    }




    self.setInfoWindowContent = function(yelpDataItem) {
        self.selectedLocation(yelpDataItem.businesses[0]);
        self.selectedLocationName(self.selectedLocation().name);
        self.selectedLocationCategory(self.selectedLocation().categories[0][0]);
        self.selectedLocationImageUrl(self.selectedLocation().image_url);
        self.selectedLocationRatingUrl(self.selectedLocation().rating_img_url);
        self.selectedLocationSnippetText(self.selectedLocation().snippet_text);
        self.selectedLocationYelpUrl(self.selectedLocation().url);
        self.selectedLocationAddress(self.selectedLocation().location.display_address[0] + ', ' + self.selectedLocation().location.display_address[1] + ', ' +
            self.selectedLocation().location.display_address[2]);
    };

    self.getInfoWindowContent = function(infowindow, marker) {
        for (var i = 0; i < self.yelpDataArray().length; i++) {
            if (marker.title == self.yelpDataArray()[i].businesses[0].name) {
                self.setInfoWindowContent(self.yelpDataArray()[i]);
                var infoWindowContent = $('#infowindow-content').html();
                infowindow.setContent(infoWindowContent);
            }
        };
    };

    self.initializeInfoWindow = function(infowindow, place) {

        place.marker.addListener('click', function(infowindowCopy, marker) {

            return function() {
                self.getInfoWindowContent(infowindowCopy, marker);
                toggleBounce(marker);
                infowindowCopy.setPosition(marker.position);
                infowindowCopy.open(map, marker);

            }
        }(self.infoWindow, place.marker));

        infowindow.addListener('closeclick', function() {
            if (place.marker.getAnimation() !== null) {
                place.marker.setAnimation(null);
            }
        });


    }



    self.setMapContent = function() {
        self.yelpDataArray([]);
        self.places().forEach(function(place) {
            console.log(place.streetAddress());
            place.createMarker();
            self.getYelpData(place.name());
            self.initializeInfoWindow(self.infoWindow, place);
        })
    }


    self.showInfoWindowOnClick = function(element) {
        self.getInfoWindowContent(self.infoWindow, element.marker);
        toggleBounce(element.marker);
        self.infoWindow.open(map, element.marker);

    }

    /*self.placeService = new google.maps.places.PlacesService(map);
    self.placeService.nearbySearch(request, placesCallback);*/

    self.filterLocationList = ko.computed(function() {




        var search = self.filter().toLowerCase();
        /*if (dataLoaded() == true) {*/
            self.places().forEach(function(place) {
                removeMarker(place.marker);
            });
            self.places([]);
            dataLoaded(false);
            geoLocations.forEach(function(place) {
                self.places().push(new geoLocation(place));
            });
            self.setMapContent();
        /*};*/
        return ko.utils.arrayFilter(self.places(), function(geoLocation) {

            if (geoLocation.name().toLowerCase().indexOf(search) == 0) {

                geoLocation.marker.setMap(map);
                /*self.setInfoWindowPosition(geoLocation.marker);*/
                return true;
            } else {
                removeMarker(geoLocation.marker);
                return false;
            }



            return false;

        })



    }, this);


}

//Click function below prevents submenu from closing on random clicking in the dropdown menu
$('.submenu').on('click', function(event) {
    console.log("Boo");
    event.stopPropagation();
});
ko.applyBindings(new ViewModel);
