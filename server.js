// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express    = require('express');		// call express
var app        = express(); 				// define our app using express
var path 	   = require('path');

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

// START THE SERVER
// ====================================
app.listen(3000);
console.log('Magic happens on port 3000');
