var timeCodes = ['12:00 AM', '12:30 AM'];

for (var i = 1; i < 12; i++) {
	timeCodes[2 * i] = i + ':00 AM';
	timeCodes[2 * i + 1] = i + ':30 AM';
}

timeCodes[24] = '12:00 PM';
timeCodes[25] = '12:30 PM';

for (var i = 1; i < 12; i++) {
	timeCodes[24 + 2 * i] = i + ':00 PM';
	timeCodes[24 + 2 * i + 1] = i + ':30 PM';
}

var makeButton = function(date) {
	var text = '<div id = "date-' + date + '" class = "date-button">' + 
		date.replace('-', ' ') + '</div>';
	var elem = $(text);
	return elem;
}

var makeConfirm = function (name, id) {
	var p1 = '<p class = "top">Your event "' + name + 
		'" has been created at URL <a href = "localhost:3000/event/' + id + '">' + 
		'localhost:3000/event/' + id + '</a>!</p>';
	return $(p1);
}

var dates = [];

$('#adddate-button').on('click', function() {
	var date = $('#date-input').val();
	if (!date.includes('-') && !date.includes(';')) {
		var date = date.replace(' ', '-');
		if (date !== '' && !dates.includes(date)) {
			dates.push(date);
			$('#dates-list').append(makeButton(date));
		}
	}
});

var x = 0;

$('#create-button').on('click', function() {
	var name = $('#eventname').val();
	var start = $('#start').val();
	var end = $('#end').val();
	if (name !== '' && !name.includes('-') && !name.includes(';') && dates.length > 0 && 
			timeCodes.indexOf(start) <= timeCodes.indexOf(end)) {
		$.ajax({
		  url: '/create',
		  type: 'POST',
	      data: {eventname: name, dates: dates.join(';'), start: start, end: end},
	      dataType: 'JSON',
	      success: function (data) {
	      	$('#everything').empty();
	      	$('#everything').append(makeConfirm(name, data.id.id));
	      }
	    });
	}
});