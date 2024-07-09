'use strict';

var urllib = require('url');
var psl = require('psl');

const SESSION_TIMEOUT = 1800; // 30 min

module.exports = Biskviit;

/**
 * Creates a biskviit cookie jar for managing cookie values in memory
 *
 * @constructor
 * @param {Object} [options] Optional options object
 */
function Biskviit(options) {
    this.options = options || {};
    this.cookies = [];
}

/**
 * Stores a cookie string to the cookie storage
 *
 * @param {String} cookieStr Value from the 'Set-Cookie:' header
 * @param {String} url Current URL
 */
Biskviit.prototype.set = function(cookieStr, url) {
    var urlparts = urllib.parse(url || '');
    var cookie = this.parse(cookieStr);

    if (cookie.domain) {
        let domain = cookie.domain.replace(/^\./, '');

        // do not allow generic TLDs, except unlisted
        if (psl.parse(domain).listed && !psl.isValid(domain)) {
            cookie.domain = urlparts.hostname;
        }

        // do not allow cross origin cookies
        if (
            // can't be valid if the requested domain is shorter than current hostname
            urlparts.hostname.length < domain.length ||

            // prefix domains with dot to be sure that partial matches are not used
            ('.' + urlparts.hostname).substr(-domain.length + 1) !== ('.' + domain)) {
            cookie.domain = urlparts.hostname;
        }
    } else {
        cookie.domain = urlparts.hostname;
    }

    if (!cookie.path) {
        cookie.path = this.getPath(urlparts.pathname);
    }

    // if no expire date, then use sessionTimeout value
    if (!cookie.expires) {
        cookie.expires = new Date(Date.now() + (Number(this.options.sessionTimeout || SESSION_TIMEOUT) || SESSION_TIMEOUT) * 1000);
    }

    return this.add(cookie);
};

/**
 * Returns cookie string for the 'Cookie:' header.
 *
 * @param {String} url URL to check for
 * @returns {String} Cookie header or empty string if no matches were found
 */
Biskviit.prototype.get = function(url) {
    return this.list(url).map(function(cookie) {
        return cookie.name + '=' + cookie.value;
    }).join('; ');
};

/**
 * Lists all valied cookie objects for the specified URL
 *
 * @param {String} url URL to check for
 * @returns {Array} An array of cookie objects
 */
Biskviit.prototype.list = function(url) {
    var result = [];

    for (let i = this.cookies.length - 1; i >= 0; i--) {
        let cookie = this.cookies[i];

        if (this.isExpired(cookie)) {
            this.cookies.splice(i, i);
            continue;
        }

        if (this.match(cookie, url)) {
            result.unshift(cookie);
        }
    }

    return result;
};

/**
 * Parses cookie string from the 'Set-Cookie:' header
 *
 * @param {String} cookieStr String from the 'Set-Cookie:' header
 * @returns {Object} Cookie object
 */
Biskviit.prototype.parse = function(cookieStr) {
    var cookie = {};

    (cookieStr || '').toString().split(';').forEach(function(cookiePart) {
        var valueParts = cookiePart.split('=');
        var key = valueParts.shift().trim().toLowerCase();
        var value = valueParts.join('=').trim();

        if (!key) {
            // skip empty parts
            return;
        }

        switch (key) {

            case 'expires':
                value = new Date(value);
                // ignore date if can not parse it
                if (value.toString() !== 'Invalid Date') {
                    cookie.expires = value;
                }
                break;

            case 'path':
                cookie.path = value;
                break;

            case 'domain':
                let domain = value.toLowerCase();
                if (domain.length && domain.charAt(0) !== '.') {
                    domain = '.' + domain; // ensure preceeding dot for user set domains
                }
                cookie.domain = domain;
                break;

            case 'max-age':
                cookie.expires = new Date(Date.now() + (Number(value) || 0) * 1000);
                break;

            case 'secure':
                cookie.secure = true;
                break;

            case 'httponly':
                cookie.httponly = true;
                break;

            default:
                if (!cookie.name) {
                    cookie.name = key;
                    cookie.value = value;
                }
        }
    });

    return cookie;
};

/**
 * Checks if a cookie object is valid for a specified URL
 *
 * @param {Object} cookie Cookie object
 * @param {String} url URL to check for
 * @returns {Boolean} true if cookie is valid for specifiec URL
 */
Biskviit.prototype.match = function(cookie, url) {
    var urlparts = urllib.parse(url || '');

    // check if hostname matches
    // .foo.com also matches subdomains, foo.com does not
    if (urlparts.hostname !== cookie.domain && (cookie.domain.charAt(0) !== '.' || ('.' + urlparts.hostname).substr(-cookie.domain.length) !== cookie.domain)) {
        return false;
    }

    // check if path matches
    let path = this.getPath(urlparts.pathname);
    if (path.substr(0, cookie.path.length) !== cookie.path) {
        return false;
    }

    // check secure argument
    if (cookie.secure && urlparts.protocol !== 'https:') {
        return false;
    }

    return true;
};

/**
 * Adds (or updates/removes if needed) a cookie object to the cookie storage
 *
 * @param {Object} cookie Cookie value to be stored
 */
Biskviit.prototype.add = function(cookie) {
    // nothing to do here
    if (!cookie || !cookie.name) {
        return false;
    }

    // overwrite if has same params
    for (let i = 0, len = this.cookies.length; i < len; i++) {
        if (this.compare(this.cookies[i], cookie)) {

            // check if the cookie needs to be removed instead
            if (this.isExpired(cookie)) {
                this.cookies.splice(i, 1); // remove expired/unset cookie
                return false;
            }

            this.cookies[i] = cookie;
            return true;
        }
    }

    // add as new if not already expired
    if (!this.isExpired(cookie)) {
        this.cookies.push(cookie);
    }

    return true;
};

/**
 * Checks if two cookie objects are the same
 *
 * @param {Object} a Cookie to check against
 * @param {Object} b Cookie to check against
 * @returns {Boolean} True, if the cookies are the same
 */
Biskviit.prototype.compare = function(a, b) {
    return a.name === b.name && a.path === b.path && a.domain === b.domain && a.secure === b.secure && a.httponly === a.httponly;
};

/**
 * Checks if a cookie is expired
 *
 * @param {Object} cookie Cookie object to check against
 * @returns {Boolean} True, if the cookie is expired
 */
Biskviit.prototype.isExpired = function(cookie) {
    return (cookie.expires && cookie.expires < new Date()) || !cookie.value;
};

/**
 * Returns normalized cookie path for an URL path argument
 *
 * @param {String} pathname
 * @returns {String} Normalized path
 */
Biskviit.prototype.getPath = function(pathname) {
    var path = (pathname || '/').split('/');
    path.pop(); // remove filename part
    path = path.join('/').trim();

    // ensure path prefix /
    if (path.charAt(0) !== '/') {
        path = '/' + path;
    }

    // ensure path suffix /
    if (path.substr(-1) !== '/') {
        path += '/';
    }

    return path;
};