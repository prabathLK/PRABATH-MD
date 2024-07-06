'use strict';

var FetchStream = require('../lib/fetch').FetchStream;

var fetch = new FetchStream('http://google.com', {
    headers: {}
});

fetch.on('data', function (chunk) {
    console.log(chunk);
});

fetch.on('meta', function (meta) {
    console.log(meta);
});

fetch.on('end', function () {
    console.log('END');
});

fetch.on('error', function (e) {
    console.log('ERROR: ' + (e && e.message || e));
});
