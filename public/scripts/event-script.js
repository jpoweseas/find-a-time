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

var id, name, start, end, dates, users, times;

var updateInfo = function() {
  $.ajax({
      type: 'GET',
      url: '/info/' + window.location.pathname.slice(7),
      success: function (data) {
        console.log('info updated');
        id = data.id;
        name = data.name;
        start = data.start;
        end = data.end;
        dates = data.dates;
        users = data.users;
        times = timeCodes.slice(start, end + 1);
        colorTimes();
      }
  });
}

var preColor = function() {
  $('.time-box').removeClass('green0');
  $('.time-box').removeClass('green1');
  $('.time-box').removeClass('green2');
  $('.time-box').removeClass('green3');
  $('.time-box').removeClass('green4');
  $('.time-box').removeClass('selected');
  $('.time-box').each(function() {
    if (users[$(this).attr('id')].includes(currUser)) {
      $(this).addClass('selected');
    }
  });
}

var colorTimes = function() {
  var max = 0;
  for (var i = 0; i < Object.keys(users).length; i++) {
    var num = users[Object.keys(users)[i]].length;
    if (num > max) {
      max = num;
    }
  }
  $('.time-box').each(function() {
    var numUsers = users[$(this).attr('id')].length;
    var colorNum = parseInt((4 * numUsers) / max);
    $(this).addClass('green' + colorNum);
  });
  console.log('viewall colored tiles');
}

$(document).ready(function() {
  function makeTimeBox(i) {
    return '<ul class = "time-box">' + timeCodes[i] + '</ul>';
  }
  updateInfo();
});

var mouse = false;
var hasToggled = false;
var editMode = false;
var currUser = null;
var users = null;

$(document).on('mousedown', function(){
  mouse = true;
});

$(document).on('mouseup', function(){
  mouse = false;
  var user = $('#user').val();
  if (hasToggled && user !== "") {
    console.log('POSTing data for ' + user + '.');
    var times = [];
    $('.selected').each(function() {
      times.push($(this).attr('id'));
    });
    $.ajax({
      data: {user: user, times: times.join(';')},
      type: 'POST',
      success: function() {
        console.log('Data POSTed for ' + user + '.');
      }
    });
    hasToggled = false;
  }
});

$('.time-box').on('mousedown', function(e) {
  if (editMode) {
    $(this).toggleClass('selected');
    hasToggled = true;
  }
});

$('.time-box').on('mouseover', function(e) {
  $(this).css('color', 'lightblue');
  if (mouse && editMode) {
    $(this).toggleClass('selected');
    hasToggled = true;
  }
  if (!editMode) {
    var text = users[$(this).attr('id')].toString();
    $('#top-available').text('Available: ' + (text !== '' ? text : 'None'));
  }
});

$('.time-box').on('mouseout', function(e) {
  $(this).css('color', 'black');
  if (!editMode) {
    $('#top-available').text('...');
  }
});

$('#viewall-button').on('click', function(e) {
  $('#top-text').text('viewing all users.');
  currUser = null;
  editMode = false;
  $('.time-box').removeClass('selected');
  console.log('Viewing all');
  updateInfo();
});

$('#edituser-button').on('click', function(e) {
  currUser = $('#user').val();
  if (currUser !== '') {
    $('#top-text').text('editing user "' + currUser + '".');
    editMode = true;
    preColor();
  }
});