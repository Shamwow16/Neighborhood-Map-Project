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
		      cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
		      jsonpCallback: 'cb',
		      dataType: 'jsonp',
		      success: function(results) {

		        // Do stuff with results
		        storeYelpData(results);
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


getYelpData(geoLocations[0].name);
var categories = [];
var index = 0;
function storeYelpData(results){
	categories = results.businesses[0].categories;
	addCategoryToGeoLocation(geoLocations[index], categories);
	index++
	if(index >= geoLocations.length){
		initializeInfoWindows(markerArray);
	}
}

function addCategoryToGeoLocation(geoLocation, categories){
	geoLocation['categories'] = categories;
	console.log(geoLocation.categories[0][0]);
}

var geoLocation = function(data){
	var self=this;
	self.name = ko.observable(data.name);
	self.longitude = ko.observable(data.longitude);
	self.latitude = ko.observable(data.latitude);
	self.streetAddress = ko.observable(data.streetAddress);
	self.city = "Chicago, IL";
};


var ViewModel = function(){

	var self = this;

	self.placeList = ko.observableArray([]);
	self.filter=ko.observable('');
	self.categories = ko

	geoLocations.forEach(function(place){
		self.placeList.push(new geoLocation(place));
	});

	self.search = function(value) {
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

self.filter.subscribe(self.search);

};



ko.applyBindings(new ViewModel);
