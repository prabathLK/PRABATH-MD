"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Module dependencies.
 */
// eslint-disable-next-line node/no-deprecated-api
var _require = require('url'),
    parse = _require.parse,
    format = _require.format,
    resolve = _require.resolve;

var Stream = require('stream');

var https = require('https');

var http = require('http');

var fs = require('fs');

var zlib = require('zlib');

var util = require('util');

var qs = require('qs');

var mime = require('mime');

var methods = require('methods');

var FormData = require('form-data');

var formidable = require('formidable');

var debug = require('debug')('superagent');

var CookieJar = require('cookiejar');

var semver = require('semver');

var safeStringify = require('fast-safe-stringify');

var utils = require('../utils');

var RequestBase = require('../request-base');

var _require2 = require('./unzip'),
    unzip = _require2.unzip;

var Response = require('./response');

var http2;
if (semver.gte(process.version, 'v10.10.0')) http2 = require('./http2wrapper');

function request(method, url) {
  // callback
  if (typeof url === 'function') {
    return new exports.Request('GET', method).end(url);
  } // url first


  if (arguments.length === 1) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

module.exports = request;
exports = module.exports;
/**
 * Expose `Request`.
 */

exports.Request = Request;
/**
 * Expose the agent function
 */

exports.agent = require('./agent');
/**
 * Noop.
 */

function noop() {}
/**
 * Expose `Response`.
 */


exports.Response = Response;
/**
 * Define "form" mime type.
 */

mime.define({
  'application/x-www-form-urlencoded': ['form', 'urlencoded', 'form-data']
}, true);
/**
 * Protocol map.
 */

exports.protocols = {
  'http:': http,
  'https:': https,
  'http2:': http2
};
/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

exports.serialize = {
  'application/x-www-form-urlencoded': qs.stringify,
  'application/json': safeStringify
};
/**
 * Default parsers.
 *
 *     superagent.parse['application/xml'] = function(res, fn){
 *       fn(null, res);
 *     };
 *
 */

exports.parse = require('./parsers');
/**
 * Default buffering map. Can be used to set certain
 * response types to buffer/not buffer.
 *
 *     superagent.buffer['application/xml'] = true;
 */

exports.buffer = {};
/**
 * Initialize internal header tracking properties on a request instance.
 *
 * @param {Object} req the instance
 * @api private
 */

function _initHeaders(req) {
  req._header = {// coerces header names to lowercase
  };
  req.header = {// preserves header name case
  };
}
/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String|Object} url
 * @api public
 */


function Request(method, url) {
  Stream.call(this);
  if (typeof url !== 'string') url = format(url);
  this._enableHttp2 = Boolean(process.env.HTTP2_TEST); // internal only

  this._agent = false;
  this._formData = null;
  this.method = method;
  this.url = url;

  _initHeaders(this);

  this.writable = true;
  this._redirects = 0;
  this.redirects(method === 'HEAD' ? 0 : 5);
  this.cookies = '';
  this.qs = {};
  this._query = [];
  this.qsRaw = this._query; // Unused, for backwards compatibility only

  this._redirectList = [];
  this._streamRequest = false;
  this.once('end', this.clearTimeout.bind(this));
}
/**
 * Inherit from `Stream` (which inherits from `EventEmitter`).
 * Mixin `RequestBase`.
 */


util.inherits(Request, Stream); // eslint-disable-next-line new-cap

RequestBase(Request.prototype);
/**
 * Enable or Disable http2.
 *
 * Enable http2.
 *
 * ``` js
 * request.get('http://localhost/')
 *   .http2()
 *   .end(callback);
 *
 * request.get('http://localhost/')
 *   .http2(true)
 *   .end(callback);
 * ```
 *
 * Disable http2.
 *
 * ``` js
 * request = request.http2();
 * request.get('http://localhost/')
 *   .http2(false)
 *   .end(callback);
 * ```
 *
 * @param {Boolean} enable
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.http2 = function (bool) {
  if (exports.protocols['http2:'] === undefined) {
    throw new Error('superagent: this version of Node.js does not support http2');
  }

  this._enableHttp2 = bool === undefined ? true : bool;
  return this;
};
/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('http://localhost/upload')
 *   .attach('field', Buffer.from('<b>Hello world</b>'), 'hello.html')
 *   .end(callback);
 * ```
 *
 * A filename may also be used:
 *
 * ``` js
 * request.post('http://localhost/upload')
 *   .attach('files', 'image.jpg')
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {String|fs.ReadStream|Buffer} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.attach = function (field, file, options) {
  if (file) {
    if (this._data) {
      throw new Error("superagent can't mix .send() and .attach()");
    }

    var o = options || {};

    if (typeof options === 'string') {
      o = {
        filename: options
      };
    }

    if (typeof file === 'string') {
      if (!o.filename) o.filename = file;
      debug('creating `fs.ReadStream` instance for file: %s', file);
      file = fs.createReadStream(file);
    } else if (!o.filename && file.path) {
      o.filename = file.path;
    }

    this._getFormData().append(field, file, o);
  }

  return this;
};

Request.prototype._getFormData = function () {
  var _this = this;

  if (!this._formData) {
    this._formData = new FormData();

    this._formData.on('error', function (err) {
      debug('FormData error', err);

      if (_this.called) {
        // The request has already finished and the callback was called.
        // Silently ignore the error.
        return;
      }

      _this.callback(err);

      _this.abort();
    });
  }

  return this._formData;
};
/**
 * Gets/sets the `Agent` to use for this HTTP request. The default (if this
 * function is not called) is to opt out of connection pooling (`agent: false`).
 *
 * @param {http.Agent} agent
 * @return {http.Agent}
 * @api public
 */


Request.prototype.agent = function (agent) {
  if (arguments.length === 0) return this._agent;
  this._agent = agent;
  return this;
};
/**
 * Set _Content-Type_ response header passed through `mime.getType()`.
 *
 * Examples:
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('json')
 *        .send(jsonstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/json')
 *        .send(jsonstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.type = function (type) {
  return this.set('Content-Type', type.includes('/') ? type : mime.getType(type));
};
/**
 * Set _Accept_ response header passed through `mime.getType()`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.accept = function (type) {
  return this.set('Accept', type.includes('/') ? type : mime.getType(type));
};
/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.query = function (val) {
  if (typeof val === 'string') {
    this._query.push(val);
  } else {
    Object.assign(this.qs, val);
  }

  return this;
};
/**
 * Write raw `data` / `encoding` to the socket.
 *
 * @param {Buffer|String} data
 * @param {String} encoding
 * @return {Boolean}
 * @api public
 */


Request.prototype.write = function (data, encoding) {
  var req = this.request();

  if (!this._streamRequest) {
    this._streamRequest = true;
  }

  return req.write(data, encoding);
};
/**
 * Pipe the request body to `stream`.
 *
 * @param {Stream} stream
 * @param {Object} options
 * @return {Stream}
 * @api public
 */


Request.prototype.pipe = function (stream, options) {
  this.piped = true; // HACK...

  this.buffer(false);
  this.end();
  return this._pipeContinue(stream, options);
};

Request.prototype._pipeContinue = function (stream, options) {
  var _this2 = this;

  this.req.once('response', function (res) {
    // redirect
    if (isRedirect(res.statusCode) && _this2._redirects++ !== _this2._maxRedirects) {
      return _this2._redirect(res) === _this2 ? _this2._pipeContinue(stream, options) : undefined;
    }

    _this2.res = res;

    _this2._emitResponse();

    if (_this2._aborted) return;

    if (_this2._shouldUnzip(res)) {
      var unzipObj = zlib.createUnzip();
      unzipObj.on('error', function (err) {
        if (err && err.code === 'Z_BUF_ERROR') {
          // unexpected end of file is ignored by browsers and curl
          stream.emit('end');
          return;
        }

        stream.emit('error', err);
      });
      res.pipe(unzipObj).pipe(stream, options);
    } else {
      res.pipe(stream, options);
    }

    res.once('end', function () {
      _this2.emit('end');
    });
  });
  return stream;
};
/**
 * Enable / disable buffering.
 *
 * @return {Boolean} [val]
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.buffer = function (val) {
  this._buffer = val !== false;
  return this;
};
/**
 * Redirect to `url
 *
 * @param {IncomingMessage} res
 * @return {Request} for chaining
 * @api private
 */


Request.prototype._redirect = function (res) {
  var url = res.headers.location;

  if (!url) {
    return this.callback(new Error('No location header for redirect'), res);
  }

  debug('redirect %s -> %s', this.url, url); // location

  url = resolve(this.url, url); // ensure the response is being consumed
  // this is required for Node v0.10+

  res.resume();
  var headers = this.req.getHeaders ? this.req.getHeaders() : this.req._headers;
  var changesOrigin = parse(url).host !== parse(this.url).host; // implementation of 302 following defacto standard

  if (res.statusCode === 301 || res.statusCode === 302) {
    // strip Content-* related fields
    // in case of POST etc
    headers = utils.cleanHeader(headers, changesOrigin); // force GET

    this.method = this.method === 'HEAD' ? 'HEAD' : 'GET'; // clear data

    this._data = null;
  } // 303 is always GET


  if (res.statusCode === 303) {
    // strip Content-* related fields
    // in case of POST etc
    headers = utils.cleanHeader(headers, changesOrigin); // force method

    this.method = 'GET'; // clear data

    this._data = null;
  } // 307 preserves method
  // 308 preserves method


  delete headers.host;
  delete this.req;
  delete this._formData; // remove all add header except User-Agent

  _initHeaders(this); // redirect


  this._endCalled = false;
  this.url = url;
  this.qs = {};
  this._query.length = 0;
  this.set(headers);
  this.emit('redirect', res);

  this._redirectList.push(this.url);

  this.end(this._callback);
  return this;
};
/**
 * Set Authorization field value with `user` and `pass`.
 *
 * Examples:
 *
 *   .auth('tobi', 'learnboost')
 *   .auth('tobi:learnboost')
 *   .auth('tobi')
 *   .auth(accessToken, { type: 'bearer' })
 *
 * @param {String} user
 * @param {String} [pass]
 * @param {Object} [options] options with authorization type 'basic' or 'bearer' ('basic' is default)
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.auth = function (user, pass, options) {
  if (arguments.length === 1) pass = '';

  if (_typeof(pass) === 'object' && pass !== null) {
    // pass is optional and can be replaced with options
    options = pass;
    pass = '';
  }

  if (!options) {
    options = {
      type: 'basic'
    };
  }

  var encoder = function encoder(string) {
    return Buffer.from(string).toString('base64');
  };

  return this._auth(user, pass, options, encoder);
};
/**
 * Set the certificate authority option for https request.
 *
 * @param {Buffer | Array} cert
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.ca = function (cert) {
  this._ca = cert;
  return this;
};
/**
 * Set the client certificate key option for https request.
 *
 * @param {Buffer | String} cert
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.key = function (cert) {
  this._key = cert;
  return this;
};
/**
 * Set the key, certificate, and CA certs of the client in PFX or PKCS12 format.
 *
 * @param {Buffer | String} cert
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.pfx = function (cert) {
  if (_typeof(cert) === 'object' && !Buffer.isBuffer(cert)) {
    this._pfx = cert.pfx;
    this._passphrase = cert.passphrase;
  } else {
    this._pfx = cert;
  }

  return this;
};
/**
 * Set the client certificate option for https request.
 *
 * @param {Buffer | String} cert
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.cert = function (cert) {
  this._cert = cert;
  return this;
};
/**
 * Do not reject expired or invalid TLS certs.
 * sets `rejectUnauthorized=true`. Be warned that this allows MITM attacks.
 *
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.disableTLSCerts = function () {
  this._disableTLSCerts = true;
  return this;
};
/**
 * Return an http[s] request.
 *
 * @return {OutgoingMessage}
 * @api private
 */
// eslint-disable-next-line complexity


