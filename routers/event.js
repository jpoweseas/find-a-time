var express = require('express');
var router = express.Router();

var Event = require('../Event');

router.get('/:name', function(req, res, next) {
	if (req.params.name === 'ejs_production.js') {
		console.log('why does this happen lol');
		next();
	}
	else {
		Event.getEvent(req.params.name, function(err, event) {
			if (err) {
				console.log('event.js: no event named ' + req.params.name);
			} else {
				res.render('event.html', {event: event});
				console.log('event.js: event ' + event.name + ' found!');
			}
		});
	}
});

router.post('/:name', function(req, res, next) {
	Event.getEvent(req.params.name, function(err, event) {
		if (!event) {
			console.log('event.js: unable to find event on POST');
		} else {
			var times = [];
			for (var i = 0; i < event.times.length; i++) {
				if (req.body[event.times[i]] === 'on') {
					times.push(event.times[i]);
				}
			}
			Event.addUser(req.params.name, req.body.username, times, function(err) {
				if (err) {
					console.log('event.js: unable to addUser on POST');
				} else {
					res.redirect('/');
				}
			});
		}
	});
});

module.exports = router;