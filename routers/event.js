var express = require('express');
var router = express.Router();

var Event = require('../Event');

var timeCodes = require('../times');

router.get('/:id', function(req, res, next) {
	if (req.params.id === 'ejs_production.js') {
		console.log('why does this happen lol');
		next();
	} else {
		Event.getEvent(req.params.id, function(err, event) {
			if (err) {
				res.render('oops.html');
			} else {
				var times = timeCodes.slice(event.start, event.end + 1);
				res.render('event.html', {
					name: event.name, 
					dates: event.dates,
					times: times,
					users: event.users
				});
			}
		});
	}
});

router.post('/:id', function(req, res) {
	var times = req.body.times !== '' ? req.body.times.split(';') : [];
	Event.editUser(req.params.id, req.body.user, times, function(err) {
		if (err) {
			console.log('event.js: Error editing user ' + req.body.user);
		} else {
			console.log('event.js: Done editing ' + req.body.user);
		}
		res.send('please work');
	});
})

/*
router.post('/:id', function(req, res, next) {
	Event.getEvent(req.params.id, function(err, event) {
		if (!event) {
			console.log('event.js: unable to find event on POST');
		} else {
			var times = [];
			for (var i = 0; i < event.times.length; i++) {
				times[i] = (req.body[event.times[i]] === 'on');
			}
			Event.addUser(req.params.id, req.body.username, times, function(err) {
				if (err) {
					console.log('event.js: unable to addUser on POST');
				} else {
					res.redirect('/');
				}
			});
		}
	});
});
*/

module.exports = router;