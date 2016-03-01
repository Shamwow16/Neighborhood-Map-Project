var neighborhood = {
	name : "Ravenswood, Chicago",
	latitude : 41.968667,
	longitude : -87.674609
}

var geoLocations = [
{
	name:'Big Jones',
	latitude: 41.979444,
	longitude:-87.668036,
	streetAddress: "5347 N Clark St"},
	{
		name:'Old Town School of Folk Music',
		latitude: 41.964223 ,
		longitude: -87.686013 ,
		streetAddress: "4544 North Lincoln Avenue"
	},
	{
		name:'Riviera Theatre',
		latitude: 41.968852 ,
		longitude: -87.659878,
		streetAddress: "4746 N Racine Ave"

	},
	{
		name:"Mariano's",
		latitude: 41.969294,
		longitude: -87.675058,
		streetAddress: "1800 W Lawrence Ave"
	},
	{
		name:"Montrose Beach",
		latitude: 41.965804,
		longitude: -87.636410,
		streetAddress: "4400 North Lake Shore Drive"
	},
	{
		name:"The Bongo Room",
		latitude: 41.973190,
		longitude: -87.668225,
		streetAddress: "5022 N Clark St"
	}

	]

	function makeid()
	{
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < 5; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}


	var counter = 0;
	var yelpLocations = [];

	var yelpData = [];



	function setInfoWindowContent(){};



	var geoLocation = function(data){
		var self=this;
		self.name = ko.observable(data.name);
		self.longitude = ko.observable(data.longitude);
		self.latitude = ko.observable(data.latitude);
		self.streetAddress = ko.observable(data.streetAddress);
		self.city = "Chicago, IL";
		self.createMarker = function(){
		self.marker = new google.maps.Marker({
    			position: {lat:self.latitude(), lng:self.longitude()},
    			map: map,
    			animation: google.maps.Animation.DROP,
    			title: self.name()
    		})
		};

		/*self.setMarkerInfoWindow = function(){
			self.
		}*/
	};

var updatedList = [];
	var ViewModel = function(){

		var self = this;
		if(map==null){
		initMap();
		}
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
		self.setInfoWindowPosition = function(marker){
			self.infoWindow.open(map,marker)
			/*self.infoWindow.setPosition({lat:marker.latitude, lng:marker.longitude});*/
		};
		console.log(self.infoWindow);
		self.filter=ko.observable('');
		self.locationsList = ko.observableArray([]);
		/*self.generateMarkers = function(){

		}*/
		geoLocations.forEach(function(place){
			self.locationsList().push(new geoLocation(place));
		})

		self.getYelpData = function(terms){
		var yelpUrl = "https://api.yelp.com/v2/search";
		var parameters = {
			term : terms,
			location: neighborhood.name,
			limit: 1,
			oauth_consumer_key: '6Chkx9mYhCssQqXHPxvNQQ',
			oauth_token: 'XQRWzlGQFGOlualvBLVTpJYi6EtszzBV',
			oauth_nonce: makeid(),
			oauth_timestamp: Math.floor(Date.now()/1000),
			oauth_signature_method: 'HMAC-SHA1',
			callback: 'cb'
		}
		var consumerSecret = '-J7YlB_RuZ7mfk3lxM8n0c3nT1s';
		var tokenSecret = 'D7t2lRihVRUyZrGh2gMRZqFLlQ8';
		var signature = oauthSignature.generate('GET', yelpUrl, parameters, consumerSecret, tokenSecret, { encodeSignature: false});
		parameters['oauth_signature'] = signature;


		var settings = {
			url: yelpUrl,
			data: parameters,
		      cache: true,
		      dataType: 'jsonp',
		      success: function(results) {
		        self.yelpDataArray.push(results);
		        counter++;
		    },
		    error: function(error) {
		        // Do stuff on fail
		        console.log(error);
		    }
		};

		$.ajax(settings);

		}

		self.getInfoWindowContent = function(infowindow,marker){


		for(var i=0;i<self.yelpDataArray().length;i++){
			if(self.yelpDataArray()[i].businesses[0].name == marker.title){
				self.selectedLocation(self.yelpDataArray()[i].businesses[0]);
				self.selectedLocationName(self.selectedLocation().name);
				self.selectedLocationCategory(self.selectedLocation().categories[0][0]);
				self.selectedLocationImageUrl(self.selectedLocation().image_url);
				self.selectedLocationRatingUrl(self.selectedLocation().rating_img_url);
				self.selectedLocationSnippetText(self.selectedLocation().snippet_text);
				self.selectedLocationYelpUrl(self.selectedLocation().url);
				self.selectedLocationAddress(self.selectedLocation().location.display_address[0] + ', '
					+ self.selectedLocation().location.display_address[1] + ', ' +
					self.selectedLocation().location.display_address[2]);
				var infoWindowContent = $('#infowindow-content').html();
				infowindow.setContent(infoWindowContent);
			}
		};
	}

	  self.initializeInfoWindow = function(infowindow, place){

        place.marker.addListener('click', function(infowindowCopy, marker){

  				return function(){
  				self.getInfoWindowContent(infowindowCopy,marker);
  				toggleBounce(marker);
  				infowindowCopy.setPosition(marker.position);
  				infowindowCopy.open(map,marker);

  			}
  			}(self.infoWindow,place.marker));

        infowindow.addListener('closeclick',function(){
        	if (place.marker.getAnimation() !== null) {
   			 place.marker.setAnimation(null);
   			}
        });


  		}

		self.locationsList().forEach(function(place){
			place.createMarker();
			self.getYelpData(place.name());
			self.initializeInfoWindow(self.infoWindow,place);
		})

		self.showInfoWindowOnClick = function(element){
			console.log(element.marker);
			self.getInfoWindowContent(self.infoWindow,element.marker);
			toggleBounce(element.marker);
			self.infoWindow.open(map,element.marker);

		}


		self.filterLocationList = ko.computed(function(){
			var search = self.filter().toLowerCase();
			return ko.utils.arrayFilter(self.locationsList(), function(geoLocation){

				if (geoLocation.name().toLowerCase().indexOf(search) == 0){

				geoLocation.marker.setMap(map);
				/*self.setInfoWindowPosition(geoLocation.marker);*/
				return true;
				}

				else{
					removeMarker(geoLocation.marker)
					return false;
				}

			});
			self.locationsList(self.filterLocationList);

		}, this)





};





ko.applyBindings(new ViewModel);