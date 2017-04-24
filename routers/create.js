var express = require('express');
var router = express.Router();

var Event = require('../Event');

var times = [];

router.get('/', function (req, res) {
	times = [];
	res.render('create.html', {times: []});
});

router.post('/', function (req, res, next) {
	if (req.body.time) {
		times.push(req.body.time);
		res.render('create.html', {times: times});
	} else {
		next();
	}
}.bind(this))

router.post('/', function (req, res) {
	if (req.body.eventname) {
		var eventname = req.body.eventname;
		Event.addEvent(eventname, times, function(err) {
			if (err !== null) { 
				console.log('create.js: Could not add event'); 
			} else {
				res.render('confirm.html', {name: eventname}); 
			}
		});
	} else {
		res.render('create.html');
	}
}.bind(this));

module.exports = router;