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

module.exports = timeCodes;