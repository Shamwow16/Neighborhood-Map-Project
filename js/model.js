var myViewModel = {
	personName: ko.observable('Bob'),
	personAge: ko.observable(123),
	streetAddress: ko.observable(''),
	city: ko.observable('')
};



ko.applyBindings(myViewModel);

