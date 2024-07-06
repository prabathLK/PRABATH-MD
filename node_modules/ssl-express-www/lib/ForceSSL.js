'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res, next) {
  var local = req.url;
  var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
  var www = req.headers.host.replace(/www\./gi, '');
  var fullUrl = 'https://' + www + local;
  var removeSlash = function removeSlash(site) {
    return site.replace(/\/$/, '');
  };

  var notLocalHost = !www.includes('localhost');

  if (notLocalHost) {
    if (schema !== 'https') {
      return res.redirect(removeSlash(fullUrl));
    }
    if (/^www\./i.test(req.headers.host) && schema === 'https') {
      return res.redirect(removeSlash(fullUrl));
    }
    if (/\/$/.test(fullUrl) && fullUrl !== 'https://' + www + '/') {
      return res.redirect(removeSlash(fullUrl));
    }
  }

  return next();
};

module.exports = exports['default'];