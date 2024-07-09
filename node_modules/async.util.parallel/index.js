'use strict';

var noop = require('async.util.noop');
var restParam = require('async.util.restparam');
var isArrayLike = require('async.util.isarraylike');

module.exports = function parallel(eachfn, tasks, cb) {
    cb = cb || noop;
    var results = isArrayLike(tasks) ? [] : {};

    eachfn(tasks, function(task, key, cb) {
        task(restParam(function(err, args) {
            if (args.length <= 1) {
                args = args[0];
            }
            results[key] = args;
            cb(err);
        }));
    }, function(err) {
        cb(err, results);
    });
};
