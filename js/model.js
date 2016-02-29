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
	function getYelpData(term) {
		var yelpUrl = "https://api.yelp.com/v2/search";
		var parameters = {
			term : term,
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
		        yelpData.push(results);
		        counter++;
		        if(counter<geoLocations.length){
		        	getYelpData(geoLocations[counter].name);

		        }
		    },
		    error: function(error) {
		        // Do stuff on fail
		        console.log(error);
		    }
		};

		$.ajax(settings);


	}

	var yelpData = [];
	getYelpData(geoLocations[0].name);

	function getInfoWindowContent(marker){
		for(var i=0;i<yelpData.length;i++){
			if(yelpData[i].businesses[0].name == marker.title){
				console.log(yelpData[i].businesses[0].id);
				infowindow.setContent(yelpData[i].businesses[0].id);
			}
		};
	}

	function setInfoWindowContent(){};



	var geoLocation = function(data){
		var self=this;
		self.name = ko.observable(data.name);
		self.longitude = ko.observable(data.longitude);
		self.latitude = ko.observable(data.latitude);
		self.streetAddress = ko.observable(data.streetAddress);
		self.city = "Chicago, IL";
	};

var updatedList = [];
	var ViewModel = function(){

		var self = this;

		//FIX THE FILTERING WHEN YOU COME BACK THIS WEEKENDDDDD!!!!!

		self.filter=ko.observable('');
		self.locationsList = ko.observableArray(geoLocations);
		self.filterLocationList = ko.computed(function(){
			var search = self.filter().toLowerCase();
			return ko.utils.arrayFilter(self.locationsList(), function(geoLocation){
				return geoLocation.name.toLowerCase().indexOf(search) == 0;
			});

		}, this)

		if(map==null){
		initMap(self.locationsList());
		}
		/*self.filterList = ko.computed(function(){
			if(self.filter() == ''){
				for(var i =0;i<geoLocations.length;i++){
					self.locationsList().push(new geoLocation(geoLocations[i]));
				}
			}

			if (self.filter() != ''){
			self.locationsList([]);
			for(var i =0; i<geoLocations.length;i++){
				if(geoLocations[i].name.toLowerCase().indexOf(self.filter().toLowerCase()) == 0){
					self.locationsList().push(geoLocations[i]);
				}
			}
			removeMarkers();

			}
			return self.locationsList;
*/

	/*if(self.placeList([])){
	geoLocations.forEach(function(place){
		self.placeList.push(new geoLocation(place));
	});
}*/



/*	self.search = function(value) {
		self.placeList.removeAll();
		for(var i =0; i<geoLocations.length;i++){
			if(geoLocations[i].name.toLowerCase().indexOf(value.toLowerCase()) == 0){
				self.placeList.push(geoLocations[i]);
			}
		}
		var updatedList = self.placeList();
		removeMarkers();
		initializeMarkers(updatedList);
	}

	self.filter.subscribe(self.search);*/
};





ko.applyBindings(new ViewModel);