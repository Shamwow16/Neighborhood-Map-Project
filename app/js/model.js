var geoLocations = [];

//Create geoLocation pseudoclass for each of the locations listed in the database
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
var ViewModel = function() {
        var self = this;
        self.neighborhoodInput = ko.observable('');
        self.places = ko.observableArray([]);
        self.myFirebaseRef = ko.observable('');
        self.selectedLocation = ko.observable('');
        self.selectedLocationName = ko.observable('');
        self.selectedLocationCategory = ko.observable('');
        self.selectedLocationImageUrl = ko.observable('');
        self.selectedLocationRatingUrl = ko.observable('');
        self.selectedLocationSnippetText = ko.observable('');
        self.selectedLocationYelpUrl = ko.observable('');
        self.selectedLocationAddress = ko.observable('');
        self.yelpDataArray = ko.observableArray([]);
        self.yelpError = ko.observable('');
        self.categories = ko.observableArray([]);
        self.categoryArray = ko.observableArray([]);
        self.selectedCategories = ko.observableArray([]);
        self.eventfulError = ko.observable('');
        self.eventTitle = ko.observable('');
        self.eventUrl = ko.observable('');
        self.eventImageUrl = ko.observable('');
        self.eventsList = ko.observableArray([]);
        self.shouldShowMessage = ko.observable(false);
        self.shouldShowEventfulError = ko.observable(false);
        self.markerArray = ko.observableArray([]);
        self.infoWindow = new google.maps.InfoWindow();
        self.filter = ko.observable('');

        //Creates a reference to the firebase database which contains a JSON object of the locations I like in my neighborhood
        self.myFirebaseRef = new Firebase("https://glaring-heat-1861.firebaseio.com/");
        //The listener below reads data from Firebase and stores it in the geoLocations array from which it is passed into the self.places
        //array as an array of geoLocation objects. The self.places() array is the primary array used to filtering and displaying markers.
        self.myFirebaseRef.on("value", function(snapshot) {

                geoLocations = snapshot.val();

                geoLocations.forEach(function(place) {
                    if (place == null) {
                        var index = geoLocations.indexOf(place);
                        geoLocations.splice(index, 1);
                    } else {
                        self.places.push(new geoLocation(place));
                    }
                })
                self.setMapContent();

            }, //The following function will alert user that the data could not be loaded from Firebase.
            function(errorObject) {
                alert(errorObject.code + "My locations of interest could not be loaded. :( Please refresh the page and try again. If issue persists, please email me at: shamyleg@gmail.com")
            })

        //Function that handles the AJAX request for Eventful API to show list of nearby events. Shows the first 10 events
        //happening this week.
        self.getEventfulData = function() {
                var eventfulUrl = "http://api.eventful.com/json/events/search";
                var parameters = {
                    location: "Chicago",
                    date: "This Week",
                    within: 10,
                    units: "mi",
                    app_key: "qFc3kDQ6G9kXThcX",
                    callback: 'cb'
                }
                var settings = {
                    url: eventfulUrl,
                    data: parameters,
                    dataType: 'jsonp',
                    success: function(results) {
                        var eventArray = results.events.event;
                        self.eventsList(eventArray);
                    },
                    error: function(error) {
                        //Error handling for Eventful. Displays error message in dropdown if data does not load.
                        self.eventfulError("Sorry, Eventful was unable to load events near " + neighborhood.name + ". Please refresh the page to try again.");
                        self.shouldShowEventfulError(true);
                    }
                }
                $.ajax(settings);
            }
            //Call for the Eventful AJAX request is made here.
        self.getEventfulData();

        //Below is the Yelp API request function definition. Uses each location's name to get information about it that is then displayed
        //in the infoWindows.
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
                    //If the Yelp response for a particular place is empty, runs error function
                    if (results.businesses.length == 0) {
                        this.error();
                    }
                    // If the Yelp responses are all successfully received, a marker is created for each place and category array is updated
                    // Finally, the infoWindow is initialized.
                    if (results.businesses.length != 0) {
                        place.createMarker(results.businesses[0].location.coordinate.latitude, results.businesses[0].location.coordinate.longitude, results.businesses[0].id);
                        place.category = results.businesses[0].categories[0][0];
                        self.categoryArray().push(place.category);
                        self.yelpDataArray.push(results);
                        self.initializeInfoWindow(self.infoWindow, place);
                        self.markerArray().push(place.marker);

                        // The if statement below prevents a category from being duplicated in case there are multiple locations with
                        // the same category.

                        if (self.categories().indexOf(place.category) == -1) {
                            self.categories.push(place.category);
                        }
                    }
                },
                error: function(error) {
                    //Finds index of place for which no yelp info was obtained and updates yelpError message.
                    var deleteIndex = self.places().indexOf(place);
                    self.places().splice(deleteIndex, 1);
                    self.yelpError("Sorry, Yelp has got nothin' on " + place.name());
                    self.shouldShowMessage(true);
                }
            };
            $.ajax(settings);
        }

        // This function sets the content for the infoWindow and each type of info is bound via Knockout to the DOM.
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

        //This function checks to make sure that all markers are set before creating the "List" on the website. Prevents null markers
        //from being processed.
        self.allMarkersSet = function() {
            if (self.places().length == self.yelpDataArray().length) {
                self.places().forEach(function(place) {
                    if (place.marker == null) {
                        return false;
                    }
                    return true;
                })
                return true;
            }

            return false;
        }


        //This function initializes the infowindow for each of the locations. If a certain marker is clicked on, it will
        //set the infowindow content for that marker.
        self.initializeInfoWindow = function(infowindow, place) {

            place.marker.addListener('click', function(infowindowCopy, marker) {

                return function() {
                    self.getInfoWindowContent(infowindowCopy, marker);
                    toggleBounce(marker, self.markerArray());
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

        //setMapContent makes the yelp Request for each location of interest once self.places is fully populated.
        self.setMapContent = function() {
            if (self.places().length == geoLocations.length && self.places().length > 0) {
                self.places().forEach(function(place) {
                    self.getYelpData(place);
                })
            } else {
                console.log("Expected self.places() to have length of" + geoLocations.length + "but it had length of " + self.places().length);
            }
        }

        //This function shows infoWindow when a particular location is clicked and also toggles the bounce animation for a particular marker
        self.showInfoWindowOnClick = function(element) {
            self.getInfoWindowContent(self.infoWindow, element.marker);
            toggleBounce(element.marker, self.markerArray());
            self.infoWindow.open(map, element.marker);

        }

        //This function hides the error message that displays in case the ajax request is not successful for a reason.
        self.hideErrorMessage = function() {
            self.shouldShowMessage(false);
        }

        self.hideEventfulErrorMessage = function() {
            self.shouldShowEventfulError(false);
        }

        //self.selectedCategories has a subscription that listens for any changes to the array and sets/removes markers based
        // on selection
        self.selectedCategories.subscribe(function(selectedCategories) {

            selectedCategories.forEach(function(selectedCategory) {
                self.places().forEach(function(place) {

                    //removes marker if it is not one of the selected categories.
                    if (selectedCategory != place.category && self.selectedCategories().indexOf(place.category) == -1) {
                        removeMarker(place.marker);
                        return false;

                    } else {
                        //checks to see if marker already exists on page. If not, it will set the marker.
                        if (place.marker.map == null) {
                            place.marker.setMap(map);
                        }
                        return true;
                    }



                });
            });
            //if no specific category is selected, display all markers
            if (selectedCategories.length == 0) {
                self.places().forEach(function(place) {
                    place.marker.setMap(map);
                })
            }
        }, this);


        /*filterLocationList is a computed knockout list that is displayed under the Search Bar. It shows location items that
        have been a) searched for in the search box, b) filtered by category or c)both searched and filtered by category.
    */
        self.filterLocationList = ko.computed(function() {
            var search = self.filter().toLowerCase();
            if (self.places().length > 0 && self.allMarkersSet() == true) {
                return ko.utils.arrayFilter(self.places(), function(geoLocation) {
                    var isCategorySelected = false;
                    if (self.selectedCategories().length > 0) {
                        for (var i = 0; i < self.selectedCategories().length; i++) {
                            if (geoLocation.category == self.selectedCategories()[i]) {
                                isCategorySelected = true;
                                geoLocation.selected(true);
                            }
                        }
                        if (search === "" && !isCategorySelected) {
                            return false;
                        }
                    }


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
                    removeMarker(geoLocation.marker);
                    return false;
                })
            }

        }, this);


    }
    //Click function below prevents submenu from closing on random clicking in the dropdown menu
$('.submenu').on('click', function(event) {
    event.stopPropagation();
});


ko.applyBindings(new ViewModel);
