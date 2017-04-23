var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/find-a-time');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  name: { type: String, required: true, unique: true },
  times: { type: Array, required: true },
  users: { type: Object, required: true }
});


eventSchema.statics.addEvent = function(name, times, cb) {
  var newEvent = new this({ name: name, times: times, users: {me: [true, true], you: [false, true]}});
  newEvent.save(cb);
}

eventSchema.statics.hasEvent = function(name, cb) {
	this.findOne({name: name}, function (err, event) {
		if (err) cb('Error!');
		else cb(null, !!event);
	});
}

eventSchema.statics.getEvent = function(name, cb) {
	this.findOne({name: name}, function (err, event) {
		if (!event) cb('No Such Event');
		else {
			cb(null, event);
		}
	});
}

eventSchema.statics.addUser = function(eventname, username, times, cb) {
	var that = this;
	that.findOne({name: eventname}, function (err, event) {
		var temp = event.users;
		temp[username] = times;
		that.findOneAndUpdate({name: eventname}, {users: temp}, {upsert: true}, function(err) {
			if (err) {
				cb(err);
			} else {
				cb(null);
			}
		});
	});
}

module.exports = mongoose.model('Event', eventSchema);