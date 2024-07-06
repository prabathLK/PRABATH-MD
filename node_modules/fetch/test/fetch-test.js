/* eslint no-unused-expressions:0 */
/* globals afterEach, beforeEach, describe, it */

'use strict';

var chai = require('chai');
var expect = chai.expect;

//var http = require('http');
var fetch = require('../lib/fetch');
var http = require('http');
var https = require('https');

chai.config.includeStack = true;

var HTTP_PORT = 9998;
var HTTPS_PORT = 9993;
var USE_ALLOC = typeof Buffer.alloc === 'function';

var httpsOptions = {
    key: '-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIIEpAIBAAKCAQEA6Z5Qqhw+oWfhtEiMHE32Ht94mwTBpAfjt3vPpX8M7DMCTwHs\n' +
        '1xcXvQ4lQ3rwreDTOWdoJeEEy7gMxXqH0jw0WfBx+8IIJU69xstOyT7FRFDvA1yT\n' +
        'RXY2yt9K5s6SKken/ebMfmZR+03ND4UFsDzkz0FfgcjrkXmrMF5Eh5UXX/+9YHeU\n' +
        'xlp0gMAt+/SumSmgCaysxZLjLpd4uXz+X+JVxsk1ACg1NoEO7lWJC/3WBP7MIcu2\n' +
        'wVsMd2XegLT0gWYfT1/jsIH64U/mS/SVXC9QhxMl9Yfko2kx1OiYhDxhHs75RJZh\n' +
        'rNRxgfiwgSb50Gw4NAQaDIxr/DJPdLhgnpY6UQIDAQABAoIBAE+tfzWFjJbgJ0ql\n' +
        's6Ozs020Sh4U8TZQuonJ4HhBbNbiTtdDgNObPK1uNadeNtgW5fOeIRdKN6iDjVeN\n' +
        'AuXhQrmqGDYVZ1HSGUfD74sTrZQvRlWPLWtzdhybK6Css41YAyPFo9k4bJ2ZW2b/\n' +
        'p4EEQ8WsNja9oBpttMU6YYUchGxo1gujN8hmfDdXUQx3k5Xwx4KA68dveJ8GasIt\n' +
        'd+0Jd/FVwCyyx8HTiF1FF8QZYQeAXxbXJgLBuCsMQJghlcpBEzWkscBR3Ap1U0Zi\n' +
        '4oat8wrPZGCblaA6rNkRUVbc/+Vw0stnuJ/BLHbPxyBs6w495yBSjBqUWZMvljNz\n' +
        'm9/aK0ECgYEA9oVIVAd0enjSVIyAZNbw11ElidzdtBkeIJdsxqhmXzeIFZbB39Gd\n' +
        'bjtAVclVbq5mLsI1j22ER2rHA4Ygkn6vlLghK3ZMPxZa57oJtmL3oP0RvOjE4zRV\n' +
        'dzKexNGo9gU/x9SQbuyOmuauvAYhXZxeLpv+lEfsZTqqrvPUGeBiEQcCgYEA8poG\n' +
        'WVnykWuTmCe0bMmvYDsWpAEiZnFLDaKcSbz3O7RMGbPy1cypmqSinIYUpURBT/WY\n' +
        'wVPAGtjkuTXtd1Cy58m7PqziB7NNWMcsMGj+lWrTPZ6hCHIBcAImKEPpd+Y9vGJX\n' +
        'oatFJguqAGOz7rigBq6iPfeQOCWpmprNAuah++cCgYB1gcybOT59TnA7mwlsh8Qf\n' +
        'bm+tSllnin2A3Y0dGJJLmsXEPKtHS7x2Gcot2h1d98V/TlWHe5WNEUmx1VJbYgXB\n' +
        'pw8wj2ACxl4ojNYqWPxegaLd4DpRbtW6Tqe9e47FTnU7hIggR6QmFAWAXI+09l8y\n' +
        'amssNShqjE9lu5YDi6BTKwKBgQCuIlKGViLfsKjrYSyHnajNWPxiUhIgGBf4PI0T\n' +
        '/Jg1ea/aDykxv0rKHnw9/5vYGIsM2st/kR7l5mMecg/2Qa145HsLfMptHo1ZOPWF\n' +
        '9gcuttPTegY6aqKPhGthIYX2MwSDMM+X0ri6m0q2JtqjclAjG7yG4CjbtGTt/UlE\n' +
        'WMlSZwKBgQDslGeLUnkW0bsV5EG3AKRUyPKz/6DVNuxaIRRhOeWVKV101claqXAT\n' +
        'wXOpdKrvkjZbT4AzcNrlGtRl3l7dEVXTu+dN7/ZieJRu7zaStlAQZkIyP9O3DdQ3\n' +
        'rIcetQpfrJ1cAqz6Ng0pD0mh77vQ13WG1BBmDFa2A9BuzLoBituf4g==\n' +
        '-----END RSA PRIVATE KEY-----',
    cert: '-----BEGIN CERTIFICATE-----\n' +
        'MIICpDCCAYwCCQCuVLVKVTXnAjANBgkqhkiG9w0BAQsFADAUMRIwEAYDVQQDEwls\n' +
        'b2NhbGhvc3QwHhcNMTUwMjEyMTEzMjU4WhcNMjUwMjA5MTEzMjU4WjAUMRIwEAYD\n' +
        'VQQDEwlsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDp\n' +
        'nlCqHD6hZ+G0SIwcTfYe33ibBMGkB+O3e8+lfwzsMwJPAezXFxe9DiVDevCt4NM5\n' +
        'Z2gl4QTLuAzFeofSPDRZ8HH7wgglTr3Gy07JPsVEUO8DXJNFdjbK30rmzpIqR6f9\n' +
        '5sx+ZlH7Tc0PhQWwPOTPQV+ByOuReaswXkSHlRdf/71gd5TGWnSAwC379K6ZKaAJ\n' +
        'rKzFkuMul3i5fP5f4lXGyTUAKDU2gQ7uVYkL/dYE/swhy7bBWwx3Zd6AtPSBZh9P\n' +
        'X+OwgfrhT+ZL9JVcL1CHEyX1h+SjaTHU6JiEPGEezvlElmGs1HGB+LCBJvnQbDg0\n' +
        'BBoMjGv8Mk90uGCeljpRAgMBAAEwDQYJKoZIhvcNAQELBQADggEBABXm8GPdY0sc\n' +
        'mMUFlgDqFzcevjdGDce0QfboR+M7WDdm512Jz2SbRTgZD/4na42ThODOZz9z1AcM\n' +
        'zLgx2ZNZzVhBz0odCU4JVhOCEks/OzSyKeGwjIb4JAY7dh+Kju1+6MNfQJ4r1Hza\n' +
        'SVXH0+JlpJDaJ73NQ2JyfqELmJ1mTcptkA/N6rQWhlzycTBSlfogwf9xawgVPATP\n' +
        '4AuwgjHl12JI2HVVs1gu65Y3slvaHRCr0B4+Kg1GYNLLcbFcK+NEHrHmPxy9TnTh\n' +
        'Zwp1dsNQU+Xkylz8IUANWSLHYZOMtN2e5SKIdwTtl5C8YxveuY8YKb1gDExnMraT\n' +
        'VGXQDqPleug=\n' +
        '-----END CERTIFICATE-----'
};

