#!/usr/bin/env node

var assert = require('assert');

var human = require('../');

[
    [600, '10 minutes ago'],
    [60, '1 minute ago'],
    [new Date(), '0 seconds ago']
].forEach(function (o) {
    var t = o[0];
    var s = o[1];

    var rel = human(t);

    console.log('human(%j) [%j] == %j', t, rel, s);
    assert.equal(rel, s);
});
