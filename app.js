//Boilerplate code

var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(cookieSession({
  secret: 'supersecret'
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

//Mongo stuff

var MongoClient = require('mongodb').MongoClient;
var MONGO_URI = 'mongodb://localhost:27017/find-a-time';

var Event = require('./Event');

//Requests

app.get('/info/:id', function (req, res) {
	Event.getEvent(req.params.id, function(err, event) {
		if (!err) {
			res.send(event);
		} else {
			console.log('app.js: something is wrong');
		}
	})
});

app.get('/', function (req, res) {
	res.render('index.html');
});

app.post('/', function (req, res, next) {
	var name = req.body.eventname;
	if (!name) {
		res.redirect('/');
	} else {
		Event.hasEvent(name, function(err, bool) {
			if (bool) {
				res.redirect('event/' + req.body.eventname);
			} else {
				console.log('could not find event ' + req.body.eventname);
				res.redirect('/');
			}
		});
	}
});

var createRouter = require('./routers/create.js');
app.use('/create', createRouter);

var eventRouter = require('./routers/event.js');
app.use('/event', eventRouter);

var logError = function (err, req, res, next) {
  console.error(err.stack);
  next(err);
};

var sendErrorMsg = function (err, req, res, next) {
  res.status(500).send('There was an error!');
};

app.use(logError, sendErrorMsg);


MongoClient.connect(MONGO_URI, function(err, db) {
  if (err) return console.log(err)

  app.listen(3000, function() {
    console.log('listening on 3000')
  });
});