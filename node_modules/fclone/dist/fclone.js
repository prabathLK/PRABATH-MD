(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('fclone', [], factory);
    } else if (typeof module === 'object' && module.exports) {
			  //node
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.fclone = factory();
    }
}(this, function () {
  'use strict';

// see if it looks and smells like an iterable object, and do accept length === 0

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function isArrayLike(item) {
  if (Array.isArray(item)) return true;

  var len = item && item.length;
  return typeof len === 'number' && (len === 0 || len - 1 in item) && typeof item.indexOf === 'function';
}

function fclone(obj, refs) {
  if (!obj || "object" !== (typeof obj === 'undefined' ? 'undefined' : _typeof(obj))) return obj;

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(obj)) {
    return new Buffer(obj);
  }

  // typed array Int32Array etc.
  if (typeof obj.subarray === 'function' && /[A-Z][A-Za-z\d]+Array/.test(Object.prototype.toString.call(obj))) {
    return obj.subarray(0);
  }

  if (!refs) {
    refs = [];
  }

  if (isArrayLike(obj)) {
    refs[refs.length] = obj;
    var _l = obj.length;
    var i = -1;
    var _copy = [];

    while (_l > ++i) {
      _copy[i] = ~refs.indexOf(obj[i]) ? '[Circular]' : fclone(obj[i], refs);
    }

    refs.length && refs.length--;
    return _copy;
  }

  refs[refs.length] = obj;
  var copy = {};

  if (obj instanceof Error) {
    copy.name = obj.name;
    copy.message = obj.message;
    copy.stack = obj.stack;
  }

  var keys = Object.keys(obj);
  var l = keys.length;

  while (l--) {
    var k = keys[l];
    copy[k] = ~refs.indexOf(obj[k]) ? '[Circular]' : fclone(obj[k], refs);
  }

  refs.length && refs.length--;
  return copy;
}

fclone.default = fclone;
  return fclone
}));