describe('fetch tests', function () {
    this.timeout(10000); // eslint-disable-line
    var httpServer, httpsServer;

    beforeEach(function (done) {
        httpServer = http.createServer(function (req, res) {
            switch (req.url) {

                case '/redirect6':
                    res.writeHead(302, {
                        Location: '/redirect5'
                    });
                    res.end();
                    break;

                case '/redirect5':
                    res.writeHead(302, {
                        Location: '/redirect4'
                    });
                    res.end();
                    break;

                case '/redirect4':
                    res.writeHead(302, {
                        Location: '/redirect3'
                    });
                    res.end();
                    break;

                case '/redirect3':
                    res.writeHead(302, {
                        Location: '/redirect2'
                    });
                    res.end();
                    break;

                case '/redirect2':
                    res.writeHead(302, {
                        Location: '/redirect1'
                    });
                    res.end();
                    break;

                case '/redirect1':
                    res.writeHead(302, {
                        Location: '/'
                    });
                    res.end();
                    break;

                case '/gzip':
                    res.writeHead(200, {
                        'Content-Type': 'text/plain',
                        'Content-Encoding': 'gzip'
                    });
                    var str = 'H4sIAAAAAAAAA/NIzcnJVwjPL8pJUfAICQngAgCwsOrsEQAAAA==';
                    var strSize = Buffer.byteLength(str, 'base64');
                    var strBuf = USE_ALLOC ? Buffer.alloc(strSize, str, 'base64') : new Buffer(str, 'base64');
                    res.end(strBuf);
                    break;

                case '/invalid':
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('Hello World HTTP\n');
                    break;

                case '/auth':
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    var auth = req.headers.authorization.split(' ').pop();
                    var authSize = Buffer.byteLength(auth, 'base64');
                    var authBuf = USE_ALLOC ? Buffer.alloc(authSize, auth, 'base64') : new Buffer(auth, 'base64');
                    res.end(authBuf);
                    break;

                default:
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('Hello World HTTP\n');
            }
        });

        httpsServer = https.createServer(httpsOptions, function (req, res) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Hello World HTTPS\n');
        });

        httpServer.listen(HTTP_PORT, function () {
            httpsServer.listen(HTTPS_PORT, done);
        });
    });

    afterEach(function (done) {
        httpServer.close(function () {
            httpsServer.close(done);
        });
    });

    it('should fetch HTTP data', function (done) {
        var req = new fetch.FetchStream('http://localhost:' + HTTP_PORT);
        var buf = [];
        req.on('data', function (chunk) {
            buf.push(chunk);
        });
        req.on('end', function () {
            expect(Buffer.concat(buf).toString()).to.equal('Hello World HTTP\n');
            done();
        });
    });

    it('should fetch HTTPS data', function (done) {
        var req = new fetch.FetchStream('https://localhost:' + HTTPS_PORT, {
            rejectUnauthorized: false
        });
        var buf = [];
        req.on('data', function (chunk) {
            buf.push(chunk);
        });
        req.on('end', function () {
            expect(Buffer.concat(buf).toString()).to.equal('Hello World HTTPS\n');
            done();
        });
    });

    it('should fail on self signed HTTPS certificate', function (done) {
        var req = new fetch.FetchStream('https://localhost:' + HTTPS_PORT);
        req.on('error', function (err) {
            expect(err).to.exist;
            done();
        });
        req.on('data', function () {
            expect(false).to.be.true;
        });
        req.on('end', function () {
            expect(false).to.be.true;
        });
    });

    it('should fetch HTTP data with redirects', function (done) {
        var req = new fetch.FetchStream('http://localhost:' + HTTP_PORT + '/redirect3');
        var buf = [];
        req.on('data', function (chunk) {
            buf.push(chunk);
        });
        req.on('end', function () {
            expect(Buffer.concat(buf).toString()).to.equal('Hello World HTTP\n');
            done();
        });
    });

    it('should not follow too many redirects', function (done) {
        var req = new fetch.FetchStream('http://localhost:' + HTTP_PORT + '/redirect6', {
            maxRedirects: 5
        });

        req.on('meta', function (meta) {
            expect(meta.status).to.equal(302);
        });

        var buf = [];
        req.on('data', function (chunk) {
            buf.push(chunk);
        });
        req.on('end', function () {
            done();
        });
    });

    it('should unzip compressed HTTP data', function (done) {
        var req = new fetch.FetchStream('http://localhost:' + HTTP_PORT + '/gzip');
        var buf = [];
        req.on('data', function (chunk) {
            buf.push(chunk);
        });
        req.on('end', function () {
            expect(Buffer.concat(buf).toString()).to.equal('Hello World HTTP\n');
            done();
        });
    });

    it('should return error for unresolved host', function (done) {
        var req = new fetch.FetchStream('http://asfhaskhhgbjdsfhgbsdjgk');
        var buf = [];
        req.on('data', function (chunk) {
            buf.push(chunk);
        });
        req.on('error', function (err) {
            expect(err).to.exist;
            done();
        });
        req.on('end', function () {});
    });

    it('should handle basic HTTP auth', function (done) {
        var req = new fetch.FetchStream('http://user:pass@localhost:' + HTTP_PORT + '/auth');
        var buf = [];
        req.on('data', function (chunk) {
            buf.push(chunk);
        });
        req.on('end', function () {
            expect(Buffer.concat(buf).toString()).to.equal('user:pass');
            done();
        });
    });

    it('should return error for invalid protocol', function (done) {
        var req = new fetch.FetchStream('http://localhost:' + HTTPS_PORT, {
            timeout: 1000
        });
        var buf = [];

        req.on('data', function (chunk) {
            buf.push(chunk);
        });
        req.on('error', function (err) {
            expect(err).to.exist;
            done();
        });
        req.on('end', function () {});
    });
});
