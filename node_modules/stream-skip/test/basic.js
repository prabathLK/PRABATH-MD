var tape = require('tape')
var streamSkip = require('../index')

function expect(stream, what, t) {
	var i = 0
	stream.on('data', function(s) {
		t.equals(what[i], s.toString(), 'packet '+i+' is ok')
		i++
	})
	stream.on('end', function() {
		t.ok(i === what.length, 'length is ok')
		t.end()
	})
}

tape('skip nothing', function(t) {
	var s = new streamSkip({ skip: 0 });
	expect(s, ['hello world\n', 'another line'], t)
	s.write('hello world\n')
	s.write('another line')
	s.end()
})

tape('skip in the middle of a packet', function(t) {
	var s = new streamSkip({ skip: 3 });
	expect(s, ['lo world\n', 'another line'], t)
	s.write('hello world\n')
	s.write('another line')
	s.end()
})

tape('skip a full packet', function(t) {
	var s = new streamSkip({ skip: 12 });
	expect(s, ['another line'], t)
	s.write('hello world\n')
	s.write('another line')
	s.end()
})

tape('skip a full packet and something', function(t) {
	var s = new streamSkip({ skip: 14 });
	expect(s, ['other line'], t)
	s.write('hello world\n')
	s.write('another line')
	s.end()	
})

tape('skip more than the data', function(t) {
	var s = new streamSkip({ skip: 30 });
	expect(s, [], t)
	s.write('hello world\n')
	s.write('another line')
	s.end()	
})