var express = require('express');
var router = express.Router();

var Event = require('../Event');

router.get('/', function (req, res) {
	res.render('create.html');
});

router.post('/', function (req, res) {
	eventname = req.body.eventname;
	Event.addEvent(eventname, ['noon', '3pm']);
	res.render('confirm.html', {name: eventname});
});

module.exports = router;