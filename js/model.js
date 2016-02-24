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

var geoLocation = function(data){
	/*this.personName = ko.observable('Bob');
	this.personAge = ko.observable(123);*/
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
	geoLocations.forEach(function(place){
		self.placeList.push(new geoLocation(place));
	})
	console.log(self.placeList());
	self.showMap = function(){
		console.log(self.geoLocation.streetAddress());
		console.log('Success');
	}
};


ko.applyBindings(new ViewModel);