Request.prototype.request = function () {
  var _this3 = this;

  if (this.req) return this.req;
  var options = {};

  try {
    var query = qs.stringify(this.qs, {
      indices: false,
      strictNullHandling: true
    });

    if (query) {
      this.qs = {};

      this._query.push(query);
    }

    this._finalizeQueryString();
  } catch (err) {
    return this.emit('error', err);
  }

  var url = this.url;
  var retries = this._retries; // Capture backticks as-is from the final query string built above.
  // Note: this'll only find backticks entered in req.query(String)
  // calls, because qs.stringify unconditionally encodes backticks.

  var queryStringBackticks;

  if (url.includes('`')) {
    var queryStartIndex = url.indexOf('?');

    if (queryStartIndex !== -1) {
      var queryString = url.slice(queryStartIndex + 1);
      queryStringBackticks = queryString.match(/`|%60/g);
    }
  } // default to http://


  if (url.indexOf('http') !== 0) url = "http://".concat(url);
  url = parse(url); // See https://github.com/visionmedia/superagent/issues/1367

  if (queryStringBackticks) {
    var i = 0;
    url.query = url.query.replace(/%60/g, function () {
      return queryStringBackticks[i++];
    });
    url.search = "?".concat(url.query);
    url.path = url.pathname + url.search;
  } // support unix sockets


  if (/^https?\+unix:/.test(url.protocol) === true) {
    // get the protocol
    url.protocol = "".concat(url.protocol.split('+')[0], ":"); // get the socket, path

    var unixParts = url.path.match(/^([^/]+)(.+)$/);
    options.socketPath = unixParts[1].replace(/%2F/g, '/');
    url.path = unixParts[2];
  } // Override IP address of a hostname


  if (this._connectOverride) {
    var _url = url,
        hostname = _url.hostname;
    var match = hostname in this._connectOverride ? this._connectOverride[hostname] : this._connectOverride['*'];

    if (match) {
      // backup the real host
      if (!this._header.host) {
        this.set('host', url.host);
      }

      var newHost;
      var newPort;

      if (_typeof(match) === 'object') {
        newHost = match.host;
        newPort = match.port;
      } else {
        newHost = match;
        newPort = url.port;
      } // wrap [ipv6]


      url.host = /:/.test(newHost) ? "[".concat(newHost, "]") : newHost;

      if (newPort) {
        url.host += ":".concat(newPort);
        url.port = newPort;
      }

      url.hostname = newHost;
    }
  } // options


  options.method = this.method;
  options.port = url.port;
  options.path = url.path;
  options.host = url.hostname;
  options.ca = this._ca;
  options.key = this._key;
  options.pfx = this._pfx;
  options.cert = this._cert;
  options.passphrase = this._passphrase;
  options.agent = this._agent;
  options.rejectUnauthorized = typeof this._disableTLSCerts === 'boolean' ? !this._disableTLSCerts : process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0'; // Allows request.get('https://1.2.3.4/').set('Host', 'example.com')

  if (this._header.host) {
    options.servername = this._header.host.replace(/:\d+$/, '');
  }

  if (this._trustLocalhost && /^(?:localhost|127\.0\.0\.\d+|(0*:)+:0*1)$/.test(url.hostname)) {
    options.rejectUnauthorized = false;
  } // initiate request


  var mod = this._enableHttp2 ? exports.protocols['http2:'].setProtocol(url.protocol) : exports.protocols[url.protocol]; // request

  this.req = mod.request(options);
  var req = this.req; // set tcp no delay

  req.setNoDelay(true);

  if (options.method !== 'HEAD') {
    req.setHeader('Accept-Encoding', 'gzip, deflate');
  }

  this.protocol = url.protocol;
  this.host = url.host; // expose events

  req.once('drain', function () {
    _this3.emit('drain');
  });
  req.on('error', function (err) {
    // flag abortion here for out timeouts
    // because node will emit a faux-error "socket hang up"
    // when request is aborted before a connection is made
    if (_this3._aborted) return; // if not the same, we are in the **old** (cancelled) request,
    // so need to continue (same as for above)

    if (_this3._retries !== retries) return; // if we've received a response then we don't want to let
    // an error in the request blow up the response

    if (_this3.response) return;

    _this3.callback(err);
  }); // auth

  if (url.auth) {
    var auth = url.auth.split(':');
    this.auth(auth[0], auth[1]);
  }

  if (this.username && this.password) {
    this.auth(this.username, this.password);
  }

  for (var key in this.header) {
    if (Object.prototype.hasOwnProperty.call(this.header, key)) req.setHeader(key, this.header[key]);
  } // add cookies


  if (this.cookies) {
    if (Object.prototype.hasOwnProperty.call(this._header, 'cookie')) {
      // merge
      var tmpJar = new CookieJar.CookieJar();
      tmpJar.setCookies(this._header.cookie.split(';'));
      tmpJar.setCookies(this.cookies.split(';'));
      req.setHeader('Cookie', tmpJar.getCookies(CookieJar.CookieAccessInfo.All).toValueString());
    } else {
      req.setHeader('Cookie', this.cookies);
    }
  }

  return req;
};
/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */


Request.prototype.callback = function (err, res) {
  if (this._shouldRetry(err, res)) {
    return this._retry();
  } // Avoid the error which is emitted from 'socket hang up' to cause the fn undefined error on JS runtime.


  var fn = this._callback || noop;
  this.clearTimeout();
  if (this.called) return console.warn('superagent: double callback bug');
  this.called = true;

  if (!err) {
    try {
      if (!this._isResponseOK(res)) {
        var msg = 'Unsuccessful HTTP response';

        if (res) {
          msg = http.STATUS_CODES[res.status] || msg;
        }

        err = new Error(msg);
        err.status = res ? res.status : undefined;
      }
    } catch (err_) {
      err = err_;
    }
  } // It's important that the callback is called outside try/catch
  // to avoid double callback


  if (!err) {
    return fn(null, res);
  }

  err.response = res;
  if (this._maxRetries) err.retries = this._retries - 1; // only emit error event if there is a listener
  // otherwise we assume the callback to `.end()` will get the error

  if (err && this.listeners('error').length > 0) {
    this.emit('error', err);
  }

  fn(err, res);
};
/**
 * Check if `obj` is a host object,
 *
 * @param {Object} obj host object
 * @return {Boolean} is a host object
 * @api private
 */


Request.prototype._isHost = function (obj) {
  return Buffer.isBuffer(obj) || obj instanceof Stream || obj instanceof FormData;
};
/**
 * Initiate request, invoking callback `fn(err, res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */


Request.prototype._emitResponse = function (body, files) {
  var response = new Response(this);
  this.response = response;
  response.redirects = this._redirectList;

  if (undefined !== body) {
    response.body = body;
  }

  response.files = files;

  if (this._endCalled) {
    response.pipe = function () {
      throw new Error("end() has already been called, so it's too late to start piping");
    };
  }

  this.emit('response', response);
  return response;
};

Request.prototype.end = function (fn) {
  this.request();
  debug('%s %s', this.method, this.url);

  if (this._endCalled) {
    throw new Error('.end() was called twice. This is not supported in superagent');
  }

  this._endCalled = true; // store callback

  this._callback = fn || noop;

  this._end();
};

Request.prototype._end = function () {
  var _this4 = this;

  if (this._aborted) return this.callback(new Error('The request has been aborted even before .end() was called'));
  var data = this._data;
  var req = this.req;
  var method = this.method;

  this._setTimeouts(); // body


  if (method !== 'HEAD' && !req._headerSent) {
    // serialize stuff
    if (typeof data !== 'string') {
      var contentType = req.getHeader('Content-Type'); // Parse out just the content type from the header (ignore the charset)

      if (contentType) contentType = contentType.split(';')[0];
      var serialize = this._serializer || exports.serialize[contentType];

      if (!serialize && isJSON(contentType)) {
        serialize = exports.serialize['application/json'];
      }

      if (serialize) data = serialize(data);
    } // content-length


    if (data && !req.getHeader('Content-Length')) {
      req.setHeader('Content-Length', Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data));
    }
  } // response
  // eslint-disable-next-line complexity


  req.once('response', function (res) {
    debug('%s %s -> %s', _this4.method, _this4.url, res.statusCode);

    if (_this4._responseTimeoutTimer) {
      clearTimeout(_this4._responseTimeoutTimer);
    }

    if (_this4.piped) {
      return;
    }

    var max = _this4._maxRedirects;
    var mime = utils.type(res.headers['content-type'] || '') || 'text/plain';
    var type = mime.split('/')[0];
    if (type) type = type.toLowerCase().trim();
    var multipart = type === 'multipart';
    var redirect = isRedirect(res.statusCode);
    var responseType = _this4._responseType;
    _this4.res = res; // redirect

    if (redirect && _this4._redirects++ !== max) {
      return _this4._redirect(res);
    }

    if (_this4.method === 'HEAD') {
      _this4.emit('end');

      _this4.callback(null, _this4._emitResponse());

      return;
    } // zlib support


    if (_this4._shouldUnzip(res)) {
      unzip(req, res);
    }

    var buffer = _this4._buffer;

    if (buffer === undefined && mime in exports.buffer) {
      buffer = Boolean(exports.buffer[mime]);
    }

    var parser = _this4._parser;

    if (undefined === buffer) {
      if (parser) {
        console.warn("A custom superagent parser has been set, but buffering strategy for the parser hasn't been configured. Call `req.buffer(true or false)` or set `superagent.buffer[mime] = true or false`");
        buffer = true;
      }
    }

    if (!parser) {
      if (responseType) {
        parser = exports.parse.image; // It's actually a generic Buffer

        buffer = true;
      } else if (multipart) {
        var form = new formidable.IncomingForm();
        parser = form.parse.bind(form);
        buffer = true;
      } else if (isImageOrVideo(mime)) {
        parser = exports.parse.image;
        buffer = true; // For backwards-compatibility buffering default is ad-hoc MIME-dependent
      } else if (exports.parse[mime]) {
        parser = exports.parse[mime];
      } else if (type === 'text') {
        parser = exports.parse.text;
        buffer = buffer !== false; // everyone wants their own white-labeled json
      } else if (isJSON(mime)) {
        parser = exports.parse['application/json'];
        buffer = buffer !== false;
      } else if (buffer) {
        parser = exports.parse.text;
      } else if (undefined === buffer) {
        parser = exports.parse.image; // It's actually a generic Buffer

        buffer = true;
      }
    } // by default only buffer text/*, json and messed up thing from hell


    if (undefined === buffer && isText(mime) || isJSON(mime)) {
      buffer = true;
    }

    _this4._resBuffered = buffer;
    var parserHandlesEnd = false;

    if (buffer) {
      // Protectiona against zip bombs and other nuisance
      var responseBytesLeft = _this4._maxResponseSize || 200000000;
      res.on('data', function (buf) {
        responseBytesLeft -= buf.byteLength || buf.length;

        if (responseBytesLeft < 0) {
          // This will propagate through error event
          var err = new Error('Maximum response size reached');
          err.code = 'ETOOLARGE'; // Parsers aren't required to observe error event,
          // so would incorrectly report success

          parserHandlesEnd = false; // Will emit error event

          res.destroy(err);
        }
      });
    }

    if (parser) {
      try {
        // Unbuffered parsers are supposed to emit response early,
        // which is weird BTW, because response.body won't be there.
        parserHandlesEnd = buffer;
        parser(res, function (err, obj, files) {
          if (_this4.timedout) {
            // Timeout has already handled all callbacks
            return;
          } // Intentional (non-timeout) abort is supposed to preserve partial response,
          // even if it doesn't parse.


          if (err && !_this4._aborted) {
            return _this4.callback(err);
          }

          if (parserHandlesEnd) {
            _this4.emit('end');

            _this4.callback(null, _this4._emitResponse(obj, files));
          }
        });
      } catch (err) {
        _this4.callback(err);

        return;
      }
    }

    _this4.res = res; // unbuffered

    if (!buffer) {
      debug('unbuffered %s %s', _this4.method, _this4.url);

      _this4.callback(null, _this4._emitResponse());

      if (multipart) return; // allow multipart to handle end event

      res.once('end', function () {
        debug('end %s %s', _this4.method, _this4.url);

        _this4.emit('end');
      });
      return;
    } // terminating events


    res.once('error', function (err) {
      parserHandlesEnd = false;

      _this4.callback(err, null);
    });
    if (!parserHandlesEnd) res.once('end', function () {
      debug('end %s %s', _this4.method, _this4.url); // TODO: unless buffering emit earlier to stream

      _this4.emit('end');

      _this4.callback(null, _this4._emitResponse());
    });
  });
  this.emit('request', this);

  var getProgressMonitor = function getProgressMonitor() {
    var lengthComputable = true;
    var total = req.getHeader('Content-Length');
    var loaded = 0;
    var progress = new Stream.Transform();

    progress._transform = function (chunk, encoding, cb) {
      loaded += chunk.length;

      _this4.emit('progress', {
        direction: 'upload',
        lengthComputable: lengthComputable,
        loaded: loaded,
        total: total
      });

      cb(null, chunk);
    };

    return progress;
  };

  var bufferToChunks = function bufferToChunks(buffer) {
    var chunkSize = 16 * 1024; // default highWaterMark value

    var chunking = new Stream.Readable();
    var totalLength = buffer.length;
    var remainder = totalLength % chunkSize;
    var cutoff = totalLength - remainder;

    for (var i = 0; i < cutoff; i += chunkSize) {
      var chunk = buffer.slice(i, i + chunkSize);
      chunking.push(chunk);
    }

    if (remainder > 0) {
      var remainderBuffer = buffer.slice(-remainder);
      chunking.push(remainderBuffer);
    }

    chunking.push(null); // no more data

    return chunking;
  }; // if a FormData instance got created, then we send that as the request body


  var formData = this._formData;

  if (formData) {
    // set headers
    var headers = formData.getHeaders();

    for (var i in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, i)) {
        debug('setting FormData header: "%s: %s"', i, headers[i]);
        req.setHeader(i, headers[i]);
      }
    } // attempt to get "Content-Length" header


    formData.getLength(function (err, length) {
      // TODO: Add chunked encoding when no length (if err)
      if (err) debug('formData.getLength had error', err, length);
      debug('got FormData Content-Length: %s', length);

      if (typeof length === 'number') {
        req.setHeader('Content-Length', length);
      }

      formData.pipe(getProgressMonitor()).pipe(req);
    });
  } else if (Buffer.isBuffer(data)) {
    bufferToChunks(data).pipe(getProgressMonitor()).pipe(req);
  } else {
    req.end(data);
  }
}; // Check whether response has a non-0-sized gzip-encoded body


Request.prototype._shouldUnzip = function (res) {
  if (res.statusCode === 204 || res.statusCode === 304) {
    // These aren't supposed to have any body
    return false;
  } // header content is a string, and distinction between 0 and no information is crucial


  if (res.headers['content-length'] === '0') {
    // We know that the body is empty (unfortunately, this check does not cover chunked encoding)
    return false;
  } // console.log(res);


  return /^\s*(?:deflate|gzip)\s*$/.test(res.headers['content-encoding']);
};
/**
 * Overrides DNS for selected hostnames. Takes object mapping hostnames to IP addresses.
 *
 * When making a request to a URL with a hostname exactly matching a key in the object,
 * use the given IP address to connect, instead of using DNS to resolve the hostname.
 *
 * A special host `*` matches every hostname (keep redirects in mind!)
 *
 *      request.connect({
 *        'test.example.com': '127.0.0.1',
 *        'ipv6.example.com': '::1',
 *      })
 */


Request.prototype.connect = function (connectOverride) {
  if (typeof connectOverride === 'string') {
    this._connectOverride = {
      '*': connectOverride
    };
  } else if (_typeof(connectOverride) === 'object') {
    this._connectOverride = connectOverride;
  } else {
    this._connectOverride = undefined;
  }

  return this;
};

Request.prototype.trustLocalhost = function (toggle) {
  this._trustLocalhost = toggle === undefined ? true : toggle;
  return this;
}; // generate HTTP verb methods


if (!methods.includes('del')) {
  // create a copy so we don't cause conflicts with
  // other packages using the methods package and
  // npm 3.x
  methods = methods.slice(0);
  methods.push('del');
}

methods.forEach(function (method) {
  var name = method;
  method = method === 'del' ? 'delete' : method;
  method = method.toUpperCase();

  request[name] = function (url, data, fn) {
    var req = request(method, url);

    if (typeof data === 'function') {
      fn = data;
      data = null;
    }

    if (data) {
      if (method === 'GET' || method === 'HEAD') {
        req.query(data);
      } else {
        req.send(data);
      }
    }

    if (fn) req.end(fn);
    return req;
  };
});
/**
 * Check if `mime` is text and should be buffered.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api public
 */

function isText(mime) {
  var parts = mime.split('/');
  var type = parts[0];
  if (type) type = type.toLowerCase().trim();
  var subtype = parts[1];
  if (subtype) subtype = subtype.toLowerCase().trim();
  return type === 'text' || subtype === 'x-www-form-urlencoded';
}

function isImageOrVideo(mime) {
  var type = mime.split('/')[0];
  if (type) type = type.toLowerCase().trim();
  return type === 'image' || type === 'video';
}
/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */


function isJSON(mime) {
  // should match /json or +json
  // but not /json-seq
  return /[/+]json($|[^-\w])/i.test(mime);
}
/**
 * Check if we should follow the redirect `code`.
 *
 * @param {Number} code
 * @return {Boolean}
 * @api private
 */


function isRedirect(code) {
  return [301, 302, 303, 305, 307, 308].includes(code);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub2RlL2luZGV4LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJwYXJzZSIsImZvcm1hdCIsInJlc29sdmUiLCJTdHJlYW0iLCJodHRwcyIsImh0dHAiLCJmcyIsInpsaWIiLCJ1dGlsIiwicXMiLCJtaW1lIiwibWV0aG9kcyIsIkZvcm1EYXRhIiwiZm9ybWlkYWJsZSIsImRlYnVnIiwiQ29va2llSmFyIiwic2VtdmVyIiwic2FmZVN0cmluZ2lmeSIsInV0aWxzIiwiUmVxdWVzdEJhc2UiLCJ1bnppcCIsIlJlc3BvbnNlIiwiaHR0cDIiLCJndGUiLCJwcm9jZXNzIiwidmVyc2lvbiIsInJlcXVlc3QiLCJtZXRob2QiLCJ1cmwiLCJleHBvcnRzIiwiUmVxdWVzdCIsImVuZCIsImFyZ3VtZW50cyIsImxlbmd0aCIsIm1vZHVsZSIsImFnZW50Iiwibm9vcCIsImRlZmluZSIsInByb3RvY29scyIsInNlcmlhbGl6ZSIsInN0cmluZ2lmeSIsImJ1ZmZlciIsIl9pbml0SGVhZGVycyIsInJlcSIsIl9oZWFkZXIiLCJoZWFkZXIiLCJjYWxsIiwiX2VuYWJsZUh0dHAyIiwiQm9vbGVhbiIsImVudiIsIkhUVFAyX1RFU1QiLCJfYWdlbnQiLCJfZm9ybURhdGEiLCJ3cml0YWJsZSIsIl9yZWRpcmVjdHMiLCJyZWRpcmVjdHMiLCJjb29raWVzIiwiX3F1ZXJ5IiwicXNSYXciLCJfcmVkaXJlY3RMaXN0IiwiX3N0cmVhbVJlcXVlc3QiLCJvbmNlIiwiY2xlYXJUaW1lb3V0IiwiYmluZCIsImluaGVyaXRzIiwicHJvdG90eXBlIiwiYm9vbCIsInVuZGVmaW5lZCIsIkVycm9yIiwiYXR0YWNoIiwiZmllbGQiLCJmaWxlIiwib3B0aW9ucyIsIl9kYXRhIiwibyIsImZpbGVuYW1lIiwiY3JlYXRlUmVhZFN0cmVhbSIsInBhdGgiLCJfZ2V0Rm9ybURhdGEiLCJhcHBlbmQiLCJvbiIsImVyciIsImNhbGxlZCIsImNhbGxiYWNrIiwiYWJvcnQiLCJ0eXBlIiwic2V0IiwiaW5jbHVkZXMiLCJnZXRUeXBlIiwiYWNjZXB0IiwicXVlcnkiLCJ2YWwiLCJwdXNoIiwiT2JqZWN0IiwiYXNzaWduIiwid3JpdGUiLCJkYXRhIiwiZW5jb2RpbmciLCJwaXBlIiwic3RyZWFtIiwicGlwZWQiLCJfcGlwZUNvbnRpbnVlIiwicmVzIiwiaXNSZWRpcmVjdCIsInN0YXR1c0NvZGUiLCJfbWF4UmVkaXJlY3RzIiwiX3JlZGlyZWN0IiwiX2VtaXRSZXNwb25zZSIsIl9hYm9ydGVkIiwiX3Nob3VsZFVuemlwIiwidW56aXBPYmoiLCJjcmVhdGVVbnppcCIsImNvZGUiLCJlbWl0IiwiX2J1ZmZlciIsImhlYWRlcnMiLCJsb2NhdGlvbiIsInJlc3VtZSIsImdldEhlYWRlcnMiLCJfaGVhZGVycyIsImNoYW5nZXNPcmlnaW4iLCJob3N0IiwiY2xlYW5IZWFkZXIiLCJfZW5kQ2FsbGVkIiwiX2NhbGxiYWNrIiwiYXV0aCIsInVzZXIiLCJwYXNzIiwiZW5jb2RlciIsInN0cmluZyIsIkJ1ZmZlciIsImZyb20iLCJ0b1N0cmluZyIsIl9hdXRoIiwiY2EiLCJjZXJ0IiwiX2NhIiwia2V5IiwiX2tleSIsInBmeCIsImlzQnVmZmVyIiwiX3BmeCIsIl9wYXNzcGhyYXNlIiwicGFzc3BocmFzZSIsIl9jZXJ0IiwiZGlzYWJsZVRMU0NlcnRzIiwiX2Rpc2FibGVUTFNDZXJ0cyIsImluZGljZXMiLCJzdHJpY3ROdWxsSGFuZGxpbmciLCJfZmluYWxpemVRdWVyeVN0cmluZyIsInJldHJpZXMiLCJfcmV0cmllcyIsInF1ZXJ5U3RyaW5nQmFja3RpY2tzIiwicXVlcnlTdGFydEluZGV4IiwiaW5kZXhPZiIsInF1ZXJ5U3RyaW5nIiwic2xpY2UiLCJtYXRjaCIsImkiLCJyZXBsYWNlIiwic2VhcmNoIiwicGF0aG5hbWUiLCJ0ZXN0IiwicHJvdG9jb2wiLCJzcGxpdCIsInVuaXhQYXJ0cyIsInNvY2tldFBhdGgiLCJfY29ubmVjdE92ZXJyaWRlIiwiaG9zdG5hbWUiLCJuZXdIb3N0IiwibmV3UG9ydCIsInBvcnQiLCJyZWplY3RVbmF1dGhvcml6ZWQiLCJOT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEIiwic2VydmVybmFtZSIsIl90cnVzdExvY2FsaG9zdCIsIm1vZCIsInNldFByb3RvY29sIiwic2V0Tm9EZWxheSIsInNldEhlYWRlciIsInJlc3BvbnNlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImhhc093blByb3BlcnR5IiwidG1wSmFyIiwic2V0Q29va2llcyIsImNvb2tpZSIsImdldENvb2tpZXMiLCJDb29raWVBY2Nlc3NJbmZvIiwiQWxsIiwidG9WYWx1ZVN0cmluZyIsIl9zaG91bGRSZXRyeSIsIl9yZXRyeSIsImZuIiwiY29uc29sZSIsIndhcm4iLCJfaXNSZXNwb25zZU9LIiwibXNnIiwiU1RBVFVTX0NPREVTIiwic3RhdHVzIiwiZXJyXyIsIl9tYXhSZXRyaWVzIiwibGlzdGVuZXJzIiwiX2lzSG9zdCIsIm9iaiIsImJvZHkiLCJmaWxlcyIsIl9lbmQiLCJfc2V0VGltZW91dHMiLCJfaGVhZGVyU2VudCIsImNvbnRlbnRUeXBlIiwiZ2V0SGVhZGVyIiwiX3NlcmlhbGl6ZXIiLCJpc0pTT04iLCJieXRlTGVuZ3RoIiwiX3Jlc3BvbnNlVGltZW91dFRpbWVyIiwibWF4IiwidG9Mb3dlckNhc2UiLCJ0cmltIiwibXVsdGlwYXJ0IiwicmVkaXJlY3QiLCJyZXNwb25zZVR5cGUiLCJfcmVzcG9uc2VUeXBlIiwicGFyc2VyIiwiX3BhcnNlciIsImltYWdlIiwiZm9ybSIsIkluY29taW5nRm9ybSIsImlzSW1hZ2VPclZpZGVvIiwidGV4dCIsImlzVGV4dCIsIl9yZXNCdWZmZXJlZCIsInBhcnNlckhhbmRsZXNFbmQiLCJyZXNwb25zZUJ5dGVzTGVmdCIsIl9tYXhSZXNwb25zZVNpemUiLCJidWYiLCJkZXN0cm95IiwidGltZWRvdXQiLCJnZXRQcm9ncmVzc01vbml0b3IiLCJsZW5ndGhDb21wdXRhYmxlIiwidG90YWwiLCJsb2FkZWQiLCJwcm9ncmVzcyIsIlRyYW5zZm9ybSIsIl90cmFuc2Zvcm0iLCJjaHVuayIsImNiIiwiZGlyZWN0aW9uIiwiYnVmZmVyVG9DaHVua3MiLCJjaHVua1NpemUiLCJjaHVua2luZyIsIlJlYWRhYmxlIiwidG90YWxMZW5ndGgiLCJyZW1haW5kZXIiLCJjdXRvZmYiLCJyZW1haW5kZXJCdWZmZXIiLCJmb3JtRGF0YSIsImdldExlbmd0aCIsImNvbm5lY3QiLCJjb25uZWN0T3ZlcnJpZGUiLCJ0cnVzdExvY2FsaG9zdCIsInRvZ2dsZSIsImZvckVhY2giLCJuYW1lIiwidG9VcHBlckNhc2UiLCJzZW5kIiwicGFydHMiLCJzdWJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7OztBQUlBO2VBQ21DQSxPQUFPLENBQUMsS0FBRCxDO0lBQWxDQyxLLFlBQUFBLEs7SUFBT0MsTSxZQUFBQSxNO0lBQVFDLE8sWUFBQUEsTzs7QUFDdkIsSUFBTUMsTUFBTSxHQUFHSixPQUFPLENBQUMsUUFBRCxDQUF0Qjs7QUFDQSxJQUFNSyxLQUFLLEdBQUdMLE9BQU8sQ0FBQyxPQUFELENBQXJCOztBQUNBLElBQU1NLElBQUksR0FBR04sT0FBTyxDQUFDLE1BQUQsQ0FBcEI7O0FBQ0EsSUFBTU8sRUFBRSxHQUFHUCxPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxJQUFNUSxJQUFJLEdBQUdSLE9BQU8sQ0FBQyxNQUFELENBQXBCOztBQUNBLElBQU1TLElBQUksR0FBR1QsT0FBTyxDQUFDLE1BQUQsQ0FBcEI7O0FBQ0EsSUFBTVUsRUFBRSxHQUFHVixPQUFPLENBQUMsSUFBRCxDQUFsQjs7QUFDQSxJQUFNVyxJQUFJLEdBQUdYLE9BQU8sQ0FBQyxNQUFELENBQXBCOztBQUNBLElBQUlZLE9BQU8sR0FBR1osT0FBTyxDQUFDLFNBQUQsQ0FBckI7O0FBQ0EsSUFBTWEsUUFBUSxHQUFHYixPQUFPLENBQUMsV0FBRCxDQUF4Qjs7QUFDQSxJQUFNYyxVQUFVLEdBQUdkLE9BQU8sQ0FBQyxZQUFELENBQTFCOztBQUNBLElBQU1lLEtBQUssR0FBR2YsT0FBTyxDQUFDLE9BQUQsQ0FBUCxDQUFpQixZ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R0FBR0EsSUFBSSxDQUFDb0ksV0FBTCxHQUFtQkMsSUFBbkIsRUFBUDtBQUNWLE1BQUlpRCxPQUFPLEdBQUdELEtBQUssQ0FBQyxDQUFELENBQW5CO0FBQ0EsTUFBSUMsT0FBSixFQUFhQSxPQUFPLEdBQUdBLE9BQU8sQ0FBQ2xELFdBQVIsR0FBc0JDLElBQXRCLEVBQVY7QUFFYixTQUFPckksSUFBSSxLQUFLLE1BQVQsSUFBbUJzTCxPQUFPLEtBQUssdUJBQXRDO0FBQ0Q7O0FBRUQsU0FBU3ZDLGNBQVQsQ0FBd0IxTixJQUF4QixFQUE4QjtBQUM1QixNQUFJMkUsSUFBSSxHQUFHM0UsSUFBSSxDQUFDMEosS0FBTCxDQUFXLEdBQVgsRUFBZ0IsQ0FBaEIsQ0FBWDtBQUNBLE1BQUkvRSxJQUFKLEVBQVVBLElBQUksR0FBR0EsSUFBSSxDQUFDb0ksV0FBTCxHQUFtQkMsSUFBbkIsRUFBUDtBQUVWLFNBQU9ySSxJQUFJLEtBQUssT0FBVCxJQUFvQkEsSUFBSSxLQUFLLE9BQXBDO0FBQ0Q7QUFFRDs7Ozs7Ozs7O0FBUUEsU0FBU2dJLE1BQVQsQ0FBZ0IzTSxJQUFoQixFQUFzQjtBQUNwQjtBQUNBO0FBQ0EsU0FBTyxzQkFBc0J3SixJQUF0QixDQUEyQnhKLElBQTNCLENBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7QUFRQSxTQUFTNkYsVUFBVCxDQUFvQlMsSUFBcEIsRUFBMEI7QUFDeEIsU0FBTyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixHQUExQixFQUErQnpCLFFBQS9CLENBQXdDeUIsSUFBeEMsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBub2RlL25vLWRlcHJlY2F0ZWQtYXBpXG5jb25zdCB7IHBhcnNlLCBmb3JtYXQsIHJlc29sdmUgfSA9IHJlcXVpcmUoJ3VybCcpO1xuY29uc3QgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG5jb25zdCBodHRwcyA9IHJlcXVpcmUoJ2h0dHBzJyk7XG5jb25zdCBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3QgemxpYiA9IHJlcXVpcmUoJ3psaWInKTtcbmNvbnN0IHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5jb25zdCBxcyA9IHJlcXVpcmUoJ3FzJyk7XG5jb25zdCBtaW1lID0gcmVxdWlyZSgnbWltZScpO1xubGV0IG1ldGhvZHMgPSByZXF1aXJlKCdtZXRob2RzJyk7XG5jb25zdCBGb3JtRGF0YSA9IHJlcXVpcmUoJ2Zvcm0tZGF0YScpO1xuY29uc3QgZm9ybWlkYWJsZSA9IHJlcXVpcmUoJ2Zvcm1pZGFibGUnKTtcbmNvbnN0IGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnc3VwZXJhZ2VudCcpO1xuY29uc3QgQ29va2llSmFyID0gcmVxdWlyZSgnY29va2llamFyJyk7XG5jb25zdCBzZW12ZXIgPSByZXF1aXJlKCdzZW12ZXInKTtcbmNvbnN0IHNhZmVTdHJpbmdpZnkgPSByZXF1aXJlKCdmYXN0LXNhZmUtc3RyaW5naWZ5Jyk7XG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbmNvbnN0IFJlcXVlc3RCYXNlID0gcmVxdWlyZSgnLi4vcmVxdWVzdC1iYXNlJyk7XG5jb25zdCB7IHVuemlwIH0gPSByZXF1aXJlKCcuL3VuemlwJyk7XG5jb25zdCBSZXNwb25zZSA9IHJlcXVpcmUoJy4vcmVzcG9uc2UnKTtcblxubGV0IGh0dHAyO1xuXG5pZiAoc2VtdmVyLmd0ZShwcm9jZXNzLnZlcnNpb24sICd2MTAuMTAuMCcpKSBodHRwMiA9IHJlcXVpcmUoJy4vaHR0cDJ3cmFwcGVyJyk7XG5cbmZ1bmN0aW9uIHJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgLy8gY2FsbGJhY2tcbiAgaWYgKHR5cGVvZiB1cmwgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gbmV3IGV4cG9ydHMuUmVxdWVzdCgnR0VUJywgbWV0aG9kKS5lbmQodXJsKTtcbiAgfVxuXG4gIC8vIHVybCBmaXJzdFxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBuZXcgZXhwb3J0cy5SZXF1ZXN0KCdHRVQnLCBtZXRob2QpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBleHBvcnRzLlJlcXVlc3QobWV0aG9kLCB1cmwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVlc3Q7XG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cbi8qKlxuICogRXhwb3NlIGBSZXF1ZXN0YC5cbiAqL1xuXG5leHBvcnRzLlJlcXVlc3QgPSBSZXF1ZXN0O1xuXG4vKipcbiAqIEV4cG9zZSB0aGUgYWdlbnQgZnVuY3Rpb25cbiAqL1xuXG5leHBvcnRzLmFnZW50ID0gcmVxdWlyZSgnLi9hZ2VudCcpO1xuXG4vKipcbiAqIE5vb3AuXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZWAuXG4gKi9cblxuZXhwb3J0cy5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIERlZmluZSBcImZvcm1cIiBtaW1lIHR5cGUuXG4gKi9cblxubWltZS5kZWZpbmUoXG4gIHtcbiAgICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzogWydmb3JtJywgJ3VybGVuY29kZWQnLCAnZm9ybS1kYXRhJ11cbiAgfSxcbiAgdHJ1ZVxuKTtcblxuLyoqXG4gKiBQcm90b2NvbCBtYXAuXG4gKi9cblxuZXhwb3J0cy5wcm90b2NvbHMgPSB7XG4gICdodHRwOic6IGh0dHAsXG4gICdodHRwczonOiBodHRwcyxcbiAgJ2h0dHAyOic6IGh0dHAyXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxuZXhwb3J0cy5zZXJpYWxpemUgPSB7XG4gICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBxcy5zdHJpbmdpZnksXG4gICdhcHBsaWNhdGlvbi9qc29uJzogc2FmZVN0cmluZ2lmeVxufTtcblxuLyoqXG4gKiBEZWZhdWx0IHBhcnNlcnMuXG4gKlxuICogICAgIHN1cGVyYWdlbnQucGFyc2VbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24ocmVzLCBmbil7XG4gKiAgICAgICBmbihudWxsLCByZXMpO1xuICogICAgIH07XG4gKlxuICovXG5cbmV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlcnMnKTtcblxuLyoqXG4gKiBEZWZhdWx0IGJ1ZmZlcmluZyBtYXAuIENhbiBiZSB1c2VkIHRvIHNldCBjZXJ0YWluXG4gKiByZXNwb25zZSB0eXBlcyB0byBidWZmZXIvbm90IGJ1ZmZlci5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC5idWZmZXJbJ2FwcGxpY2F0aW9uL3htbCddID0gdHJ1ZTtcbiAqL1xuZXhwb3J0cy5idWZmZXIgPSB7fTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGludGVybmFsIGhlYWRlciB0cmFja2luZyBwcm9wZXJ0aWVzIG9uIGEgcmVxdWVzdCBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVxIHRoZSBpbnN0YW5jZVxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9pbml0SGVhZGVycyhyZXEpIHtcbiAgcmVxLl9oZWFkZXIgPSB7XG4gICAgLy8gY29lcmNlcyBoZWFkZXIgbmFtZXMgdG8gbG93ZXJjYXNlXG4gIH07XG4gIHJlcS5oZWFkZXIgPSB7XG4gICAgLy8gcHJlc2VydmVzIGhlYWRlciBuYW1lIGNhc2VcbiAgfTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXF1ZXN0YCB3aXRoIHRoZSBnaXZlbiBgbWV0aG9kYCBhbmQgYHVybGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSB1cmxcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gUmVxdWVzdChtZXRob2QsIHVybCkge1xuICBTdHJlYW0uY2FsbCh0aGlzKTtcbiAgaWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSB1cmwgPSBmb3JtYXQodXJsKTtcbiAgdGhpcy5fZW5hYmxlSHR0cDIgPSBCb29sZWFuKHByb2Nlc3MuZW52LkhUVFAyX1RFU1QpOyAvLyBpbnRlcm5hbCBvbmx5XG4gIHRoaXMuX2FnZW50ID0gZmFsc2U7XG4gIHRoaXMuX2Zvcm1EYXRhID0gbnVsbDtcbiAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gIHRoaXMudXJsID0gdXJsO1xuICBfaW5pdEhlYWRlcnModGhpcyk7XG4gIHRoaXMud3JpdGFibGUgPSB0cnVlO1xuICB0aGlzLl9yZWRpcmVjdHMgPSAwO1xuICB0aGlzLnJlZGlyZWN0cyhtZXRob2QgPT09ICdIRUFEJyA/IDAgOiA1KTtcbiAgdGhpcy5jb29raWVzID0gJyc7XG4gIHRoaXMucXMgPSB7fTtcbiAgdGhpcy5fcXVlcnkgPSBbXTtcbiAgdGhpcy5xc1JhdyA9IHRoaXMuX3F1ZXJ5OyAvLyBVbnVzZWQsIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBvbmx5XG4gIHRoaXMuX3JlZGlyZWN0TGlzdCA9IFtdO1xuICB0aGlzLl9zdHJlYW1SZXF1ZXN0ID0gZmFsc2U7XG4gIHRoaXMub25jZSgnZW5kJywgdGhpcy5jbGVhclRpbWVvdXQuYmluZCh0aGlzKSk7XG59XG5cbi8qKlxuICogSW5oZXJpdCBmcm9tIGBTdHJlYW1gICh3aGljaCBpbmhlcml0cyBmcm9tIGBFdmVudEVtaXR0ZXJgKS5cbiAqIE1peGluIGBSZXF1ZXN0QmFzZWAuXG4gKi9cbnV0aWwuaW5oZXJpdHMoUmVxdWVzdCwgU3RyZWFtKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5SZXF1ZXN0QmFzZShSZXF1ZXN0LnByb3RvdHlwZSk7XG5cbi8qKlxuICogRW5hYmxlIG9yIERpc2FibGUgaHR0cDIuXG4gKlxuICogRW5hYmxlIGh0dHAyLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3QvJylcbiAqICAgLmh0dHAyKClcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogcmVxdWVzdC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3QvJylcbiAqICAgLmh0dHAyKHRydWUpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogRGlzYWJsZSBodHRwMi5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QgPSByZXF1ZXN0Lmh0dHAyKCk7XG4gKiByZXF1ZXN0LmdldCgnaHR0cDovL2xvY2FsaG9zdC8nKVxuICogICAuaHR0cDIoZmFsc2UpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSBlbmFibGVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5odHRwMiA9IGZ1bmN0aW9uIChib29sKSB7XG4gIGlmIChleHBvcnRzLnByb3RvY29sc1snaHR0cDI6J10gPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdzdXBlcmFnZW50OiB0aGlzIHZlcnNpb24gb2YgTm9kZS5qcyBkb2VzIG5vdCBzdXBwb3J0IGh0dHAyJ1xuICAgICk7XG4gIH1cblxuICB0aGlzLl9lbmFibGVIdHRwMiA9IGJvb2wgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBib29sO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUXVldWUgdGhlIGdpdmVuIGBmaWxlYCBhcyBhbiBhdHRhY2htZW50IHRvIHRoZSBzcGVjaWZpZWQgYGZpZWxkYCxcbiAqIHdpdGggb3B0aW9uYWwgYG9wdGlvbnNgIChvciBmaWxlbmFtZSkuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3QvdXBsb2FkJylcbiAqICAgLmF0dGFjaCgnZmllbGQnLCBCdWZmZXIuZnJvbSgnPGI+SGVsbG8gd29ybGQ8L2I+JyksICdoZWxsby5odG1sJylcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBBIGZpbGVuYW1lIG1heSBhbHNvIGJlIHVzZWQ6XG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3QvdXBsb2FkJylcbiAqICAgLmF0dGFjaCgnZmlsZXMnLCAnaW1hZ2UuanBnJylcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEBwYXJhbSB7U3RyaW5nfGZzLlJlYWRTdHJlYW18QnVmZmVyfSBmaWxlXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbiAoZmllbGQsIGZpbGUsIG9wdGlvbnMpIHtcbiAgaWYgKGZpbGUpIHtcbiAgICBpZiAodGhpcy5fZGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwic3VwZXJhZ2VudCBjYW4ndCBtaXggLnNlbmQoKSBhbmQgLmF0dGFjaCgpXCIpO1xuICAgIH1cblxuICAgIGxldCBvID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvID0geyBmaWxlbmFtZTogb3B0aW9ucyB9O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICghby5maWxlbmFtZSkgby5maWxlbmFtZSA9IGZpbGU7XG4gICAgICBkZWJ1ZygnY3JlYXRpbmcgYGZzLlJlYWRTdHJlYW1gIGluc3RhbmNlIGZvciBmaWxlOiAlcycsIGZpbGUpO1xuICAgICAgZmlsZSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZSk7XG4gICAgfSBlbHNlIGlmICghby5maWxlbmFtZSAmJiBmaWxlLnBhdGgpIHtcbiAgICAgIG8uZmlsZW5hbWUgPSBmaWxlLnBhdGg7XG4gICAgfVxuXG4gICAgdGhpcy5fZ2V0Rm9ybURhdGEoKS5hcHBlbmQoZmllbGQsIGZpbGUsIG8pO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5fZ2V0Rm9ybURhdGEgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcy5fZm9ybURhdGEpIHtcbiAgICB0aGlzLl9mb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIHRoaXMuX2Zvcm1EYXRhLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgIGRlYnVnKCdGb3JtRGF0YSBlcnJvcicsIGVycik7XG4gICAgICBpZiAodGhpcy5jYWxsZWQpIHtcbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgaGFzIGFscmVhZHkgZmluaXNoZWQgYW5kIHRoZSBjYWxsYmFjayB3YXMgY2FsbGVkLlxuICAgICAgICAvLyBTaWxlbnRseSBpZ25vcmUgdGhlIGVycm9yLlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FsbGJhY2soZXJyKTtcbiAgICAgIHRoaXMuYWJvcnQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLl9mb3JtRGF0YTtcbn07XG5cbi8qKlxuICogR2V0cy9zZXRzIHRoZSBgQWdlbnRgIHRvIHVzZSBmb3IgdGhpcyBIVFRQIHJlcXVlc3QuIFRoZSBkZWZhdWx0IChpZiB0aGlzXG4gKiBmdW5jdGlvbiBpcyBub3QgY2FsbGVkKSBpcyB0byBvcHQgb3V0IG9mIGNvbm5lY3Rpb24gcG9vbGluZyAoYGFnZW50OiBmYWxzZWApLlxuICpcbiAqIEBwYXJhbSB7aHR0cC5BZ2VudH0gYWdlbnRcbiAqIEByZXR1cm4ge2h0dHAuQWdlbnR9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFnZW50ID0gZnVuY3Rpb24gKGFnZW50KSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5fYWdlbnQ7XG4gIHRoaXMuX2FnZW50ID0gYWdlbnQ7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgX0NvbnRlbnQtVHlwZV8gcmVzcG9uc2UgaGVhZGVyIHBhc3NlZCB0aHJvdWdoIGBtaW1lLmdldFR5cGUoKWAuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCd4bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ2pzb24nKVxuICogICAgICAgIC5zZW5kKGpzb25zdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuc2VuZChqc29uc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIHJldHVybiB0aGlzLnNldChcbiAgICAnQ29udGVudC1UeXBlJyxcbiAgICB0eXBlLmluY2x1ZGVzKCcvJykgPyB0eXBlIDogbWltZS5nZXRUeXBlKHR5cGUpXG4gICk7XG59O1xuXG4vKipcbiAqIFNldCBfQWNjZXB0XyByZXNwb25zZSBoZWFkZXIgcGFzc2VkIHRocm91Z2ggYG1pbWUuZ2V0VHlwZSgpYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMuanNvbiA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFjY2VwdFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIHJldHVybiB0aGlzLnNldCgnQWNjZXB0JywgdHlwZS5pbmNsdWRlcygnLycpID8gdHlwZSA6IG1pbWUuZ2V0VHlwZSh0eXBlKSk7XG59O1xuXG4vKipcbiAqIEFkZCBxdWVyeS1zdHJpbmcgYHZhbGAuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICByZXF1ZXN0LmdldCgnL3Nob2VzJylcbiAqICAgICAucXVlcnkoJ3NpemU9MTAnKVxuICogICAgIC5xdWVyeSh7IGNvbG9yOiAnYmx1ZScgfSlcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKHZhbCkge1xuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB0aGlzLl9xdWVyeS5wdXNoKHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnFzLCB2YWwpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFdyaXRlIHJhdyBgZGF0YWAgLyBgZW5jb2RpbmdgIHRvIHRoZSBzb2NrZXQuXG4gKlxuICogQHBhcmFtIHtCdWZmZXJ8U3RyaW5nfSBkYXRhXG4gKiBAcGFyYW0ge1N0cmluZ30gZW5jb2RpbmdcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKGRhdGEsIGVuY29kaW5nKSB7XG4gIGNvbnN0IHJlcSA9IHRoaXMucmVxdWVzdCgpO1xuICBpZiAoIXRoaXMuX3N0cmVhbVJlcXVlc3QpIHtcbiAgICB0aGlzLl9zdHJlYW1SZXF1ZXN0ID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiByZXEud3JpdGUoZGF0YSwgZW5jb2RpbmcpO1xufTtcblxuLyoqXG4gKiBQaXBlIHRoZSByZXF1ZXN0IGJvZHkgdG8gYHN0cmVhbWAuXG4gKlxuICogQHBhcmFtIHtTdHJlYW19IHN0cmVhbVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1N0cmVhbX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uIChzdHJlYW0sIG9wdGlvbnMpIHtcbiAgdGhpcy5waXBlZCA9IHRydWU7IC8vIEhBQ0suLi5cbiAgdGhpcy5idWZmZXIoZmFsc2UpO1xuICB0aGlzLmVuZCgpO1xuICByZXR1cm4gdGhpcy5fcGlwZUNvbnRpbnVlKHN0cmVhbSwgb3B0aW9ucyk7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5fcGlwZUNvbnRpbnVlID0gZnVuY3Rpb24gKHN0cmVhbSwgb3B0aW9ucykge1xuICB0aGlzLnJlcS5vbmNlKCdyZXNwb25zZScsIChyZXMpID0+IHtcbiAgICAvLyByZWRpcmVjdFxuICAgIGlmIChcbiAgICAgIGlzUmVkaXJlY3QocmVzLnN0YXR1c0NvZGUpICYmXG4gICAgICB0aGlzLl9yZWRpcmVjdHMrKyAhPT0gdGhpcy5fbWF4UmVkaXJlY3RzXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVkaXJlY3QocmVzKSA9PT0gdGhpc1xuICAgICAgICA/IHRoaXMuX3BpcGVDb250aW51ZShzdHJlYW0sIG9wdGlvbnMpXG4gICAgICAgIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRoaXMucmVzID0gcmVzO1xuICAgIHRoaXMuX2VtaXRSZXNwb25zZSgpO1xuICAgIGlmICh0aGlzLl9hYm9ydGVkKSByZXR1cm47XG5cbiAgICBpZiAodGhpcy5fc2hvdWxkVW56aXAocmVzKSkge1xuICAgICAgY29uc3QgdW56aXBPYmogPSB6bGliLmNyZWF0ZVVuemlwKCk7XG4gICAgICB1bnppcE9iai5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIgJiYgZXJyLmNvZGUgPT09ICdaX0JVRl9FUlJPUicpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIGVuZCBvZiBmaWxlIGlzIGlnbm9yZWQgYnkgYnJvd3NlcnMgYW5kIGN1cmxcbiAgICAgICAgICBzdHJlYW0uZW1pdCgnZW5kJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmVzLnBpcGUodW56aXBPYmopLnBpcGUoc3RyZWFtLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnBpcGUoc3RyZWFtLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXMub25jZSgnZW5kJywgKCkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdlbmQnKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBzdHJlYW07XG59O1xuXG4vKipcbiAqIEVuYWJsZSAvIGRpc2FibGUgYnVmZmVyaW5nLlxuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFt2YWxdXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYnVmZmVyID0gZnVuY3Rpb24gKHZhbCkge1xuICB0aGlzLl9idWZmZXIgPSB2YWwgIT09IGZhbHNlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVkaXJlY3QgdG8gYHVybFxuICpcbiAqIEBwYXJhbSB7SW5jb21pbmdNZXNzYWdlfSByZXNcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuX3JlZGlyZWN0ID0gZnVuY3Rpb24gKHJlcykge1xuICBsZXQgdXJsID0gcmVzLmhlYWRlcnMubG9jYXRpb247XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsbGJhY2sobmV3IEVycm9yKCdObyBsb2NhdGlvbiBoZWFkZXIgZm9yIHJlZGlyZWN0JyksIHJlcyk7XG4gIH1cblxuICBkZWJ1ZygncmVkaXJlY3QgJXMgLT4gJXMnLCB0aGlzLnVybCwgdXJsKTtcblxuICAvLyBsb2NhdGlvblxuICB1cmwgPSByZXNvbHZlKHRoaXMudXJsLCB1cmwpO1xuXG4gIC8vIGVuc3VyZSB0aGUgcmVzcG9uc2UgaXMgYmVpbmcgY29uc3VtZWRcbiAgLy8gdGhpcyBpcyByZXF1aXJlZCBmb3IgTm9kZSB2MC4xMCtcbiAgcmVzLnJlc3VtZSgpO1xuXG4gIGxldCBoZWFkZXJzID0gdGhpcy5yZXEuZ2V0SGVhZGVycyA/IHRoaXMucmVxLmdldEhlYWRlcnMoKSA6IHRoaXMucmVxLl9oZWFkZXJzO1xuXG4gIGNvbnN0IGNoYW5nZXNPcmlnaW4gPSBwYXJzZSh1cmwpLmhvc3QgIT09IHBhcnNlKHRoaXMudXJsKS5ob3N0O1xuXG4gIC8vIGltcGxlbWVudGF0aW9uIG9mIDMwMiBmb2xsb3dpbmcgZGVmYWN0byBzdGFuZGFyZFxuICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDMwMSB8fCByZXMuc3RhdHVzQ29kZSA9PT0gMzAyKSB7XG4gICAgLy8gc3RyaXAgQ29udGVudC0qIHJlbGF0ZWQgZmllbGRzXG4gICAgLy8gaW4gY2FzZSBvZiBQT1NUIGV0Y1xuICAgIGhlYWRlcnMgPSB1dGlscy5jbGVhbkhlYWRlcihoZWFkZXJzLCBjaGFuZ2VzT3JpZ2luKTtcblxuICAgIC8vIGZvcmNlIEdFVFxuICAgIHRoaXMubWV0aG9kID0gdGhpcy5tZXRob2QgPT09ICdIRUFEJyA/ICdIRUFEJyA6ICdHRVQnO1xuXG4gICAgLy8gY2xlYXIgZGF0YVxuICAgIHRoaXMuX2RhdGEgPSBudWxsO1xuICB9XG5cbiAgLy8gMzAzIGlzIGFsd2F5cyBHRVRcbiAgaWYgKHJlcy5zdGF0dXNDb2RlID09PSAzMDMpIHtcbiAgICAvLyBzdHJpcCBDb250ZW50LSogcmVsYXRlZCBmaWVsZHNcbiAgICAvLyBpbiBjYXNlIG9mIFBPU1QgZXRjXG4gICAgaGVhZGVycyA9IHV0aWxzLmNsZWFuSGVhZGVyKGhlYWRlcnMsIGNoYW5nZXNPcmlnaW4pO1xuXG4gICAgLy8gZm9yY2UgbWV0aG9kXG4gICAgdGhpcy5tZXRob2QgPSAnR0VUJztcblxuICAgIC8vIGNsZWFyIGRhdGFcbiAgICB0aGlzLl9kYXRhID0gbnVsbDtcbiAgfVxuXG4gIC8vIDMwNyBwcmVzZXJ2ZXMgbWV0aG9kXG4gIC8vIDMwOCBwcmVzZXJ2ZXMgbWV0aG9kXG4gIGRlbGV0ZSBoZWFkZXJzLmhvc3Q7XG5cbiAgZGVsZXRlIHRoaXMucmVxO1xuICBkZWxldGUgdGhpcy5fZm9ybURhdGE7XG5cbiAgLy8gcmVtb3ZlIGFsbCBhZGQgaGVhZGVyIGV4Y2VwdCBVc2VyLUFnZW50XG4gIF9pbml0SGVhZGVycyh0aGlzKTtcblxuICAvLyByZWRpcmVjdFxuICB0aGlzLl9lbmRDYWxsZWQgPSBmYWxzZTtcbiAgdGhpcy51cmwgPSB1cmw7XG4gIHRoaXMucXMgPSB7fTtcbiAgdGhpcy5fcXVlcnkubGVuZ3RoID0gMDtcbiAgdGhpcy5zZXQoaGVhZGVycyk7XG4gIHRoaXMuZW1pdCgncmVkaXJlY3QnLCByZXMpO1xuICB0aGlzLl9yZWRpcmVjdExpc3QucHVzaCh0aGlzLnVybCk7XG4gIHRoaXMuZW5kKHRoaXMuX2NhbGxiYWNrKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBdXRob3JpemF0aW9uIGZpZWxkIHZhbHVlIHdpdGggYHVzZXJgIGFuZCBgcGFzc2AuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAuYXV0aCgndG9iaScsICdsZWFybmJvb3N0JylcbiAqICAgLmF1dGgoJ3RvYmk6bGVhcm5ib29zdCcpXG4gKiAgIC5hdXRoKCd0b2JpJylcbiAqICAgLmF1dGgoYWNjZXNzVG9rZW4sIHsgdHlwZTogJ2JlYXJlcicgfSlcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlclxuICogQHBhcmFtIHtTdHJpbmd9IFtwYXNzXVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBvcHRpb25zIHdpdGggYXV0aG9yaXphdGlvbiB0eXBlICdiYXNpYycgb3IgJ2JlYXJlcicgKCdiYXNpYycgaXMgZGVmYXVsdClcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdXRoID0gZnVuY3Rpb24gKHVzZXIsIHBhc3MsIG9wdGlvbnMpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHBhc3MgPSAnJztcbiAgaWYgKHR5cGVvZiBwYXNzID09PSAnb2JqZWN0JyAmJiBwYXNzICE9PSBudWxsKSB7XG4gICAgLy8gcGFzcyBpcyBvcHRpb25hbCBhbmQgY2FuIGJlIHJlcGxhY2VkIHdpdGggb3B0aW9uc1xuICAgIG9wdGlvbnMgPSBwYXNzO1xuICAgIHBhc3MgPSAnJztcbiAgfVxuXG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7IHR5cGU6ICdiYXNpYycgfTtcbiAgfVxuXG4gIGNvbnN0IGVuY29kZXIgPSAoc3RyaW5nKSA9PiBCdWZmZXIuZnJvbShzdHJpbmcpLnRvU3RyaW5nKCdiYXNlNjQnKTtcblxuICByZXR1cm4gdGhpcy5fYXV0aCh1c2VyLCBwYXNzLCBvcHRpb25zLCBlbmNvZGVyKTtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBjZXJ0aWZpY2F0ZSBhdXRob3JpdHkgb3B0aW9uIGZvciBodHRwcyByZXF1ZXN0LlxuICpcbiAqIEBwYXJhbSB7QnVmZmVyIHwgQXJyYXl9IGNlcnRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jYSA9IGZ1bmN0aW9uIChjZXJ0KSB7XG4gIHRoaXMuX2NhID0gY2VydDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgY2xpZW50IGNlcnRpZmljYXRlIGtleSBvcHRpb24gZm9yIGh0dHBzIHJlcXVlc3QuXG4gKlxuICogQHBhcmFtIHtCdWZmZXIgfCBTdHJpbmd9IGNlcnRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5rZXkgPSBmdW5jdGlvbiAoY2VydCkge1xuICB0aGlzLl9rZXkgPSBjZXJ0O1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRoZSBrZXksIGNlcnRpZmljYXRlLCBhbmQgQ0EgY2VydHMgb2YgdGhlIGNsaWVudCBpbiBQRlggb3IgUEtDUzEyIGZvcm1hdC5cbiAqXG4gKiBAcGFyYW0ge0J1ZmZlciB8IFN0cmluZ30gY2VydFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnBmeCA9IGZ1bmN0aW9uIChjZXJ0KSB7XG4gIGlmICh0eXBlb2YgY2VydCA9PT0gJ29iamVjdCcgJiYgIUJ1ZmZlci5pc0J1ZmZlcihjZXJ0KSkge1xuICAgIHRoaXMuX3BmeCA9IGNlcnQucGZ4O1xuICAgIHRoaXMuX3Bhc3NwaHJhc2UgPSBjZXJ0LnBhc3NwaHJhc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fcGZ4ID0gY2VydDtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIGNsaWVudCBjZXJ0aWZpY2F0ZSBvcHRpb24gZm9yIGh0dHBzIHJlcXVlc3QuXG4gKlxuICogQHBhcmFtIHtCdWZmZXIgfCBTdHJpbmd9IGNlcnRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jZXJ0ID0gZnVuY3Rpb24gKGNlcnQpIHtcbiAgdGhpcy5fY2VydCA9IGNlcnQ7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBEbyBub3QgcmVqZWN0IGV4cGlyZWQgb3IgaW52YWxpZCBUTFMgY2VydHMuXG4gKiBzZXRzIGByZWplY3RVbmF1dGhvcml6ZWQ9dHJ1ZWAuIEJlIHdhcm5lZCB0aGF0IHRoaXMgYWxsb3dzIE1JVE0gYXR0YWNrcy5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZGlzYWJsZVRMU0NlcnRzID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9kaXNhYmxlVExTQ2VydHMgPSB0cnVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFuIGh0dHBbc10gcmVxdWVzdC5cbiAqXG4gKiBAcmV0dXJuIHtPdXRnb2luZ01lc3NhZ2V9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuUmVxdWVzdC5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMucmVxKSByZXR1cm4gdGhpcy5yZXE7XG5cbiAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcXVlcnkgPSBxcy5zdHJpbmdpZnkodGhpcy5xcywge1xuICAgICAgaW5kaWNlczogZmFsc2UsXG4gICAgICBzdHJpY3ROdWxsSGFuZGxpbmc6IHRydWVcbiAgICB9KTtcbiAgICBpZiAocXVlcnkpIHtcbiAgICAgIHRoaXMucXMgPSB7fTtcbiAgICAgIHRoaXMuX3F1ZXJ5LnB1c2gocXVlcnkpO1xuICAgIH1cblxuICAgIHRoaXMuX2ZpbmFsaXplUXVlcnlTdHJpbmcoKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xuICB9XG5cbiAgbGV0IHsgdXJsIH0gPSB0aGlzO1xuICBjb25zdCByZXRyaWVzID0gdGhpcy5fcmV0cmllcztcblxuICAvLyBDYXB0dXJlIGJhY2t0aWNrcyBhcy1pcyBmcm9tIHRoZSBmaW5hbCBxdWVyeSBzdHJpbmcgYnVpbHQgYWJvdmUuXG4gIC8vIE5vdGU6IHRoaXMnbGwgb25seSBmaW5kIGJhY2t0aWNrcyBlbnRlcmVkIGluIHJlcS5xdWVyeShTdHJpbmcpXG4gIC8vIGNhbGxzLCBiZWNhdXNlIHFzLnN0cmluZ2lmeSB1bmNvbmRpdGlvbmFsbHkgZW5jb2RlcyBiYWNrdGlja3MuXG4gIGxldCBxdWVyeVN0cmluZ0JhY2t0aWNrcztcbiAgaWYgKHVybC5pbmNsdWRlcygnYCcpKSB7XG4gICAgY29uc3QgcXVlcnlTdGFydEluZGV4ID0gdXJsLmluZGV4T2YoJz8nKTtcblxuICAgIGlmIChxdWVyeVN0YXJ0SW5kZXggIT09IC0xKSB7XG4gICAgICBjb25zdCBxdWVyeVN0cmluZyA9IHVybC5zbGljZShxdWVyeVN0YXJ0SW5kZXggKyAxKTtcbiAgICAgIHF1ZXJ5U3RyaW5nQmFja3RpY2tzID0gcXVlcnlTdHJpbmcubWF0Y2goL2B8JTYwL2cpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGRlZmF1bHQgdG8gaHR0cDovL1xuICBpZiAodXJsLmluZGV4T2YoJ2h0dHAnKSAhPT0gMCkgdXJsID0gYGh0dHA6Ly8ke3VybH1gO1xuICB1cmwgPSBwYXJzZSh1cmwpO1xuXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdmlzaW9ubWVkaWEvc3VwZXJhZ2VudC9pc3N1ZXMvMTM2N1xuICBpZiAocXVlcnlTdHJpbmdCYWNrdGlja3MpIHtcbiAgICBsZXQgaSA9IDA7XG4gICAgdXJsLnF1ZXJ5ID0gdXJsLnF1ZXJ5LnJlcGxhY2UoLyU2MC9nLCAoKSA9PiBxdWVyeVN0cmluZ0JhY2t0aWNrc1tpKytdKTtcbiAgICB1cmwuc2VhcmNoID0gYD8ke3VybC5xdWVyeX1gO1xuICAgIHVybC5wYXRoID0gdXJsLnBhdGhuYW1lICsgdXJsLnNlYXJjaDtcbiAgfVxuXG4gIC8vIHN1cHBvcnQgdW5peCBzb2NrZXRzXG4gIGlmICgvXmh0dHBzP1xcK3VuaXg6Ly50ZXN0KHVybC5wcm90b2NvbCkgPT09IHRydWUpIHtcbiAgICAvLyBnZXQgdGhlIHByb3RvY29sXG4gICAgdXJsLnByb3RvY29sID0gYCR7dXJsLnByb3RvY29sLnNwbGl0KCcrJylbMF19OmA7XG5cbiAgICAvLyBnZXQgdGhlIHNvY2tldCwgcGF0aFxuICAgIGNvbnN0IHVuaXhQYXJ0cyA9IHVybC5wYXRoLm1hdGNoKC9eKFteL10rKSguKykkLyk7XG4gICAgb3B0aW9ucy5zb2NrZXRQYXRoID0gdW5peFBhcnRzWzFdLnJlcGxhY2UoLyUyRi9nLCAnLycpO1xuICAgIHVybC5wYXRoID0gdW5peFBhcnRzWzJdO1xuICB9XG5cbiAgLy8gT3ZlcnJpZGUgSVAgYWRkcmVzcyBvZiBhIGhvc3RuYW1lXG4gIGlmICh0aGlzLl9jb25uZWN0T3ZlcnJpZGUpIHtcbiAgICBjb25zdCB7IGhvc3RuYW1lIH0gPSB1cmw7XG4gICAgY29uc3QgbWF0Y2ggPVxuICAgICAgaG9zdG5hbWUgaW4gdGhpcy5fY29ubmVjdE92ZXJyaWRlXG4gICAgICAgID8gdGhpcy5fY29ubmVjdE92ZXJyaWRlW2hvc3RuYW1lXVxuICAgICAgICA6IHRoaXMuX2Nvbm5lY3RPdmVycmlkZVsnKiddO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgLy8gYmFja3VwIHRoZSByZWFsIGhvc3RcbiAgICAgIGlmICghdGhpcy5faGVhZGVyLmhvc3QpIHtcbiAgICAgICAgdGhpcy5zZXQoJ2hvc3QnLCB1cmwuaG9zdCk7XG4gICAgICB9XG5cbiAgICAgIGxldCBuZXdIb3N0O1xuICAgICAgbGV0IG5ld1BvcnQ7XG5cbiAgICAgIGlmICh0eXBlb2YgbWF0Y2ggPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG5ld0hvc3QgPSBtYXRjaC5ob3N0O1xuICAgICAgICBuZXdQb3J0ID0gbWF0Y2gucG9ydDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0hvc3QgPSBtYXRjaDtcbiAgICAgICAgbmV3UG9ydCA9IHVybC5wb3J0O1xuICAgICAgfVxuXG4gICAgICAvLyB3cmFwIFtpcHY2XVxuICAgICAgdXJsLmhvc3QgPSAvOi8udGVzdChuZXdIb3N0KSA/IGBbJHtuZXdIb3N0fV1gIDogbmV3SG9zdDtcbiAgICAgIGlmIChuZXdQb3J0KSB7XG4gICAgICAgIHVybC5ob3N0ICs9IGA6JHtuZXdQb3J0fWA7XG4gICAgICAgIHVybC5wb3J0ID0gbmV3UG9ydDtcbiAgICAgIH1cblxuICAgICAgdXJsLmhvc3RuYW1lID0gbmV3SG9zdDtcbiAgICB9XG4gIH1cblxuICAvLyBvcHRpb25zXG4gIG9wdGlvbnMubWV0aG9kID0gdGhpcy5tZXRob2Q7XG4gIG9wdGlvbnMucG9ydCA9IHVybC5wb3J0O1xuICBvcHRpb25zLnBhdGggPSB1cmwucGF0aDtcbiAgb3B0aW9ucy5ob3N0ID0gdXJsLmhvc3RuYW1lO1xuICBvcHRpb25zLmNhID0gdGhpcy5fY2E7XG4gIG9wdGlvbnMua2V5ID0gdGhpcy5fa2V5O1xuICBvcHRpb25zLnBmeCA9IHRoaXMuX3BmeDtcbiAgb3B0aW9ucy5jZXJ0ID0gdGhpcy5fY2VydDtcbiAgb3B0aW9ucy5wYXNzcGhyYXNlID0gdGhpcy5fcGFzc3BocmFzZTtcbiAgb3B0aW9ucy5hZ2VudCA9IHRoaXMuX2FnZW50O1xuICBvcHRpb25zLnJlamVjdFVuYXV0aG9yaXplZCA9XG4gICAgdHlwZW9mIHRoaXMuX2Rpc2FibGVUTFNDZXJ0cyA9PT0gJ2Jvb2xlYW4nXG4gICAgICA/ICF0aGlzLl9kaXNhYmxlVExTQ2VydHNcbiAgICAgIDogcHJvY2Vzcy5lbnYuTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRCAhPT0gJzAnO1xuXG4gIC8vIEFsbG93cyByZXF1ZXN0LmdldCgnaHR0cHM6Ly8xLjIuMy40LycpLnNldCgnSG9zdCcsICdleGFtcGxlLmNvbScpXG4gIGlmICh0aGlzLl9oZWFkZXIuaG9zdCkge1xuICAgIG9wdGlvbnMuc2VydmVybmFtZSA9IHRoaXMuX2hlYWRlci5ob3N0LnJlcGxhY2UoLzpcXGQrJC8sICcnKTtcbiAgfVxuXG4gIGlmIChcbiAgICB0aGlzLl90cnVzdExvY2FsaG9zdCAmJlxuICAgIC9eKD86bG9jYWxob3N0fDEyN1xcLjBcXC4wXFwuXFxkK3woMCo6KSs6MCoxKSQvLnRlc3QodXJsLmhvc3RuYW1lKVxuICApIHtcbiAgICBvcHRpb25zLnJlamVjdFVuYXV0aG9yaXplZCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gaW5pdGlhdGUgcmVxdWVzdFxuICBjb25zdCBtb2QgPSB0aGlzLl9lbmFibGVIdHRwMlxuICAgID8gZXhwb3J0cy5wcm90b2NvbHNbJ2h0dHAyOiddLnNldFByb3RvY29sKHVybC5wcm90b2NvbClcbiAgICA6IGV4cG9ydHMucHJvdG9jb2xzW3VybC5wcm90b2NvbF07XG5cbiAgLy8gcmVxdWVzdFxuICB0aGlzLnJlcSA9IG1vZC5yZXF1ZXN0KG9wdGlvbnMpO1xuICBjb25zdCB7IHJlcSB9ID0gdGhpcztcblxuICAvLyBzZXQgdGNwIG5vIGRlbGF5XG4gIHJlcS5zZXROb0RlbGF5KHRydWUpO1xuXG4gIGlmIChvcHRpb25zLm1ldGhvZCAhPT0gJ0hFQUQnKSB7XG4gICAgcmVxLnNldEhlYWRlcignQWNjZXB0LUVuY29kaW5nJywgJ2d6aXAsIGRlZmxhdGUnKTtcbiAgfVxuXG4gIHRoaXMucHJvdG9jb2wgPSB1cmwucHJvdG9jb2w7XG4gIHRoaXMuaG9zdCA9IHVybC5ob3N0O1xuXG4gIC8vIGV4cG9zZSBldmVudHNcbiAgcmVxLm9uY2UoJ2RyYWluJywgKCkgPT4ge1xuICAgIHRoaXMuZW1pdCgnZHJhaW4nKTtcbiAgfSk7XG5cbiAgcmVxLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAvLyBmbGFnIGFib3J0aW9uIGhlcmUgZm9yIG91dCB0aW1lb3V0c1xuICAgIC8vIGJlY2F1c2Ugbm9kZSB3aWxsIGVtaXQgYSBmYXV4LWVycm9yIFwic29ja2V0IGhhbmcgdXBcIlxuICAgIC8vIHdoZW4gcmVxdWVzdCBpcyBhYm9ydGVkIGJlZm9yZSBhIGNvbm5lY3Rpb24gaXMgbWFkZVxuICAgIGlmICh0aGlzLl9hYm9ydGVkKSByZXR1cm47XG4gICAgLy8gaWYgbm90IHRoZSBzYW1lLCB3ZSBhcmUgaW4gdGhlICoqb2xkKiogKGNhbmNlbGxlZCkgcmVxdWVzdCxcbiAgICAvLyBzbyBuZWVkIHRvIGNvbnRpbnVlIChzYW1lIGFzIGZvciBhYm92ZSlcbiAgICBpZiAodGhpcy5fcmV0cmllcyAhPT0gcmV0cmllcykgcmV0dXJuO1xuICAgIC8vIGlmIHdlJ3ZlIHJlY2VpdmVkIGEgcmVzcG9uc2UgdGhlbiB3ZSBkb24ndCB3YW50IHRvIGxldFxuICAgIC8vIGFuIGVycm9yIGluIHRoZSByZXF1ZXN0IGJsb3cgdXAgdGhlIHJlc3BvbnNlXG4gICAgaWYgKHRoaXMucmVzcG9uc2UpIHJldHVybjtcbiAgICB0aGlzLmNhbGxiYWNrKGVycik7XG4gIH0pO1xuXG4gIC8vIGF1dGhcbiAgaWYgKHVybC5hdXRoKSB7XG4gICAgY29uc3QgYXV0aCA9IHVybC5hdXRoLnNwbGl0KCc6Jyk7XG4gICAgdGhpcy5hdXRoKGF1dGhbMF0sIGF1dGhbMV0pO1xuICB9XG5cbiAgaWYgKHRoaXMudXNlcm5hbWUgJiYgdGhpcy5wYXNzd29yZCkge1xuICAgIHRoaXMuYXV0aCh0aGlzLnVzZXJuYW1lLCB0aGlzLnBhc3N3b3JkKTtcbiAgfVxuXG4gIGZvciAoY29uc3Qga2V5IGluIHRoaXMuaGVhZGVyKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLmhlYWRlciwga2V5KSlcbiAgICAgIHJlcS5zZXRIZWFkZXIoa2V5LCB0aGlzLmhlYWRlcltrZXldKTtcbiAgfVxuXG4gIC8vIGFkZCBjb29raWVzXG4gIGlmICh0aGlzLmNvb2tpZXMpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuX2hlYWRlciwgJ2Nvb2tpZScpKSB7XG4gICAgICAvLyBtZXJnZVxuICAgICAgY29uc3QgdG1wSmFyID0gbmV3IENvb2tpZUphci5Db29raWVKYXIoKTtcbiAgICAgIHRtcEphci5zZXRDb29raWVzKHRoaXMuX2hlYWRlci5jb29raWUuc3BsaXQoJzsnKSk7XG4gICAgICB0bXBKYXIuc2V0Q29va2llcyh0aGlzLmNvb2tpZXMuc3BsaXQoJzsnKSk7XG4gICAgICByZXEuc2V0SGVhZGVyKFxuICAgICAgICAnQ29va2llJyxcbiAgICAgICAgdG1wSmFyLmdldENvb2tpZXMoQ29va2llSmFyLkNvb2tpZUFjY2Vzc0luZm8uQWxsKS50b1ZhbHVlU3RyaW5nKClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcS5zZXRIZWFkZXIoJ0Nvb2tpZScsIHRoaXMuY29va2llcyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogSW52b2tlIHRoZSBjYWxsYmFjayB3aXRoIGBlcnJgIGFuZCBgcmVzYFxuICogYW5kIGhhbmRsZSBhcml0eSBjaGVjay5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2FsbGJhY2sgPSBmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgaWYgKHRoaXMuX3Nob3VsZFJldHJ5KGVyciwgcmVzKSkge1xuICAgIHJldHVybiB0aGlzLl9yZXRyeSgpO1xuICB9XG5cbiAgLy8gQXZvaWQgdGhlIGVycm9yIHdoaWNoIGlzIGVtaXR0ZWQgZnJvbSAnc29ja2V0IGhhbmcgdXAnIHRvIGNhdXNlIHRoZSBmbiB1bmRlZmluZWQgZXJyb3Igb24gSlMgcnVudGltZS5cbiAgY29uc3QgZm4gPSB0aGlzLl9jYWxsYmFjayB8fCBub29wO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICBpZiAodGhpcy5jYWxsZWQpIHJldHVybiBjb25zb2xlLndhcm4oJ3N1cGVyYWdlbnQ6IGRvdWJsZSBjYWxsYmFjayBidWcnKTtcbiAgdGhpcy5jYWxsZWQgPSB0cnVlO1xuXG4gIGlmICghZXJyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghdGhpcy5faXNSZXNwb25zZU9LKHJlcykpIHtcbiAgICAgICAgbGV0IG1zZyA9ICdVbnN1Y2Nlc3NmdWwgSFRUUCByZXNwb25zZSc7XG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICBtc2cgPSBodHRwLlNUQVRVU19DT0RFU1tyZXMuc3RhdHVzXSB8fCBtc2c7XG4gICAgICAgIH1cblxuICAgICAgICBlcnIgPSBuZXcgRXJyb3IobXNnKTtcbiAgICAgICAgZXJyLnN0YXR1cyA9IHJlcyA/IHJlcy5zdGF0dXMgOiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyXykge1xuICAgICAgZXJyID0gZXJyXztcbiAgICB9XG4gIH1cblxuICAvLyBJdCdzIGltcG9ydGFudCB0aGF0IHRoZSBjYWxsYmFjayBpcyBjYWxsZWQgb3V0c2lkZSB0cnkvY2F0Y2hcbiAgLy8gdG8gYXZvaWQgZG91YmxlIGNhbGxiYWNrXG4gIGlmICghZXJyKSB7XG4gICAgcmV0dXJuIGZuKG51bGwsIHJlcyk7XG4gIH1cblxuICBlcnIucmVzcG9uc2UgPSByZXM7XG4gIGlmICh0aGlzLl9tYXhSZXRyaWVzKSBlcnIucmV0cmllcyA9IHRoaXMuX3JldHJpZXMgLSAxO1xuXG4gIC8vIG9ubHkgZW1pdCBlcnJvciBldmVudCBpZiB0aGVyZSBpcyBhIGxpc3RlbmVyXG4gIC8vIG90aGVyd2lzZSB3ZSBhc3N1bWUgdGhlIGNhbGxiYWNrIHRvIGAuZW5kKClgIHdpbGwgZ2V0IHRoZSBlcnJvclxuICBpZiAoZXJyICYmIHRoaXMubGlzdGVuZXJzKCdlcnJvcicpLmxlbmd0aCA+IDApIHtcbiAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgfVxuXG4gIGZuKGVyciwgcmVzKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYSBob3N0IG9iamVjdCxcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIGhvc3Qgb2JqZWN0XG4gKiBAcmV0dXJuIHtCb29sZWFufSBpcyBhIGhvc3Qgb2JqZWN0XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuUmVxdWVzdC5wcm90b3R5cGUuX2lzSG9zdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIChcbiAgICBCdWZmZXIuaXNCdWZmZXIob2JqKSB8fCBvYmogaW5zdGFuY2VvZiBTdHJlYW0gfHwgb2JqIGluc3RhbmNlb2YgRm9ybURhdGFcbiAgKTtcbn07XG5cbi8qKlxuICogSW5pdGlhdGUgcmVxdWVzdCwgaW52b2tpbmcgY2FsbGJhY2sgYGZuKGVyciwgcmVzKWBcbiAqIHdpdGggYW4gaW5zdGFuY2VvZiBgUmVzcG9uc2VgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuX2VtaXRSZXNwb25zZSA9IGZ1bmN0aW9uIChib2R5LCBmaWxlcykge1xuICBjb25zdCByZXNwb25zZSA9IG5ldyBSZXNwb25zZSh0aGlzKTtcbiAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICByZXNwb25zZS5yZWRpcmVjdHMgPSB0aGlzLl9yZWRpcmVjdExpc3Q7XG4gIGlmICh1bmRlZmluZWQgIT09IGJvZHkpIHtcbiAgICByZXNwb25zZS5ib2R5ID0gYm9keTtcbiAgfVxuXG4gIHJlc3BvbnNlLmZpbGVzID0gZmlsZXM7XG4gIGlmICh0aGlzLl9lbmRDYWxsZWQpIHtcbiAgICByZXNwb25zZS5waXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcImVuZCgpIGhhcyBhbHJlYWR5IGJlZW4gY2FsbGVkLCBzbyBpdCdzIHRvbyBsYXRlIHRvIHN0YXJ0IHBpcGluZ1wiXG4gICAgICApO1xuICAgIH07XG4gIH1cblxuICB0aGlzLmVtaXQoJ3Jlc3BvbnNlJywgcmVzcG9uc2UpO1xuICByZXR1cm4gcmVzcG9uc2U7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAoZm4pIHtcbiAgdGhpcy5yZXF1ZXN0KCk7XG4gIGRlYnVnKCclcyAlcycsIHRoaXMubWV0aG9kLCB0aGlzLnVybCk7XG5cbiAgaWYgKHRoaXMuX2VuZENhbGxlZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICcuZW5kKCkgd2FzIGNhbGxlZCB0d2ljZS4gVGhpcyBpcyBub3Qgc3VwcG9ydGVkIGluIHN1cGVyYWdlbnQnXG4gICAgKTtcbiAgfVxuXG4gIHRoaXMuX2VuZENhbGxlZCA9IHRydWU7XG5cbiAgLy8gc3RvcmUgY2FsbGJhY2tcbiAgdGhpcy5fY2FsbGJhY2sgPSBmbiB8fCBub29wO1xuXG4gIHRoaXMuX2VuZCgpO1xufTtcblxuUmVxdWVzdC5wcm90b3R5cGUuX2VuZCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuX2Fib3J0ZWQpXG4gICAgcmV0dXJuIHRoaXMuY2FsbGJhY2soXG4gICAgICBuZXcgRXJyb3IoJ1RoZSByZXF1ZXN0IGhhcyBiZWVuIGFib3J0ZWQgZXZlbiBiZWZvcmUgLmVuZCgpIHdhcyBjYWxsZWQnKVxuICAgICk7XG5cbiAgbGV0IGRhdGEgPSB0aGlzLl9kYXRhO1xuICBjb25zdCB7IHJlcSB9ID0gdGhpcztcbiAgY29uc3QgeyBtZXRob2QgfSA9IHRoaXM7XG5cbiAgdGhpcy5fc2V0VGltZW91dHMoKTtcblxuICAvLyBib2R5XG4gIGlmIChtZXRob2QgIT09ICdIRUFEJyAmJiAhcmVxLl9oZWFkZXJTZW50KSB7XG4gICAgLy8gc2VyaWFsaXplIHN0dWZmXG4gICAgaWYgKHR5cGVvZiBkYXRhICE9PSAnc3RyaW5nJykge1xuICAgICAgbGV0IGNvbnRlbnRUeXBlID0gcmVxLmdldEhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgICAvLyBQYXJzZSBvdXQganVzdCB0aGUgY29udGVudCB0eXBlIGZyb20gdGhlIGhlYWRlciAoaWdub3JlIHRoZSBjaGFyc2V0KVxuICAgICAgaWYgKGNvbnRlbnRUeXBlKSBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlLnNwbGl0KCc7JylbMF07XG4gICAgICBsZXQgc2VyaWFsaXplID0gdGhpcy5fc2VyaWFsaXplciB8fCBleHBvcnRzLnNlcmlhbGl6ZVtjb250ZW50VHlwZV07XG4gICAgICBpZiAoIXNlcmlhbGl6ZSAmJiBpc0pTT04oY29udGVudFR5cGUpKSB7XG4gICAgICAgIHNlcmlhbGl6ZSA9IGV4cG9ydHMuc2VyaWFsaXplWydhcHBsaWNhdGlvbi9qc29uJ107XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXJpYWxpemUpIGRhdGEgPSBzZXJpYWxpemUoZGF0YSk7XG4gICAgfVxuXG4gICAgLy8gY29udGVudC1sZW5ndGhcbiAgICBpZiAoZGF0YSAmJiAhcmVxLmdldEhlYWRlcignQ29udGVudC1MZW5ndGgnKSkge1xuICAgICAgcmVxLnNldEhlYWRlcihcbiAgICAgICAgJ0NvbnRlbnQtTGVuZ3RoJyxcbiAgICAgICAgQnVmZmVyLmlzQnVmZmVyKGRhdGEpID8gZGF0YS5sZW5ndGggOiBCdWZmZXIuYnl0ZUxlbmd0aChkYXRhKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvLyByZXNwb25zZVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuICByZXEub25jZSgncmVzcG9uc2UnLCAocmVzKSA9PiB7XG4gICAgZGVidWcoJyVzICVzIC0+ICVzJywgdGhpcy5tZXRob2QsIHRoaXMudXJsLCByZXMuc3RhdHVzQ29kZSk7XG5cbiAgICBpZiAodGhpcy5fcmVzcG9uc2VUaW1lb3V0VGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZXNwb25zZVRpbWVvdXRUaW1lcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGlwZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtYXggPSB0aGlzLl9tYXhSZWRpcmVjdHM7XG4gICAgY29uc3QgbWltZSA9IHV0aWxzLnR5cGUocmVzLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddIHx8ICcnKSB8fCAndGV4dC9wbGFpbic7XG4gICAgbGV0IHR5cGUgPSBtaW1lLnNwbGl0KCcvJylbMF07XG4gICAgaWYgKHR5cGUpIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgIGNvbnN0IG11bHRpcGFydCA9IHR5cGUgPT09ICdtdWx0aXBhcnQnO1xuICAgIGNvbnN0IHJlZGlyZWN0ID0gaXNSZWRpcmVjdChyZXMuc3RhdHVzQ29kZSk7XG4gICAgY29uc3QgcmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlO1xuXG4gICAgdGhpcy5yZXMgPSByZXM7XG5cbiAgICAvLyByZWRpcmVjdFxuICAgIGlmIChyZWRpcmVjdCAmJiB0aGlzLl9yZWRpcmVjdHMrKyAhPT0gbWF4KSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVkaXJlY3QocmVzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tZXRob2QgPT09ICdIRUFEJykge1xuICAgICAgdGhpcy5lbWl0KCdlbmQnKTtcbiAgICAgIHRoaXMuY2FsbGJhY2sobnVsbCwgdGhpcy5fZW1pdFJlc3BvbnNlKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHpsaWIgc3VwcG9ydFxuICAgIGlmICh0aGlzLl9zaG91bGRVbnppcChyZXMpKSB7XG4gICAgICB1bnppcChyZXEsIHJlcyk7XG4gICAgfVxuXG4gICAgbGV0IGJ1ZmZlciA9IHRoaXMuX2J1ZmZlcjtcbiAgICBpZiAoYnVmZmVyID09PSB1bmRlZmluZWQgJiYgbWltZSBpbiBleHBvcnRzLmJ1ZmZlcikge1xuICAgICAgYnVmZmVyID0gQm9vbGVhbihleHBvcnRzLmJ1ZmZlclttaW1lXSk7XG4gICAgfVxuXG4gICAgbGV0IHBhcnNlciA9IHRoaXMuX3BhcnNlcjtcbiAgICBpZiAodW5kZWZpbmVkID09PSBidWZmZXIpIHtcbiAgICAgIGlmIChwYXJzZXIpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIFwiQSBjdXN0b20gc3VwZXJhZ2VudCBwYXJzZXIgaGFzIGJlZW4gc2V0LCBidXQgYnVmZmVyaW5nIHN0cmF0ZWd5IGZvciB0aGUgcGFyc2VyIGhhc24ndCBiZWVuIGNvbmZpZ3VyZWQuIENhbGwgYHJlcS5idWZmZXIodHJ1ZSBvciBmYWxzZSlgIG9yIHNldCBgc3VwZXJhZ2VudC5idWZmZXJbbWltZV0gPSB0cnVlIG9yIGZhbHNlYFwiXG4gICAgICAgICk7XG4gICAgICAgIGJ1ZmZlciA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwYXJzZXIpIHtcbiAgICAgIGlmIChyZXNwb25zZVR5cGUpIHtcbiAgICAgICAgcGFyc2VyID0gZXhwb3J0cy5wYXJzZS5pbWFnZTsgLy8gSXQncyBhY3R1YWxseSBhIGdlbmVyaWMgQnVmZmVyXG4gICAgICAgIGJ1ZmZlciA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKG11bHRpcGFydCkge1xuICAgICAgICBjb25zdCBmb3JtID0gbmV3IGZvcm1pZGFibGUuSW5jb21pbmdGb3JtKCk7XG4gICAgICAgIHBhcnNlciA9IGZvcm0ucGFyc2UuYmluZChmb3JtKTtcbiAgICAgICAgYnVmZmVyID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoaXNJbWFnZU9yVmlkZW8obWltZSkpIHtcbiAgICAgICAgcGFyc2VyID0gZXhwb3J0cy5wYXJzZS5pbWFnZTtcbiAgICAgICAgYnVmZmVyID0gdHJ1ZTsgLy8gRm9yIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGJ1ZmZlcmluZyBkZWZhdWx0IGlzIGFkLWhvYyBNSU1FLWRlcGVuZGVudFxuICAgICAgfSBlbHNlIGlmIChleHBvcnRzLnBhcnNlW21pbWVdKSB7XG4gICAgICAgIHBhcnNlciA9IGV4cG9ydHMucGFyc2VbbWltZV07XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICBwYXJzZXIgPSBleHBvcnRzLnBhcnNlLnRleHQ7XG4gICAgICAgIGJ1ZmZlciA9IGJ1ZmZlciAhPT0gZmFsc2U7XG5cbiAgICAgICAgLy8gZXZlcnlvbmUgd2FudHMgdGhlaXIgb3duIHdoaXRlLWxhYmVsZWQganNvblxuICAgICAgfSBlbHNlIGlmIChpc0pTT04obWltZSkpIHtcbiAgICAgICAgcGFyc2VyID0gZXhwb3J0cy5wYXJzZVsnYXBwbGljYXRpb24vanNvbiddO1xuICAgICAgICBidWZmZXIgPSBidWZmZXIgIT09IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChidWZmZXIpIHtcbiAgICAgICAgcGFyc2VyID0gZXhwb3J0cy5wYXJzZS50ZXh0O1xuICAgICAgfSBlbHNlIGlmICh1bmRlZmluZWQgPT09IGJ1ZmZlcikge1xuICAgICAgICBwYXJzZXIgPSBleHBvcnRzLnBhcnNlLmltYWdlOyAvLyBJdCdzIGFjdHVhbGx5IGEgZ2VuZXJpYyBCdWZmZXJcbiAgICAgICAgYnVmZmVyID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBieSBkZWZhdWx0IG9ubHkgYnVmZmVyIHRleHQvKiwganNvbiBhbmQgbWVzc2VkIHVwIHRoaW5nIGZyb20gaGVsbFxuICAgIGlmICgodW5kZWZpbmVkID09PSBidWZmZXIgJiYgaXNUZXh0KG1pbWUpKSB8fCBpc0pTT04obWltZSkpIHtcbiAgICAgIGJ1ZmZlciA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVzQnVmZmVyZWQgPSBidWZmZXI7XG4gICAgbGV0IHBhcnNlckhhbmRsZXNFbmQgPSBmYWxzZTtcbiAgICBpZiAoYnVmZmVyKSB7XG4gICAgICAvLyBQcm90ZWN0aW9uYSBhZ2FpbnN0IHppcCBib21icyBhbmQgb3RoZXIgbnVpc2FuY2VcbiAgICAgIGxldCByZXNwb25zZUJ5dGVzTGVmdCA9IHRoaXMuX21heFJlc3BvbnNlU2l6ZSB8fCAyMDAwMDAwMDA7XG4gICAgICByZXMub24oJ2RhdGEnLCAoYnVmKSA9PiB7XG4gICAgICAgIHJlc3BvbnNlQnl0ZXNMZWZ0IC09IGJ1Zi5ieXRlTGVuZ3RoIHx8IGJ1Zi5sZW5ndGg7XG4gICAgICAgIGlmIChyZXNwb25zZUJ5dGVzTGVmdCA8IDApIHtcbiAgICAgICAgICAvLyBUaGlzIHdpbGwgcHJvcGFnYXRlIHRocm91Z2ggZXJyb3IgZXZlbnRcbiAgICAgICAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoJ01heGltdW0gcmVzcG9uc2Ugc2l6ZSByZWFjaGVkJyk7XG4gICAgICAgICAgZXJyLmNvZGUgPSAnRVRPT0xBUkdFJztcbiAgICAgICAgICAvLyBQYXJzZXJzIGFyZW4ndCByZXF1aXJlZCB0byBvYnNlcnZlIGVycm9yIGV2ZW50LFxuICAgICAgICAgIC8vIHNvIHdvdWxkIGluY29ycmVjdGx5IHJlcG9ydCBzdWNjZXNzXG4gICAgICAgICAgcGFyc2VySGFuZGxlc0VuZCA9IGZhbHNlO1xuICAgICAgICAgIC8vIFdpbGwgZW1pdCBlcnJvciBldmVudFxuICAgICAgICAgIHJlcy5kZXN0cm95KGVycik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChwYXJzZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFVuYnVmZmVyZWQgcGFyc2VycyBhcmUgc3VwcG9zZWQgdG8gZW1pdCByZXNwb25zZSBlYXJseSxcbiAgICAgICAgLy8gd2hpY2ggaXMgd2VpcmQgQlRXLCBiZWNhdXNlIHJlc3BvbnNlLmJvZHkgd29uJ3QgYmUgdGhlcmUuXG4gICAgICAgIHBhcnNlckhhbmRsZXNFbmQgPSBidWZmZXI7XG5cbiAgICAgICAgcGFyc2VyKHJlcywgKGVyciwgb2JqLCBmaWxlcykgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnRpbWVkb3V0KSB7XG4gICAgICAgICAgICAvLyBUaW1lb3V0IGhhcyBhbHJlYWR5IGhhbmRsZWQgYWxsIGNhbGxiYWNrc1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEludGVudGlvbmFsIChub24tdGltZW91dCkgYWJvcnQgaXMgc3VwcG9zZWQgdG8gcHJlc2VydmUgcGFydGlhbCByZXNwb25zZSxcbiAgICAgICAgICAvLyBldmVuIGlmIGl0IGRvZXNuJ3QgcGFyc2UuXG4gICAgICAgICAgaWYgKGVyciAmJiAhdGhpcy5fYWJvcnRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocGFyc2VySGFuZGxlc0VuZCkge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdlbmQnKTtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sobnVsbCwgdGhpcy5fZW1pdFJlc3BvbnNlKG9iaiwgZmlsZXMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2soZXJyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmVzID0gcmVzO1xuXG4gICAgLy8gdW5idWZmZXJlZFxuICAgIGlmICghYnVmZmVyKSB7XG4gICAgICBkZWJ1ZygndW5idWZmZXJlZCAlcyAlcycsIHRoaXMubWV0aG9kLCB0aGlzLnVybCk7XG4gICAgICB0aGlzLmNhbGxiYWNrKG51bGwsIHRoaXMuX2VtaXRSZXNwb25zZSgpKTtcbiAgICAgIGlmIChtdWx0aXBhcnQpIHJldHVybjsgLy8gYWxsb3cgbXVsdGlwYXJ0IHRvIGhhbmRsZSBlbmQgZXZlbnRcbiAgICAgIHJlcy5vbmNlKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgIGRlYnVnKCdlbmQgJXMgJXMnLCB0aGlzLm1ldGhvZCwgdGhpcy51cmwpO1xuICAgICAgICB0aGlzLmVtaXQoJ2VuZCcpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdGVybWluYXRpbmcgZXZlbnRzXG4gICAgcmVzLm9uY2UoJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgcGFyc2VySGFuZGxlc0VuZCA9IGZhbHNlO1xuICAgICAgdGhpcy5jYWxsYmFjayhlcnIsIG51bGwpO1xuICAgIH0pO1xuICAgIGlmICghcGFyc2VySGFuZGxlc0VuZClcbiAgICAgIHJlcy5vbmNlKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgIGRlYnVnKCdlbmQgJXMgJXMnLCB0aGlzLm1ldGhvZCwgdGhpcy51cmwpO1xuICAgICAgICAvLyBUT0RPOiB1bmxlc3MgYnVmZmVyaW5nIGVtaXQgZWFybGllciB0byBzdHJlYW1cbiAgICAgICAgdGhpcy5lbWl0KCdlbmQnKTtcbiAgICAgICAgdGhpcy5jYWxsYmFjayhudWxsLCB0aGlzLl9lbWl0UmVzcG9uc2UoKSk7XG4gICAgICB9KTtcbiAgfSk7XG5cbiAgdGhpcy5lbWl0KCdyZXF1ZXN0JywgdGhpcyk7XG5cbiAgY29uc3QgZ2V0UHJvZ3Jlc3NNb25pdG9yID0gKCkgPT4ge1xuICAgIGNvbnN0IGxlbmd0aENvbXB1dGFibGUgPSB0cnVlO1xuICAgIGNvbnN0IHRvdGFsID0gcmVxLmdldEhlYWRlcignQ29udGVudC1MZW5ndGgnKTtcbiAgICBsZXQgbG9hZGVkID0gMDtcblxuICAgIGNvbnN0IHByb2dyZXNzID0gbmV3IFN0cmVhbS5UcmFuc2Zvcm0oKTtcbiAgICBwcm9ncmVzcy5fdHJhbnNmb3JtID0gKGNodW5rLCBlbmNvZGluZywgY2IpID0+IHtcbiAgICAgIGxvYWRlZCArPSBjaHVuay5sZW5ndGg7XG4gICAgICB0aGlzLmVtaXQoJ3Byb2dyZXNzJywge1xuICAgICAgICBkaXJlY3Rpb246ICd1cGxvYWQnLFxuICAgICAgICBsZW5ndGhDb21wdXRhYmxlLFxuICAgICAgICBsb2FkZWQsXG4gICAgICAgIHRvdGFsXG4gICAgICB9KTtcbiAgICAgIGNiKG51bGwsIGNodW5rKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHByb2dyZXNzO1xuICB9O1xuXG4gIGNvbnN0IGJ1ZmZlclRvQ2h1bmtzID0gKGJ1ZmZlcikgPT4ge1xuICAgIGNvbnN0IGNodW5rU2l6ZSA9IDE2ICogMTAyNDsgLy8gZGVmYXVsdCBoaWdoV2F0ZXJNYXJrIHZhbHVlXG4gICAgY29uc3QgY2h1bmtpbmcgPSBuZXcgU3RyZWFtLlJlYWRhYmxlKCk7XG4gICAgY29uc3QgdG90YWxMZW5ndGggPSBidWZmZXIubGVuZ3RoO1xuICAgIGNvbnN0IHJlbWFpbmRlciA9IHRvdGFsTGVuZ3RoICUgY2h1bmtTaXplO1xuICAgIGNvbnN0IGN1dG9mZiA9IHRvdGFsTGVuZ3RoIC0gcmVtYWluZGVyO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXRvZmY7IGkgKz0gY2h1bmtTaXplKSB7XG4gICAgICBjb25zdCBjaHVuayA9IGJ1ZmZlci5zbGljZShpLCBpICsgY2h1bmtTaXplKTtcbiAgICAgIGNodW5raW5nLnB1c2goY2h1bmspO1xuICAgIH1cblxuICAgIGlmIChyZW1haW5kZXIgPiAwKSB7XG4gICAgICBjb25zdCByZW1haW5kZXJCdWZmZXIgPSBidWZmZXIuc2xpY2UoLXJlbWFpbmRlcik7XG4gICAgICBjaHVua2luZy5wdXNoKHJlbWFpbmRlckJ1ZmZlcik7XG4gICAgfVxuXG4gICAgY2h1bmtpbmcucHVzaChudWxsKTsgLy8gbm8gbW9yZSBkYXRhXG5cbiAgICByZXR1cm4gY2h1bmtpbmc7XG4gIH07XG5cbiAgLy8gaWYgYSBGb3JtRGF0YSBpbnN0YW5jZSBnb3QgY3JlYXRlZCwgdGhlbiB3ZSBzZW5kIHRoYXQgYXMgdGhlIHJlcXVlc3QgYm9keVxuICBjb25zdCBmb3JtRGF0YSA9IHRoaXMuX2Zvcm1EYXRhO1xuICBpZiAoZm9ybURhdGEpIHtcbiAgICAvLyBzZXQgaGVhZGVyc1xuICAgIGNvbnN0IGhlYWRlcnMgPSBmb3JtRGF0YS5nZXRIZWFkZXJzKCk7XG4gICAgZm9yIChjb25zdCBpIGluIGhlYWRlcnMpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaGVhZGVycywgaSkpIHtcbiAgICAgICAgZGVidWcoJ3NldHRpbmcgRm9ybURhdGEgaGVhZGVyOiBcIiVzOiAlc1wiJywgaSwgaGVhZGVyc1tpXSk7XG4gICAgICAgIHJlcS5zZXRIZWFkZXIoaSwgaGVhZGVyc1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYXR0ZW1wdCB0byBnZXQgXCJDb250ZW50LUxlbmd0aFwiIGhlYWRlclxuICAgIGZvcm1EYXRhLmdldExlbmd0aCgoZXJyLCBsZW5ndGgpID0+IHtcbiAgICAgIC8vIFRPRE86IEFkZCBjaHVua2VkIGVuY29kaW5nIHdoZW4gbm8gbGVuZ3RoIChpZiBlcnIpXG4gICAgICBpZiAoZXJyKSBkZWJ1ZygnZm9ybURhdGEuZ2V0TGVuZ3RoIGhhZCBlcnJvcicsIGVyciwgbGVuZ3RoKTtcblxuICAgICAgZGVidWcoJ2dvdCBGb3JtRGF0YSBDb250ZW50LUxlbmd0aDogJXMnLCBsZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBsZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJlcS5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgbGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgZm9ybURhdGEucGlwZShnZXRQcm9ncmVzc01vbml0b3IoKSkucGlwZShyZXEpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSkge1xuICAgIGJ1ZmZlclRvQ2h1bmtzKGRhdGEpLnBpcGUoZ2V0UHJvZ3Jlc3NNb25pdG9yKCkpLnBpcGUocmVxKTtcbiAgfSBlbHNlIHtcbiAgICByZXEuZW5kKGRhdGEpO1xuICB9XG59O1xuXG4vLyBDaGVjayB3aGV0aGVyIHJlc3BvbnNlIGhhcyBhIG5vbi0wLXNpemVkIGd6aXAtZW5jb2RlZCBib2R5XG5SZXF1ZXN0LnByb3RvdHlwZS5fc2hvdWxkVW56aXAgPSAocmVzKSA9PiB7XG4gIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjA0IHx8IHJlcy5zdGF0dXNDb2RlID09PSAzMDQpIHtcbiAgICAvLyBUaGVzZSBhcmVuJ3Qgc3VwcG9zZWQgdG8gaGF2ZSBhbnkgYm9keVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIGhlYWRlciBjb250ZW50IGlzIGEgc3RyaW5nLCBhbmQgZGlzdGluY3Rpb24gYmV0d2VlbiAwIGFuZCBubyBpbmZvcm1hdGlvbiBpcyBjcnVjaWFsXG4gIGlmIChyZXMuaGVhZGVyc1snY29udGVudC1sZW5ndGgnXSA9PT0gJzAnKSB7XG4gICAgLy8gV2Uga25vdyB0aGF0IHRoZSBib2R5IGlzIGVtcHR5ICh1bmZvcnR1bmF0ZWx5LCB0aGlzIGNoZWNrIGRvZXMgbm90IGNvdmVyIGNodW5rZWQgZW5jb2RpbmcpXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gY29uc29sZS5sb2cocmVzKTtcbiAgcmV0dXJuIC9eXFxzKig/OmRlZmxhdGV8Z3ppcClcXHMqJC8udGVzdChyZXMuaGVhZGVyc1snY29udGVudC1lbmNvZGluZyddKTtcbn07XG5cbi8qKlxuICogT3ZlcnJpZGVzIEROUyBmb3Igc2VsZWN0ZWQgaG9zdG5hbWVzLiBUYWtlcyBvYmplY3QgbWFwcGluZyBob3N0bmFtZXMgdG8gSVAgYWRkcmVzc2VzLlxuICpcbiAqIFdoZW4gbWFraW5nIGEgcmVxdWVzdCB0byBhIFVSTCB3aXRoIGEgaG9zdG5hbWUgZXhhY3RseSBtYXRjaGluZyBhIGtleSBpbiB0aGUgb2JqZWN0LFxuICogdXNlIHRoZSBnaXZlbiBJUCBhZGRyZXNzIHRvIGNvbm5lY3QsIGluc3RlYWQgb2YgdXNpbmcgRE5TIHRvIHJlc29sdmUgdGhlIGhvc3RuYW1lLlxuICpcbiAqIEEgc3BlY2lhbCBob3N0IGAqYCBtYXRjaGVzIGV2ZXJ5IGhvc3RuYW1lIChrZWVwIHJlZGlyZWN0cyBpbiBtaW5kISlcbiAqXG4gKiAgICAgIHJlcXVlc3QuY29ubmVjdCh7XG4gKiAgICAgICAgJ3Rlc3QuZXhhbXBsZS5jb20nOiAnMTI3LjAuMC4xJyxcbiAqICAgICAgICAnaXB2Ni5leGFtcGxlLmNvbSc6ICc6OjEnLFxuICogICAgICB9KVxuICovXG5SZXF1ZXN0LnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24gKGNvbm5lY3RPdmVycmlkZSkge1xuICBpZiAodHlwZW9mIGNvbm5lY3RPdmVycmlkZSA9PT0gJ3N0cmluZycpIHtcbiAgICB0aGlzLl9jb25uZWN0T3ZlcnJpZGUgPSB7ICcqJzogY29ubmVjdE92ZXJyaWRlIH07XG4gIH0gZWxzZSBpZiAodHlwZW9mIGNvbm5lY3RPdmVycmlkZSA9PT0gJ29iamVjdCcpIHtcbiAgICB0aGlzLl9jb25uZWN0T3ZlcnJpZGUgPSBjb25uZWN0T3ZlcnJpZGU7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fY29ubmVjdE92ZXJyaWRlID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50cnVzdExvY2FsaG9zdCA9IGZ1bmN0aW9uICh0b2dnbGUpIHtcbiAgdGhpcy5fdHJ1c3RMb2NhbGhvc3QgPSB0b2dnbGUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiB0b2dnbGU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZ2VuZXJhdGUgSFRUUCB2ZXJiIG1ldGhvZHNcbmlmICghbWV0aG9kcy5pbmNsdWRlcygnZGVsJykpIHtcbiAgLy8gY3JlYXRlIGEgY29weSBzbyB3ZSBkb24ndCBjYXVzZSBjb25mbGljdHMgd2l0aFxuICAvLyBvdGhlciBwYWNrYWdlcyB1c2luZyB0aGUgbWV0aG9kcyBwYWNrYWdlIGFuZFxuICAvLyBucG0gMy54XG4gIG1ldGhvZHMgPSBtZXRob2RzLnNsaWNlKDApO1xuICBtZXRob2RzLnB1c2goJ2RlbCcpO1xufVxuXG5tZXRob2RzLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICBjb25zdCBuYW1lID0gbWV0aG9kO1xuICBtZXRob2QgPSBtZXRob2QgPT09ICdkZWwnID8gJ2RlbGV0ZScgOiBtZXRob2Q7XG5cbiAgbWV0aG9kID0gbWV0aG9kLnRvVXBwZXJDYXNlKCk7XG4gIHJlcXVlc3RbbmFtZV0gPSAodXJsLCBkYXRhLCBmbikgPT4ge1xuICAgIGNvbnN0IHJlcSA9IHJlcXVlc3QobWV0aG9kLCB1cmwpO1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZm4gPSBkYXRhO1xuICAgICAgZGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGlmIChtZXRob2QgPT09ICdHRVQnIHx8IG1ldGhvZCA9PT0gJ0hFQUQnKSB7XG4gICAgICAgIHJlcS5xdWVyeShkYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcS5zZW5kKGRhdGEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmbikgcmVxLmVuZChmbik7XG4gICAgcmV0dXJuIHJlcTtcbiAgfTtcbn0pO1xuXG4vKipcbiAqIENoZWNrIGlmIGBtaW1lYCBpcyB0ZXh0IGFuZCBzaG91bGQgYmUgYnVmZmVyZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1pbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGlzVGV4dChtaW1lKSB7XG4gIGNvbnN0IHBhcnRzID0gbWltZS5zcGxpdCgnLycpO1xuICBsZXQgdHlwZSA9IHBhcnRzWzBdO1xuICBpZiAodHlwZSkgdHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gIGxldCBzdWJ0eXBlID0gcGFydHNbMV07XG4gIGlmIChzdWJ0eXBlKSBzdWJ0eXBlID0gc3VidHlwZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcblxuICByZXR1cm4gdHlwZSA9PT0gJ3RleHQnIHx8IHN1YnR5cGUgPT09ICd4LXd3dy1mb3JtLXVybGVuY29kZWQnO1xufVxuXG5mdW5jdGlvbiBpc0ltYWdlT3JWaWRlbyhtaW1lKSB7XG4gIGxldCB0eXBlID0gbWltZS5zcGxpdCgnLycpWzBdO1xuICBpZiAodHlwZSkgdHlwZSA9IHR5cGUudG9Mb3dlckNhc2UoKS50cmltKCk7XG5cbiAgcmV0dXJuIHR5cGUgPT09ICdpbWFnZScgfHwgdHlwZSA9PT0gJ3ZpZGVvJztcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBgbWltZWAgaXMganNvbiBvciBoYXMgK2pzb24gc3RydWN0dXJlZCBzeW50YXggc3VmZml4LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtaW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNKU09OKG1pbWUpIHtcbiAgLy8gc2hvdWxkIG1hdGNoIC9qc29uIG9yICtqc29uXG4gIC8vIGJ1dCBub3QgL2pzb24tc2VxXG4gIHJldHVybiAvWy8rXWpzb24oJHxbXi1cXHddKS9pLnRlc3QobWltZSk7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgd2Ugc2hvdWxkIGZvbGxvdyB0aGUgcmVkaXJlY3QgYGNvZGVgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBjb2RlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNSZWRpcmVjdChjb2RlKSB7XG4gIHJldHVybiBbMzAxLCAzMDIsIDMwMywgMzA1LCAzMDcsIDMwOF0uaW5jbHVkZXMoY29kZSk7XG59XG4iXX0=