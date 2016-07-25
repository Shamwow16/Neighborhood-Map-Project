var neighborhood = {
    name: "Ravenswood, Chicago",
    latitude: 41.968667,
    longitude: -87.674609
}



//Generates an ID for the yelp AJAX request
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
