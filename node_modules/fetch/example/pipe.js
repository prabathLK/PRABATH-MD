'use strict';

// pipe to file

var FetchStream = require('../lib/fetch').FetchStream,
    fs = require('fs'),
    inp, out;

inp = new FetchStream('http://google.com');
out = fs.createWriteStream('google.html');

inp.on('end', function(){
    console.log('downloaded!');
});

inp.pipe(out);
