var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/find-a-time');
var Schema = mongoose.Schema;

//mongo find-a-time --eval "db.dropDatabase()"

var eventSchema = new Schema({
  id: {type: String, required: true, unique: true},
  name: { type: String, required: true},
  dates: { type : Array, required: true},
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  users: { type: Object, required: true },
});

var timeCodes = require('./times.js');

eventSchema.statics.addEvent = function(name, dates, startTime, endTime, cb) {
  var that = this;
  console.log('0c');

  var findId = function(i, cbb) {
	that.findOne({id: i.toString()}, function (err, event) {
		if (err || event === null) cbb(null, i);
		else findId(i + 1, cbb); 
	});
  };

  var times = timeCodes.slice(startTime, endTime + 1);
  var users = {};

  for (var i = 0; i < dates.length; i++) {
  	for (var j = 0; j < times.length; j++) {
  		users[dates[i].replace(' ', '-') + '-' + times[j].replace(' ', '-')] = [];
  	}
  }

  findId(0, function(err, id) {
    if (err) {
    	cb(err, null);
    } else {
    	var newEvent = new that({ 
      		id: id,
  	  		name: name, 
  	  		dates: dates, 
  	  		start: startTime, 
     		  end: endTime,
  	  		users: users
    	});
      console.log('0d');
    	newEvent.save(cb);
    }
  });
}

eventSchema.statics.hasEvent = function(id, cb) {
	this.findOne({id: id}, function (err, event) {
		if (err) cb('Error!');
		else cb(null, !!event);
	});
}

eventSchema.statics.getEvent = function(id, cb) {
	this.findOne({id: id}, function (err, event) {
		if (!event) cb('No Such Event');
		else {
			cb(null, event);
		}
	});
}

eventSchema.statics.editUser = function(id, username, times, cb) {
	var that = this;
	that.findOne({id: id}, function (err, event) {
		var temp = event.users;
    for (var i = 0; i < Object.keys(temp).length; i++) {
      console.log(Object.keys(temp)[i]);
      var index = temp[Object.keys(temp)[i]].indexOf(username);
      if (index !== -1) {
        temp[Object.keys(temp)[i]].splice(index, 1);
      }
    }
    for (var i = 0; i < times.length; i++) {
      temp[times[i]].push(username);
    }
		that.findOneAndUpdate({id: id}, {users: temp}, {upsert: true}, function(err) {
			if (err) {
				cb(err, null);
			} else {
				cb(null, id);
			}
		});
	});
}

module.exports = mongoose.model('Event', eventSchema);