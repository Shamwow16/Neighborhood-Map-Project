if (map == null) {
    initMap();
}

var initialPlaces = [];


var geoLocations = [{
        name: 'Big Jones'
    },
    { name: "Mariano's" },
    { name: "T-Mobile" },
    { name: "Taste of Lebanon" },
    { name: "Foster Avenue Beach" },
    { name: "Pastoral" },
    { name: "Riviera" },
    { name: "Aroy Thai" },
    { name: "LA Fitness" },
    { name: "Primo Chuki's" },
    { name: "Green Mill" },
    { name: "CVS" },
    { name: "Babylon" }
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


var geoLocation = function(data) {
    var self = this;
    self.name = ko.observable(data.name);
    self.selected = ko.observable(false);
    self.createMarker = function(latitude, longitude, placeId) {
        self.marker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            animation: google.maps.Animation.DROP,
            title: self.name(),
            marker_id: placeId
        })
    };
    self.isSelected = function(category) {
        self.selected(true);
    }
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
        self.categoryArray = ko.observableArray([]);
        self.dataLoaded = ko.observable(false);
        self.selectedCategories = ko.observableArray([]);
        self.wantsCategory = ko.observable(true);
        self.setInfoWindowPosition = function(marker) {
            self.infoWindow.open(map, marker)
        };
        self.filter = ko.observable('');

        geoLocations.forEach(function(place) {
            self.places().push(new geoLocation(place));
        });

        self.showInfoWindowOnClick = function(element) {
            console.log(element.marker);
            self.getInfoWindowContent(self.infoWindow, element.marker);
            self.infoWindow.open(map, element.marker);
        }
        self.getYelpData = function(place) {
            var yelpUrl = "https://api.yelp.com/v2/search";
            var parameters = {
                term: place.name(),
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

                    place.category = results.businesses[0].categories[0][0];
                    self.categoryArray().push(place.category);
                    self.yelpDataArray.push(results);
                    place.createMarker(results.businesses[0].location.coordinate.latitude, results.businesses[0].location.coordinate.longitude, results.businesses[0].id);
                    self.initializeInfoWindow(self.infoWindow, place);

                    console.log(self.categoryArray().length);
                    if (self.categories().indexOf(place.category) == -1) {

                        self.categories.push(place.category);
                    }

                    counter++;

                },
                error: function(error) {
                    // Do stuff on fail
                    console.log(error);
                    console.log("Not found!");
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
                if (marker.marker_id == self.yelpDataArray()[i].businesses[0].id) {
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
            self.places().forEach(function(place) {
                self.getYelpData(place);
            })
        }


        self.showInfoWindowOnClick = function(element) {
            self.getInfoWindowContent(self.infoWindow, element.marker);
            toggleBounce(element.marker);
            self.infoWindow.open(map, element.marker);

        }

        /* self.isSelected = function(geoLocation) {
     if (geoLocation.selected() == true) {
         console.log("Selected");
         return true;
     }

     return false;
 }
*/

        /*self.filteredCategories = ko.computed(function() {

    return ko.utils.arrayFilter(self.places(), function(place) {
        if (place.isSelected() == true) {
            return true;
        } else {
            return false;
        }
    });

});
*/
        self.selectedCategories.subscribe(function(selectedCategories) {

            selectedCategories.forEach(function(selectedCategory) {
                self.places().forEach(function(place) {


                    if (selectedCategory != place.category && self.selectedCategories().indexOf(place.category) == -1) {
                        removeMarker(place.marker);
                        /* removeMarker(geoLocation.marker);*/
                        return false;

                    } else {

                        if (place.marker.map == null) {
                            console.log(place.name());
                            place.marker.setMap(map);
                        }
                        return true;
                    }



                });
            });

            self.selectedPlaces = ko.observableArray(self.places());



            if (selectedCategories.length == 0) {
                self.places().forEach(function(place) {
                    place.marker.setMap(map);
                })
            }
        }, this);


        self.filterLocationList = ko.computed(function() {
            var search = self.filter().toLowerCase();

            /*self.places([]);
             */
            dataLoaded(false);
            if (self.yelpDataArray().length == 0) {
                self.setMapContent();
            }

            if (self.categoryArray().length == self.places().length) {

                return ko.utils.arrayFilter(self.places(), function(geoLocation) {
                    var isCategorySelected = false;
                    if (self.selectedCategories().length > 0) {
                        console.log(self.selectedCategories().length);
                        for (var i = 0; i < self.selectedCategories().length; i++) {
                            if (geoLocation.category == self.selectedCategories()[i]) {
                                isCategorySelected = true;
                                geoLocation.selected(true);
                                /*return true;
                                 */

                            }
                        }

                        if (search === "" && !isCategorySelected) {
                            return false;
                        }



                    }


                    if (geoLocation.category != null && geoLocation.marker != null) {
                        /*return ko.utils.arrayFilter(self.categories(), function(category) {*/


                        /*if (geoLocation.category == category) {
                         */
                        if (geoLocation.name().toLowerCase().indexOf(search) == 0 && search != "" && isCategorySelected) {
                            geoLocation.marker.setMap(map);
                            return true;
                        }

                        if (search === "" && isCategorySelected) {
                            geoLocation.marker.setMap(map);

                            return true;
                        }


                        if (geoLocation.name().toLowerCase().indexOf(search) == 0 && self.selectedCategories().length == 0) {
                            geoLocation.marker.setMap(map);

                            return true;
                        }






                        /*}*/

                        /* })
                         */
                        removeMarker(geoLocation.marker);


                    }

                    return false;

                })
            }




        }, this);

        self.filteredCategories = ko.computed(function() {
            return ko.utils.arrayFilter(self.categories(), function(category) {

                return true;
            })
        }, this);







    }
    //Click function below prevents submenu from closing on random clicking in the dropdown menu
$('.submenu').on('click', function(event) {
    event.stopPropagation();
});
ko.applyBindings(new ViewModel);
