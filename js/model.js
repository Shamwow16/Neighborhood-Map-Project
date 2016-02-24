
var geoLocation = function(){
	this.personName = ko.observable('Bob');
	this.personAge = ko.observable(123);
	this.streetAddress = ko.observable('');
	this.city = ko.observable('');
	this.submitSuccess = ko.observable('Submission');
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
