var express = require('express');
var router = express.Router();

var Event = require('../Event');

var times = require('../times.js');

router.get('/', function (req, res) {
	res.render('create.html', {times: times});
});

router.post('/', function (req, res, next) {
	if (req.body.eventname) {
		var eventname = req.body.eventname;
		var dates = req.body.dates.split(';');
		var startTime = times.indexOf(req.body.start);
		var endTime = times.indexOf(req.body.end);
		Event.addEvent(eventname, dates, startTime, endTime, function(err, id) {
			if (err !== null) { 
				console.log('create.js: Could not add event'); 
			} else {
				console.log('create.js: Created event with id:');
				res.send({id: id});
			}
		});
	} else {
		res.render('create.html');
	}
}.bind(this));

module.exports = router;