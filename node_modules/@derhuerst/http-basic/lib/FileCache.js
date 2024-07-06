'use strict';
exports.__esModule = true;
var fs = require("fs");
var path_1 = require("path");
var crypto_1 = require("crypto");
function jsonParse(data, cb) {
    var result = null;
    try {
        result = JSON.parse(data);
    }
    catch (ex) {
        if (ex instanceof Error) {
            return cb(ex);
        }
        return cb(new Error(ex + ''));
    }
    cb(null, result);
}
var FileCache = /** @class */ (function () {
    function FileCache(location) {
        this._location = location;
    }
    FileCache.prototype.getResponse = function (url, callback) {
        var key = (0, path_1.resolve)(this._location, this.getCacheKey(url));
        fs.readFile(key + '.json', 'utf8', function (err, data) {
            if (err && err.code === 'ENOENT')
                return callback(null, null);
            else if (err)
                return callback(err, null);
            jsonParse(data, function (err, response) {
                if (err) {
                    return callback(err, null);
                }
                var body = fs.createReadStream(key + '.body');
                response.body = body;
                callback(null, response);
            });
        });
    };
    FileCache.prototype.setResponse = function (url, response) {
        var key = (0, path_1.resolve)(this._location, this.getCacheKey(url));
        var errored = false;
        fs.mkdir(this._location, { recursive: true }, function (err) {
            if (err && err.code !== 'EEXIST') {
                console.warn('Error creating cache: ' + err.message);
                return;
            }
            response.body.pipe(fs.createWriteStream(key + '.body')).on('error', function (err) {
                errored = true;
                console.warn('Error writing to cache: ' + err.message);
            }).on('close', function () {
                if (!errored) {
                    fs.writeFile(key + '.json', JSON.stringify({
                        statusCode: response.statusCode,
                        headers: response.headers,
                        requestHeaders: response.requestHeaders,
                        requestTimestamp: response.requestTimestamp
                    }, null, '  '), function (err) {
                        if (err) {
                            console.warn('Error writing to cache: ' + err.message);
                        }
                    });
                }
            });
        });
    };
    FileCache.prototype.updateResponseHeaders = function (url, response) {
        var key = (0, path_1.resolve)(this._location, this.getCacheKey(url));
        fs.readFile(key + '.json', 'utf8', function (err, data) {
            if (err) {
                console.warn('Error writing to cache: ' + err.message);
                return;
            }
            var parsed = null;
            try {
                parsed = JSON.parse(data);
            }
            catch (ex) {
                if (ex instanceof Error) {
                    console.warn('Error writing to cache: ' + ex.message);
                }
                return;
            }
            fs.writeFile(key + '.json', JSON.stringify({
                statusCode: parsed.statusCode,
                headers: response.headers,
                requestHeaders: parsed.requestHeaders,
                requestTimestamp: response.requestTimestamp
            }, null, '  '), function (err) {
                if (err) {
                    console.warn('Error writing to cache: ' + err.message);
                }
            });
        });
    };
    FileCache.prototype.invalidateResponse = function (url, callback) {
        var key = (0, path_1.resolve)(this._location, this.getCacheKey(url));
        fs.unlink(key + '.json', function (err) {
            if (err && err.code === 'ENOENT')
                return callback(null);
            else
                callback(err || null);
        });
    };
    FileCache.prototype.getCacheKey = function (url) {
        var hash = (0, crypto_1.createHash)('sha512');
        hash.update(url);
        return hash.digest('hex');
    };
    return FileCache;
}());
exports["default"] = FileCache;
