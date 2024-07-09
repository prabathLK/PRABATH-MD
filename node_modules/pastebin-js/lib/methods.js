'use strict';
/*
 * pastebin-js
 * https://github.com/j3lte/pastebin-js
 *
 * Copyright (c) 2013-2019 Jelte Lagendijk
 * Licensed under the MIT license.
 */
var request = require('request');
var config = require('./config');
var pkg = require('../package.json');
var Q = require('q');
var TIMEOUT = 4000;
var HEADERS = [
    {
        name: 'User-Agent',
        value: 'Pastebin-js/' + pkg.version,
    },
    {
        name: 'Cache-Control',
        value: 'no-cache'
    }
];

var methods = module.exports = {
    get : function (path, params) {
        var deferred = Q.defer();

        if (!path) {
            deferred.reject(new Error('No path provided'));
            return deferred.promise;
        }
        if (!params) {
            params = {};
        }

        request({
            uri : path,
            qs : params,
            method : 'GET',
            headers : HEADERS,
            timeout : TIMEOUT,
            followRedirect : true
        }, function (error, response, body) {
            var status = response ? response.statusCode : null;
            if (error || status === null) {
                deferred.reject({status : status, error : error});
            }
            if (status === 404) {
                deferred.reject(new Error('Error 404, paste not found!'));
            }
            if (status !== 200) {
                deferred.reject(new Error('Unknown error, status: ' + status));
            }
            if (!body || body === null || body.length === 0) {
                deferred.reject(new Error('Empty response'));
                return;
            }
            if (body.indexOf('Bad API request') !== -1) {
                deferred.reject(new Error(body));
            }
            deferred.resolve(body);
        });

        return deferred.promise;
    },
    post : function (path, params) {
        var deferred = Q.defer();

        if (!path) {
            deferred.reject(new Error('No path provided'));
            return deferred.promise;
        }
        if (!params) {
            params = {};
        }

        request({
            uri : path,
            method : 'POST',
            form : params,
            headers : HEADERS,
            timeout : TIMEOUT,
            followRedirect : true
        }, function (error, response, body) {
            var status = response ? response.statusCode : null;
            if (error || status === null) {
                deferred.reject({status : status, error : error});
            }
            if (status !== 200) {
                deferred.reject(new Error('Unknown error, status: ' + status));
            }
            if (!body || body === null || body.length === 0) {
                deferred.reject(new Error('Empty response'));
            }
            if (body.indexOf('Bad API request') !== -1) {
                deferred.reject(new Error('Error: ' + body));
            }
            if (body.indexOf('Post limit') !== -1) {
                deferred.reject(new Error('Error: ' + body));
            }
            if (body.indexOf('http') === 0) {
                // return an ID instead of the url
                body = body.replace('http://pastebin.com/','');
            }
            deferred.resolve(body);
        });

        return deferred.promise;
    }
};
