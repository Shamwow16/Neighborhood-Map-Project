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

var geoLocation = function(){
	/*this.personName = ko.observable('Bob');
	this.personAge = ko.observable(123);*/
	var self=this;
	self.name = ko.observable('');
	self.longitude = ko.observable('');
	self.latitude = ko.observable('');
	self.streetAddress = ko.observable('');
	self.city = "Chicago, IL";
};

var ViewModel = function(){

	var self = this;
	self.geoLocation = new geoLocation();

	self.showMap = function(){
		console.log(self.geoLocation.streetAddress());
		console.log('Success');
	}
};


ko.applyBindings(new ViewModel);
