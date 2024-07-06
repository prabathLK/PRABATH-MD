(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Keymetrics = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){(function (){
"use strict";

var pkg = require('./package.json');
var config = {
  headers: {
    'X-JS-API-Version': pkg.version
  },
  services: {
    API: 'https://api.keymetrics.io',
    OAUTH: 'https://id.keymetrics.io'
  },
  OAUTH_AUTHORIZE_ENDPOINT: '/api/oauth/authorize',
  OAUTH_CLIENT_ID: '795984050',
  ENVIRONNEMENT: process && process.versions && process.versions.node ? 'node' : 'browser',
  VERSION: pkg.version,
  // put in debug when using km.io with browser OR when DEBUG=true with nodejs
  IS_DEBUG: typeof window !== 'undefined' && window.location.host.match(/km.(io|local)/) || typeof process !== 'undefined' && process.env.DEBUG === 'true'
};
module.exports = Object.assign({}, config);

}).call(this)}).call(this,require('_process'))
},{"./package.json":39,"_process":37}],2:[function(require,module,exports){
(function (process,global,setImmediate){(function (){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.async = global.async || {})));
}(this, (function (exports) { 'use strict';

function slice(arrayLike, start) {
    start = start|0;
    var newLen = Math.max(arrayLike.length - start, 0);
    var newArr = Array(newLen);
    for(var idx = 0; idx < newLen; idx++)  {
        newArr[idx] = arrayLike[start + idx];
    }
    return newArr;
}

/**
 * Creates a continuation function with some arguments already applied.
 *
 * Useful as a shorthand when combined with other control flow functions. Any
 * arguments passed to the returned function are added to the arguments
 * originally passed to apply.
 *
 * @name apply
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} fn - The function you want to eventually apply all
 * arguments to. Invokes with (arguments...).
 * @param {...*} arguments... - Any number of arguments to automatically apply
 * when the continuation is called.
 * @returns {Function} the partially-applied function
 * @example
 *
 * // using apply
 * async.parallel([
 *     async.apply(fs.writeFile, 'testfile1', 'test1'),
 *     async.apply(fs.writeFile, 'testfile2', 'test2')
 * ]);
 *
 *
 * // the same process without using apply
 * async.parallel([
 *     function(callback) {
 *         fs.writeFile('testfile1', 'test1', callback);
 *     },
 *     function(callback) {
 *         fs.writeFile('testfile2', 'test2', callback);
 *     }
 * ]);
 *
 * // It's possible to pass any number of additional arguments when calling the
 * // continuation:
 *
 * node> var fn = async.apply(sys.puts, 'one');
 * node> fn('two', 'three');
 * one
 * two
 * three
 */
var apply = function(fn/*, ...args*/) {
    var args = slice(arguments, 1);
    return function(/*callArgs*/) {
        var callArgs = slice(arguments);
        return fn.apply(null, args.concat(callArgs));
    };
};

var initialParams = function (fn) {
    return function (/*...args, callback*/) {
        var args = slice(arguments);
        var callback = args.pop();
        fn.call(this, args, callback);
    };
};

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
var hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

function fallback(fn) {
    setTimeout(fn, 0);
}

function wrap(defer) {
    return function (fn/*, ...args*/) {
        var args = slice(arguments, 1);
        defer(function () {
            fn.apply(null, args);
        });
    };
}

var _defer;

if (hasSetImmediate) {
    _defer = setImmediate;
} else if (hasNextTick) {
    _defer = process.nextTick;
} else {
    _defer = fallback;
}

var setImmediate$1 = wrap(_defer);

/**
 * Take a sync function and make it async, passing its return value to a
 * callback. This is useful for plugging sync functions into a waterfall,
 * series, or other async functions. Any arguments passed to the generated
 * function will be passed to the wrapped function (except for the final
 * callback argument). Errors thrown will be passed to the callback.
 *
 * If the function passed to `asyncify` returns a Promise, that promises's
 * resolved/rejected state will be used to call the callback, rather than simply
 * the synchronous return value.
 *
 * This also means you can asyncify ES2017 `async` functions.
 *
 * @name asyncify
 * @static
 * @memberOf module:Utils
 * @method
 * @alias wrapSync
 * @category Util
 * @param {Function} func - The synchronous function, or Promise-returning
 * function to convert to an {@link AsyncFunction}.
 * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
 * invoked with `(args..., callback)`.
 * @example
 *
 * // passing a regular synchronous function
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(JSON.parse),
 *     function (data, next) {
 *         // data is the result of parsing the text.
 *         // If there was a parsing error, it would have been caught.
 *     }
 * ], callback);
 *
 * // passing a function returning a promise
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(function (contents) {
 *         return db.model.create(contents);
 *     }),
 *     function (model, next) {
 *         // `model` is the instantiated model object.
 *         // If there was an error, this function would be skipped.
 *     }
 * ], callback);
 *
 * // es2017 example, though `asyncify` is not needed if your JS environment
 * // supports async functions out of the box
 * var q = async.queue(async.asyncify(async function(file) {
 *     var intermediateStep = await processFile(file);
 *     return await somePromise(intermediateStep)
 * }));
 *
 * q.push(files);
 */
function asyncify(func) {
    return initialParams(function (args, callback) {
        var result;
        try {
            result = func.apply(this, args);
        } catch (e) {
            return callback(e);
        }
        // if result is Promise object
        if (isObject(result) && typeof result.then === 'function') {
            result.then(function(value) {
                invokeCallback(callback, null, value);
            }, function(err) {
                invokeCallback(callback, err.message ? err : new Error(err));
            });
        } else {
            callback(null, result);
        }
    });
}

function invokeCallback(callback, error, value) {
    try {
        callback(error, value);
    } catch (e) {
        setImmediate$1(rethrow, e);
    }
}

function rethrow(error) {
    throw error;
}

var supportsSymbol = typeof Symbol === 'function';

function isAsync(fn) {
    return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
}

function wrapAsync(asyncFn) {
    return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
}

function applyEach$1(eachfn) {
    return function(fns/*, ...args*/) {
        var args = slice(arguments, 1);
        var go = initialParams(function(args, callback) {
            var that = this;
            return eachfn(fns, function (fn, cb) {
                wrapAsync(fn).apply(that, args.concat(cb));
            }, callback);
        });
        if (args.length) {
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

// A temporary value used to identify if the loop should be broken.
// See #1064, #1293
var breakLoop = {};

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

function once(fn) {
    return function () {
        if (fn === null) return;
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}

var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

var getIterator = function (coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
};

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$2.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag$1 = '[object Function]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$1.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    return function next() {
        return ++i < len ? {value: coll[i], key: i} : null;
    }
}

function createES2015Iterator(iterator) {
    var i = -1;
    return function next() {
        var item = iterator.next();
        if (item.done)
            return null;
        i++;
        return {value: item.value, key: i};
    }
}

function createObjectIterator(obj) {
    var okeys = keys(obj);
    var i = -1;
    var len = okeys.length;
    return function next() {
        var key = okeys[++i];
        if (key === '__proto__') {
            return next();
        }
        return i < len ? {value: obj[key], key: key} : null;
    };
}

function iterator(coll) {
    if (isArrayLike(coll)) {
        return createArrayIterator(coll);
    }

    var iterator = getIterator(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}

function onlyOnce(fn) {
    return function() {
        if (fn === null) throw new Error("Callback was already called.");
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}

function _eachOfLimit(limit) {
    return function (obj, iteratee, callback) {
        callback = once(callback || noop);
        if (limit <= 0 || !obj) {
            return callback(null);
        }
        var nextElem = iterator(obj);
        var done = false;
        var running = 0;
        var looping = false;

        function iterateeCallback(err, value) {
            running -= 1;
            if (err) {
                done = true;
                callback(err);
            }
            else if (value === breakLoop || (done && running <= 0)) {
                done = true;
                return callback(null);
            }
            else if (!looping) {
                replenish();
            }
        }

        function replenish () {
            looping = true;
            while (running < limit && !done) {
                var elem = nextElem();
                if (elem === null) {
                    done = true;
                    if (running <= 0) {
                        callback(null);
                    }
                    return;
                }
                running += 1;
                iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
            }
            looping = false;
        }

        replenish();
    };
}

/**
 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name eachOfLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.eachOf]{@link module:Collections.eachOf}
 * @alias forEachOfLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each
 * item in `coll`. The `key` is the item's key, or index in the case of an
 * array.
 * Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
function eachOfLimit(coll, limit, iteratee, callback) {
    _eachOfLimit(limit)(coll, wrapAsync(iteratee), callback);
}

function doLimit(fn, limit) {
    return function (iterable, iteratee, callback) {
        return fn(iterable, limit, iteratee, callback);
    };
}

// eachOf implementation optimized for array-likes
function eachOfArrayLike(coll, iteratee, callback) {
    callback = once(callback || noop);
    var index = 0,
        completed = 0,
        length = coll.length;
    if (length === 0) {
        callback(null);
    }

    function iteratorCallback(err, value) {
        if (err) {
            callback(err);
        } else if ((++completed === length) || value === breakLoop) {
            callback(null);
        }
    }

    for (; index < length; index++) {
        iteratee(coll[index], index, onlyOnce(iteratorCallback));
    }
}

// a generic version of eachOf which can handle array, object, and iterator cases.
var eachOfGeneric = doLimit(eachOfLimit, Infinity);

/**
 * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
 * to the iteratee.
 *
 * @name eachOf
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEachOf
 * @category Collection
 * @see [async.each]{@link module:Collections.each}
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each
 * item in `coll`.
 * The `key` is the item's key, or index in the case of an array.
 * Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @example
 *
 * var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
 * var configs = {};
 *
 * async.forEachOf(obj, function (value, key, callback) {
 *     fs.readFile(__dirname + value, "utf8", function (err, data) {
 *         if (err) return callback(err);
 *         try {
 *             configs[key] = JSON.parse(data);
 *         } catch (e) {
 *             return callback(e);
 *         }
 *         callback();
 *     });
 * }, function (err) {
 *     if (err) console.error(err.message);
 *     // configs is now a map of JSON data
 *     doSomethingWith(configs);
 * });
 */
var eachOf = function(coll, iteratee, callback) {
    var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, wrapAsync(iteratee), callback);
};

function doParallel(fn) {
    return function (obj, iteratee, callback) {
        return fn(eachOf, obj, wrapAsync(iteratee), callback);
    };
}

function _asyncMap(eachfn, arr, iteratee, callback) {
    callback = callback || noop;
    arr = arr || [];
    var results = [];
    var counter = 0;
    var _iteratee = wrapAsync(iteratee);

    eachfn(arr, function (value, _, callback) {
        var index = counter++;
        _iteratee(value, function (err, v) {
            results[index] = v;
            callback(err);
        });
    }, function (err) {
        callback(err, results);
    });
}

/**
 * Produces a new collection of values by mapping each value in `coll` through
 * the `iteratee` function. The `iteratee` is called with an item from `coll`
 * and a callback for when it has finished processing. Each of these callback
 * takes 2 arguments: an `error`, and the transformed item from `coll`. If
 * `iteratee` passes an error to its callback, the main `callback` (for the
 * `map` function) is immediately called with the error.
 *
 * Note, that since this function applies the `iteratee` to each item in
 * parallel, there is no guarantee that the `iteratee` functions will complete
 * in order. However, the results array will be in the same order as the
 * original `coll`.
 *
 * If `map` is passed an Object, the results will be an Array.  The results
 * will roughly be in the order of the original Objects' keys (but this can
 * vary across JavaScript engines).
 *
 * @name map
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with the transformed item.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an Array of the
 * transformed items from the `coll`. Invoked with (err, results).
 * @example
 *
 * async.map(['file1','file2','file3'], fs.stat, function(err, results) {
 *     // results is now an array of stats for each file
 * });
 */
var map = doParallel(_asyncMap);

/**
 * Applies the provided arguments to each function in the array, calling
 * `callback` after all functions have completed. If you only provide the first
 * argument, `fns`, then it will return a function which lets you pass in the
 * arguments as if it were a single function call. If more arguments are
 * provided, `callback` is required while `args` is still optional.
 *
 * @name applyEach
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} fns - A collection of {@link AsyncFunction}s
 * to all call with the same arguments
 * @param {...*} [args] - any number of separate arguments to pass to the
 * function.
 * @param {Function} [callback] - the final argument should be the callback,
 * called when all functions have completed processing.
 * @returns {Function} - If only the first argument, `fns`, is provided, it will
 * return a function which lets you pass in the arguments as if it were a single
 * function call. The signature is `(..args, callback)`. If invoked with any
 * arguments, `callback` is required.
 * @example
 *
 * async.applyEach([enableSearch, updateSchema], 'bucket', callback);
 *
 * // partial application example:
 * async.each(
 *     buckets,
 *     async.applyEach([enableSearch, updateSchema]),
 *     callback
 * );
 */
var applyEach = applyEach$1(map);

function doParallelLimit(fn) {
    return function (obj, limit, iteratee, callback) {
        return fn(_eachOfLimit(limit), obj, wrapAsync(iteratee), callback);
    };
}

/**
 * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
 *
 * @name mapLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with the transformed item.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an array of the
 * transformed items from the `coll`. Invoked with (err, results).
 */
var mapLimit = doParallelLimit(_asyncMap);

/**
 * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
 *
 * @name mapSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with the transformed item.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an array of the
 * transformed items from the `coll`. Invoked with (err, results).
 */
var mapSeries = doLimit(mapLimit, 1);

/**
 * The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
 *
 * @name applyEachSeries
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.applyEach]{@link module:ControlFlow.applyEach}
 * @category Control Flow
 * @param {Array|Iterable|Object} fns - A collection of {@link AsyncFunction}s to all
 * call with the same arguments
 * @param {...*} [args] - any number of separate arguments to pass to the
 * function.
 * @param {Function} [callback] - the final argument should be the callback,
 * called when all functions have completed processing.
 * @returns {Function} - If only the first argument is provided, it will return
 * a function which lets you pass in the arguments as if it were a single
 * function call.
 */
var applyEachSeries = applyEach$1(mapSeries);

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

/**
 * Determines the best order for running the {@link AsyncFunction}s in `tasks`, based on
 * their requirements. Each function can optionally depend on other functions
 * being completed first, and each function is run as soon as its requirements
 * are satisfied.
 *
 * If any of the {@link AsyncFunction}s pass an error to their callback, the `auto` sequence
 * will stop. Further tasks will not execute (so any other functions depending
 * on it will not run), and the main `callback` is immediately called with the
 * error.
 *
 * {@link AsyncFunction}s also receive an object containing the results of functions which
 * have completed so far as the first argument, if they have dependencies. If a
 * task function has no dependencies, it will only be passed a callback.
 *
 * @name auto
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Object} tasks - An object. Each of its properties is either a
 * function or an array of requirements, with the {@link AsyncFunction} itself the last item
 * in the array. The object's key of a property serves as the name of the task
 * defined by that property, i.e. can be used when specifying requirements for
 * other tasks. The function receives one or two arguments:
 * * a `results` object, containing the results of the previously executed
 *   functions, only passed if the task has any dependencies,
 * * a `callback(err, result)` function, which must be called when finished,
 *   passing an `error` (which can be `null`) and the result of the function's
 *   execution.
 * @param {number} [concurrency=Infinity] - An optional `integer` for
 * determining the maximum number of tasks that can be run in parallel. By
 * default, as many as possible.
 * @param {Function} [callback] - An optional callback which is called when all
 * the tasks have been completed. It receives the `err` argument if any `tasks`
 * pass an error to their callback. Results are always returned; however, if an
 * error occurs, no further `tasks` will be performed, and the results object
 * will only contain partial results. Invoked with (err, results).
 * @returns undefined
 * @example
 *
 * async.auto({
 *     // this function will just be passed a callback
 *     readData: async.apply(fs.readFile, 'data.txt', 'utf-8'),
 *     showData: ['readData', function(results, cb) {
 *         // results.readData is the file's contents
 *         // ...
 *     }]
 * }, callback);
 *
 * async.auto({
 *     get_data: function(callback) {
 *         console.log('in get_data');
 *         // async code to get some data
 *         callback(null, 'data', 'converted to array');
 *     },
 *     make_folder: function(callback) {
 *         console.log('in make_folder');
 *         // async code to create a directory to store a file in
 *         // this is run at the same time as getting the data
 *         callback(null, 'folder');
 *     },
 *     write_file: ['get_data', 'make_folder', function(results, callback) {
 *         console.log('in write_file', JSON.stringify(results));
 *         // once there is some data and the directory exists,
 *         // write the data to a file in the directory
 *         callback(null, 'filename');
 *     }],
 *     email_link: ['write_file', function(results, callback) {
 *         console.log('in email_link', JSON.stringify(results));
 *         // once the file is written let's email a link to it...
 *         // results.write_file contains the filename returned by write_file.
 *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
 *     }]
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('results = ', results);
 * });
 */
var auto = function (tasks, concurrency, callback) {
    if (typeof concurrency === 'function') {
        // concurrency is optional, shift the args.
        callback = concurrency;
        concurrency = null;
    }
    callback = once(callback || noop);
    var keys$$1 = keys(tasks);
    var numTasks = keys$$1.length;
    if (!numTasks) {
        return callback(null);
    }
    if (!concurrency) {
        concurrency = numTasks;
    }

    var results = {};
    var runningTasks = 0;
    var hasError = false;

    var listeners = Object.create(null);

    var readyTasks = [];

    // for cycle detection:
    var readyToCheck = []; // tasks that have been identified as reachable
    // without the possibility of returning to an ancestor task
    var uncheckedDependencies = {};

    baseForOwn(tasks, function (task, key) {
        if (!isArray(task)) {
            // no dependencies
            enqueueTask(key, [task]);
            readyToCheck.push(key);
            return;
        }

        var dependencies = task.slice(0, task.length - 1);
        var remainingDependencies = dependencies.length;
        if (remainingDependencies === 0) {
            enqueueTask(key, task);
            readyToCheck.push(key);
            return;
        }
        uncheckedDependencies[key] = remainingDependencies;

        arrayEach(dependencies, function (dependencyName) {
            if (!tasks[dependencyName]) {
                throw new Error('async.auto task `' + key +
                    '` has a non-existent dependency `' +
                    dependencyName + '` in ' +
                    dependencies.join(', '));
            }
            addListener(dependencyName, function () {
                remainingDependencies--;
                if (remainingDependencies === 0) {
                    enqueueTask(key, task);
                }
            });
        });
    });

    checkForDeadlocks();
    processQueue();

    function enqueueTask(key, task) {
        readyTasks.push(function () {
            runTask(key, task);
        });
    }

    function processQueue() {
        if (readyTasks.length === 0 && runningTasks === 0) {
            return callback(null, results);
        }
        while(readyTasks.length && runningTasks < concurrency) {
            var run = readyTasks.shift();
            run();
        }

    }

    function addListener(taskName, fn) {
        var taskListeners = listeners[taskName];
        if (!taskListeners) {
            taskListeners = listeners[taskName] = [];
        }

        taskListeners.push(fn);
    }

    function taskComplete(taskName) {
        var taskListeners = listeners[taskName] || [];
        arrayEach(taskListeners, function (fn) {
            fn();
        });
        processQueue();
    }


    function runTask(key, task) {
        if (hasError) return;

        var taskCallback = onlyOnce(function(err, result) {
            runningTasks--;
            if (arguments.length > 2) {
                result = slice(arguments, 1);
            }
            if (err) {
                var safeResults = {};
                baseForOwn(results, function(val, rkey) {
                    safeResults[rkey] = val;
                });
                safeResults[key] = result;
                hasError = true;
                listeners = Object.create(null);

                callback(err, safeResults);
            } else {
                results[key] = result;
                taskComplete(key);
            }
        });

        runningTasks++;
        var taskFn = wrapAsync(task[task.length - 1]);
        if (task.length > 1) {
            taskFn(results, taskCallback);
        } else {
            taskFn(taskCallback);
        }
    }

    function checkForDeadlocks() {
        // Kahn's algorithm
        // https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
        // http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
        var currentTask;
        var counter = 0;
        while (readyToCheck.length) {
            currentTask = readyToCheck.pop();
            counter++;
            arrayEach(getDependents(currentTask), function (dependent) {
                if (--uncheckedDependencies[dependent] === 0) {
                    readyToCheck.push(dependent);
                }
            });
        }

        if (counter !== numTasks) {
            throw new Error(
                'async.auto cannot execute tasks due to a recursive dependency'
            );
        }
    }

    function getDependents(taskName) {
        var result = [];
        baseForOwn(tasks, function (task, key) {
            if (isArray(task) && baseIndexOf(task, taskName, 0) >= 0) {
                result.push(key);
            }
        });
        return result;
    }
};

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined;
var symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the last unmatched string symbol.
 */
function charsEndIndex(strSymbols, chrSymbols) {
  var index = strSymbols.length;

  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the first unmatched string symbol.
 */
function charsStartIndex(strSymbols, chrSymbols) {
  var index = -1,
      length = strSymbols.length;

  while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff';
var rsComboMarksRange = '\\u0300-\\u036f';
var reComboHalfMarksRange = '\\ufe20-\\ufe2f';
var rsComboSymbolsRange = '\\u20d0-\\u20ff';
var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
var rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/** Used to compose unicode character classes. */
var rsAstralRange$1 = '\\ud800-\\udfff';
var rsComboMarksRange$1 = '\\u0300-\\u036f';
var reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f';
var rsComboSymbolsRange$1 = '\\u20d0-\\u20ff';
var rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1;
var rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange$1 + ']';
var rsCombo = '[' + rsComboRange$1 + ']';
var rsFitz = '\\ud83c[\\udffb-\\udfff]';
var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
var rsNonAstral = '[^' + rsAstralRange$1 + ']';
var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
var rsZWJ$1 = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?';
var rsOptVar = '[' + rsVarRange$1 + ']?';
var rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*';
var rsSeq = rsOptVar + reOptMod + rsOptJoin;
var rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/**
 * Removes leading and trailing whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trim('  abc  ');
 * // => 'abc'
 *
 * _.trim('-_-abc-_-', '_-');
 * // => 'abc'
 *
 * _.map(['  foo  ', '  bar  '], _.trim);
 * // => ['foo', 'bar']
 */
function trim(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrim, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      chrSymbols = stringToArray(chars),
      start = charsStartIndex(strSymbols, chrSymbols),
      end = charsEndIndex(strSymbols, chrSymbols) + 1;

  return castSlice(strSymbols, start, end).join('');
}

var FN_ARGS = /^(?:async\s+)?(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /(=.+)?(\s*)$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function parseParams(func) {
    func = func.toString().replace(STRIP_COMMENTS, '');
    func = func.match(FN_ARGS)[2].replace(' ', '');
    func = func ? func.split(FN_ARG_SPLIT) : [];
    func = func.map(function (arg){
        return trim(arg.replace(FN_ARG, ''));
    });
    return func;
}

/**
 * A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
 * tasks are specified as parameters to the function, after the usual callback
 * parameter, with the parameter names matching the names of the tasks it
 * depends on. This can provide even more readable task graphs which can be
 * easier to maintain.
 *
 * If a final callback is specified, the task results are similarly injected,
 * specified as named parameters after the initial error parameter.
 *
 * The autoInject function is purely syntactic sugar and its semantics are
 * otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
 *
 * @name autoInject
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.auto]{@link module:ControlFlow.auto}
 * @category Control Flow
 * @param {Object} tasks - An object, each of whose properties is an {@link AsyncFunction} of
 * the form 'func([dependencies...], callback). The object's key of a property
 * serves as the name of the task defined by that property, i.e. can be used
 * when specifying requirements for other tasks.
 * * The `callback` parameter is a `callback(err, result)` which must be called
 *   when finished, passing an `error` (which can be `null`) and the result of
 *   the function's execution. The remaining parameters name other tasks on
 *   which the task is dependent, and the results from those tasks are the
 *   arguments of those parameters.
 * @param {Function} [callback] - An optional callback which is called when all
 * the tasks have been completed. It receives the `err` argument if any `tasks`
 * pass an error to their callback, and a `results` object with any completed
 * task results, similar to `auto`.
 * @example
 *
 * //  The example from `auto` can be rewritten as follows:
 * async.autoInject({
 *     get_data: function(callback) {
 *         // async code to get some data
 *         callback(null, 'data', 'converted to array');
 *     },
 *     make_folder: function(callback) {
 *         // async code to create a directory to store a file in
 *         // this is run at the same time as getting the data
 *         callback(null, 'folder');
 *     },
 *     write_file: function(get_data, make_folder, callback) {
 *         // once there is some data and the directory exists,
 *         // write the data to a file in the directory
 *         callback(null, 'filename');
 *     },
 *     email_link: function(write_file, callback) {
 *         // once the file is written let's email a link to it...
 *         // write_file contains the filename returned by write_file.
 *         callback(null, {'file':write_file, 'email':'user@example.com'});
 *     }
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('email_link = ', results.email_link);
 * });
 *
 * // If you are using a JS minifier that mangles parameter names, `autoInject`
 * // will not work with plain functions, since the parameter names will be
 * // collapsed to a single letter identifier.  To work around this, you can
 * // explicitly specify the names of the parameters your task function needs
 * // in an array, similar to Angular.js dependency injection.
 *
 * // This still has an advantage over plain `auto`, since the results a task
 * // depends on are still spread into arguments.
 * async.autoInject({
 *     //...
 *     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
 *         callback(null, 'filename');
 *     }],
 *     email_link: ['write_file', function(write_file, callback) {
 *         callback(null, {'file':write_file, 'email':'user@example.com'});
 *     }]
 *     //...
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('email_link = ', results.email_link);
 * });
 */
function autoInject(tasks, callback) {
    var newTasks = {};

    baseForOwn(tasks, function (taskFn, key) {
        var params;
        var fnIsAsync = isAsync(taskFn);
        var hasNoDeps =
            (!fnIsAsync && taskFn.length === 1) ||
            (fnIsAsync && taskFn.length === 0);

        if (isArray(taskFn)) {
            params = taskFn.slice(0, -1);
            taskFn = taskFn[taskFn.length - 1];

            newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
        } else if (hasNoDeps) {
            // no dependencies, use the function as-is
            newTasks[key] = taskFn;
        } else {
            params = parseParams(taskFn);
            if (taskFn.length === 0 && !fnIsAsync && params.length === 0) {
                throw new Error("autoInject task functions require explicit parameters.");
            }

            // remove callback param
            if (!fnIsAsync) params.pop();

            newTasks[key] = params.concat(newTask);
        }

        function newTask(results, taskCb) {
            var newArgs = arrayMap(params, function (name) {
                return results[name];
            });
            newArgs.push(taskCb);
            wrapAsync(taskFn).apply(null, newArgs);
        }
    });

    auto(newTasks, callback);
}

// Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
// used for queues. This implementation assumes that the node provided by the user can be modified
// to adjust the next and last properties. We implement only the minimal functionality
// for queue support.
function DLL() {
    this.head = this.tail = null;
    this.length = 0;
}

function setInitial(dll, node) {
    dll.length = 1;
    dll.head = dll.tail = node;
}

DLL.prototype.removeLink = function(node) {
    if (node.prev) node.prev.next = node.next;
    else this.head = node.next;
    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev;

    node.prev = node.next = null;
    this.length -= 1;
    return node;
};

DLL.prototype.empty = function () {
    while(this.head) this.shift();
    return this;
};

DLL.prototype.insertAfter = function(node, newNode) {
    newNode.prev = node;
    newNode.next = node.next;
    if (node.next) node.next.prev = newNode;
    else this.tail = newNode;
    node.next = newNode;
    this.length += 1;
};

DLL.prototype.insertBefore = function(node, newNode) {
    newNode.prev = node.prev;
    newNode.next = node;
    if (node.prev) node.prev.next = newNode;
    else this.head = newNode;
    node.prev = newNode;
    this.length += 1;
};

DLL.prototype.unshift = function(node) {
    if (this.head) this.insertBefore(this.head, node);
    else setInitial(this, node);
};

DLL.prototype.push = function(node) {
    if (this.tail) this.insertAfter(this.tail, node);
    else setInitial(this, node);
};

DLL.prototype.shift = function() {
    return this.head && this.removeLink(this.head);
};

DLL.prototype.pop = function() {
    return this.tail && this.removeLink(this.tail);
};

DLL.prototype.toArray = function () {
    var arr = Array(this.length);
    var curr = this.head;
    for(var idx = 0; idx < this.length; idx++) {
        arr[idx] = curr.data;
        curr = curr.next;
    }
    return arr;
};

DLL.prototype.remove = function (testFn) {
    var curr = this.head;
    while(!!curr) {
        var next = curr.next;
        if (testFn(curr)) {
            this.removeLink(curr);
        }
        curr = next;
    }
    return this;
};

function queue(worker, concurrency, payload) {
    if (concurrency == null) {
        concurrency = 1;
    }
    else if(concurrency === 0) {
        throw new Error('Concurrency must not be zero');
    }

    var _worker = wrapAsync(worker);
    var numRunning = 0;
    var workersList = [];

    var processingScheduled = false;
    function _insert(data, insertAtFront, callback) {
        if (callback != null && typeof callback !== 'function') {
            throw new Error('task callback must be a function');
        }
        q.started = true;
        if (!isArray(data)) {
            data = [data];
        }
        if (data.length === 0 && q.idle()) {
            // call drain immediately if there are no tasks
            return setImmediate$1(function() {
                q.drain();
            });
        }

        for (var i = 0, l = data.length; i < l; i++) {
            var item = {
                data: data[i],
                callback: callback || noop
            };

            if (insertAtFront) {
                q._tasks.unshift(item);
            } else {
                q._tasks.push(item);
            }
        }

        if (!processingScheduled) {
            processingScheduled = true;
            setImmediate$1(function() {
                processingScheduled = false;
                q.process();
            });
        }
    }

    function _next(tasks) {
        return function(err){
            numRunning -= 1;

            for (var i = 0, l = tasks.length; i < l; i++) {
                var task = tasks[i];

                var index = baseIndexOf(workersList, task, 0);
                if (index === 0) {
                    workersList.shift();
                } else if (index > 0) {
                    workersList.splice(index, 1);
                }

                task.callback.apply(task, arguments);

                if (err != null) {
                    q.error(err, task.data);
                }
            }

            if (numRunning <= (q.concurrency - q.buffer) ) {
                q.unsaturated();
            }

            if (q.idle()) {
                q.drain();
            }
            q.process();
        };
    }

    var isProcessing = false;
    var q = {
        _tasks: new DLL(),
        concurrency: concurrency,
        payload: payload,
        saturated: noop,
        unsaturated:noop,
        buffer: concurrency / 4,
        empty: noop,
        drain: noop,
        error: noop,
        started: false,
        paused: false,
        push: function (data, callback) {
            _insert(data, false, callback);
        },
        kill: function () {
            q.drain = noop;
            q._tasks.empty();
        },
        unshift: function (data, callback) {
            _insert(data, true, callback);
        },
        remove: function (testFn) {
            q._tasks.remove(testFn);
        },
        process: function () {
            // Avoid trying to start too many processing operations. This can occur
            // when callbacks resolve synchronously (#1267).
            if (isProcessing) {
                return;
            }
            isProcessing = true;
            while(!q.paused && numRunning < q.concurrency && q._tasks.length){
                var tasks = [], data = [];
                var l = q._tasks.length;
                if (q.payload) l = Math.min(l, q.payload);
                for (var i = 0; i < l; i++) {
                    var node = q._tasks.shift();
                    tasks.push(node);
                    workersList.push(node);
                    data.push(node.data);
                }

                numRunning += 1;

                if (q._tasks.length === 0) {
                    q.empty();
                }

                if (numRunning === q.concurrency) {
                    q.saturated();
                }

                var cb = onlyOnce(_next(tasks));
                _worker(data, cb);
            }
            isProcessing = false;
        },
        length: function () {
            return q._tasks.length;
        },
        running: function () {
            return numRunning;
        },
        workersList: function () {
            return workersList;
        },
        idle: function() {
            return q._tasks.length + numRunning === 0;
        },
        pause: function () {
            q.paused = true;
        },
        resume: function () {
            if (q.paused === false) { return; }
            q.paused = false;
            setImmediate$1(q.process);
        }
    };
    return q;
}

/**
 * A cargo of tasks for the worker function to complete. Cargo inherits all of
 * the same methods and event callbacks as [`queue`]{@link module:ControlFlow.queue}.
 * @typedef {Object} CargoObject
 * @memberOf module:ControlFlow
 * @property {Function} length - A function returning the number of items
 * waiting to be processed. Invoke like `cargo.length()`.
 * @property {number} payload - An `integer` for determining how many tasks
 * should be process per round. This property can be changed after a `cargo` is
 * created to alter the payload on-the-fly.
 * @property {Function} push - Adds `task` to the `queue`. The callback is
 * called once the `worker` has finished processing the task. Instead of a
 * single task, an array of `tasks` can be submitted. The respective callback is
 * used for every task in the list. Invoke like `cargo.push(task, [callback])`.
 * @property {Function} saturated - A callback that is called when the
 * `queue.length()` hits the concurrency and further tasks will be queued.
 * @property {Function} empty - A callback that is called when the last item
 * from the `queue` is given to a `worker`.
 * @property {Function} drain - A callback that is called when the last item
 * from the `queue` has returned from the `worker`.
 * @property {Function} idle - a function returning false if there are items
 * waiting or being processed, or true if not. Invoke like `cargo.idle()`.
 * @property {Function} pause - a function that pauses the processing of tasks
 * until `resume()` is called. Invoke like `cargo.pause()`.
 * @property {Function} resume - a function that resumes the processing of
 * queued tasks when the queue is paused. Invoke like `cargo.resume()`.
 * @property {Function} kill - a function that removes the `drain` callback and
 * empties remaining tasks from the queue forcing it to go idle. Invoke like `cargo.kill()`.
 */

/**
 * Creates a `cargo` object with the specified payload. Tasks added to the
 * cargo will be processed altogether (up to the `payload` limit). If the
 * `worker` is in progress, the task is queued until it becomes available. Once
 * the `worker` has completed some tasks, each callback of those tasks is
 * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
 * for how `cargo` and `queue` work.
 *
 * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
 * at a time, cargo passes an array of tasks to a single worker, repeating
 * when the worker is finished.
 *
 * @name cargo
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.queue]{@link module:ControlFlow.queue}
 * @category Control Flow
 * @param {AsyncFunction} worker - An asynchronous function for processing an array
 * of queued tasks. Invoked with `(tasks, callback)`.
 * @param {number} [payload=Infinity] - An optional `integer` for determining
 * how many tasks should be processed per round; if omitted, the default is
 * unlimited.
 * @returns {module:ControlFlow.CargoObject} A cargo object to manage the tasks. Callbacks can
 * attached as certain properties to listen for specific events during the
 * lifecycle of the cargo and inner queue.
 * @example
 *
 * // create a cargo object with payload 2
 * var cargo = async.cargo(function(tasks, callback) {
 *     for (var i=0; i<tasks.length; i++) {
 *         console.log('hello ' + tasks[i].name);
 *     }
 *     callback();
 * }, 2);
 *
 * // add some items
 * cargo.push({name: 'foo'}, function(err) {
 *     console.log('finished processing foo');
 * });
 * cargo.push({name: 'bar'}, function(err) {
 *     console.log('finished processing bar');
 * });
 * cargo.push({name: 'baz'}, function(err) {
 *     console.log('finished processing baz');
 * });
 */
function cargo(worker, payload) {
    return queue(worker, 1, payload);
}

/**
 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
 *
 * @name eachOfSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.eachOf]{@link module:Collections.eachOf}
 * @alias forEachOfSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Invoked with (err).
 */
var eachOfSeries = doLimit(eachOfLimit, 1);

/**
 * Reduces `coll` into a single value using an async `iteratee` to return each
 * successive step. `memo` is the initial state of the reduction. This function
 * only operates in series.
 *
 * For performance reasons, it may make sense to split a call to this function
 * into a parallel map, and then use the normal `Array.prototype.reduce` on the
 * results. This function is for situations where each step in the reduction
 * needs to be async; if you can get the data before reducing it, then it's
 * probably a good idea to do so.
 *
 * @name reduce
 * @static
 * @memberOf module:Collections
 * @method
 * @alias inject
 * @alias foldl
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {*} memo - The initial state of the reduction.
 * @param {AsyncFunction} iteratee - A function applied to each item in the
 * array to produce the next step in the reduction.
 * The `iteratee` should complete with the next state of the reduction.
 * If the iteratee complete with an error, the reduction is stopped and the
 * main `callback` is immediately called with the error.
 * Invoked with (memo, item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the reduced value. Invoked with
 * (err, result).
 * @example
 *
 * async.reduce([1,2,3], 0, function(memo, item, callback) {
 *     // pointless async:
 *     process.nextTick(function() {
 *         callback(null, memo + item)
 *     });
 * }, function(err, result) {
 *     // result is now equal to the last value of memo, which is 6
 * });
 */
function reduce(coll, memo, iteratee, callback) {
    callback = once(callback || noop);
    var _iteratee = wrapAsync(iteratee);
    eachOfSeries(coll, function(x, i, callback) {
        _iteratee(memo, x, function(err, v) {
            memo = v;
            callback(err);
        });
    }, function(err) {
        callback(err, memo);
    });
}

/**
 * Version of the compose function that is more natural to read. Each function
 * consumes the return value of the previous function. It is the equivalent of
 * [compose]{@link module:ControlFlow.compose} with the arguments reversed.
 *
 * Each function is executed with the `this` binding of the composed function.
 *
 * @name seq
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.compose]{@link module:ControlFlow.compose}
 * @category Control Flow
 * @param {...AsyncFunction} functions - the asynchronous functions to compose
 * @returns {Function} a function that composes the `functions` in order
 * @example
 *
 * // Requires lodash (or underscore), express3 and dresende's orm2.
 * // Part of an app, that fetches cats of the logged user.
 * // This example uses `seq` function to avoid overnesting and error
 * // handling clutter.
 * app.get('/cats', function(request, response) {
 *     var User = request.models.User;
 *     async.seq(
 *         _.bind(User.get, User),  // 'User.get' has signature (id, callback(err, data))
 *         function(user, fn) {
 *             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
 *         }
 *     )(req.session.user_id, function (err, cats) {
 *         if (err) {
 *             console.error(err);
 *             response.json({ status: 'error', message: err.message });
 *         } else {
 *             response.json({ status: 'ok', message: 'Cats found', data: cats });
 *         }
 *     });
 * });
 */
function seq(/*...functions*/) {
    var _functions = arrayMap(arguments, wrapAsync);
    return function(/*...args*/) {
        var args = slice(arguments);
        var that = this;

        var cb = args[args.length - 1];
        if (typeof cb == 'function') {
            args.pop();
        } else {
            cb = noop;
        }

        reduce(_functions, args, function(newargs, fn, cb) {
            fn.apply(that, newargs.concat(function(err/*, ...nextargs*/) {
                var nextargs = slice(arguments, 1);
                cb(err, nextargs);
            }));
        },
        function(err, results) {
            cb.apply(that, [err].concat(results));
        });
    };
}

/**
 * Creates a function which is a composition of the passed asynchronous
 * functions. Each function consumes the return value of the function that
 * follows. Composing functions `f()`, `g()`, and `h()` would produce the result
 * of `f(g(h()))`, only this version uses callbacks to obtain the return values.
 *
 * Each function is executed with the `this` binding of the composed function.
 *
 * @name compose
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {...AsyncFunction} functions - the asynchronous functions to compose
 * @returns {Function} an asynchronous function that is the composed
 * asynchronous `functions`
 * @example
 *
 * function add1(n, callback) {
 *     setTimeout(function () {
 *         callback(null, n + 1);
 *     }, 10);
 * }
 *
 * function mul3(n, callback) {
 *     setTimeout(function () {
 *         callback(null, n * 3);
 *     }, 10);
 * }
 *
 * var add1mul3 = async.compose(mul3, add1);
 * add1mul3(4, function (err, result) {
 *     // result now equals 15
 * });
 */
var compose = function(/*...args*/) {
    return seq.apply(null, slice(arguments).reverse());
};

var _concat = Array.prototype.concat;

/**
 * The same as [`concat`]{@link module:Collections.concat} but runs a maximum of `limit` async operations at a time.
 *
 * @name concatLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.concat]{@link module:Collections.concat}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
 * which should use an array as its result. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 */
var concatLimit = function(coll, limit, iteratee, callback) {
    callback = callback || noop;
    var _iteratee = wrapAsync(iteratee);
    mapLimit(coll, limit, function(val, callback) {
        _iteratee(val, function(err /*, ...args*/) {
            if (err) return callback(err);
            return callback(null, slice(arguments, 1));
        });
    }, function(err, mapResults) {
        var result = [];
        for (var i = 0; i < mapResults.length; i++) {
            if (mapResults[i]) {
                result = _concat.apply(result, mapResults[i]);
            }
        }

        return callback(err, result);
    });
};

/**
 * Applies `iteratee` to each item in `coll`, concatenating the results. Returns
 * the concatenated list. The `iteratee`s are called in parallel, and the
 * results are concatenated as they return. There is no guarantee that the
 * results array will be returned in the original order of `coll` passed to the
 * `iteratee` function.
 *
 * @name concat
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
 * which should use an array as its result. Invoked with (item, callback).
 * @param {Function} [callback(err)] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 * @example
 *
 * async.concat(['dir1','dir2','dir3'], fs.readdir, function(err, files) {
 *     // files is now a list of filenames that exist in the 3 directories
 * });
 */
var concat = doLimit(concatLimit, Infinity);

/**
 * The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
 *
 * @name concatSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.concat]{@link module:Collections.concat}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`.
 * The iteratee should complete with an array an array of results.
 * Invoked with (item, callback).
 * @param {Function} [callback(err)] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 */
var concatSeries = doLimit(concatLimit, 1);

/**
 * Returns a function that when called, calls-back with the values provided.
 * Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
 * [`auto`]{@link module:ControlFlow.auto}.
 *
 * @name constant
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {...*} arguments... - Any number of arguments to automatically invoke
 * callback with.
 * @returns {AsyncFunction} Returns a function that when invoked, automatically
 * invokes the callback with the previous given arguments.
 * @example
 *
 * async.waterfall([
 *     async.constant(42),
 *     function (value, next) {
 *         // value === 42
 *     },
 *     //...
 * ], callback);
 *
 * async.waterfall([
 *     async.constant(filename, "utf8"),
 *     fs.readFile,
 *     function (fileData, next) {
 *         //...
 *     }
 *     //...
 * ], callback);
 *
 * async.auto({
 *     hostname: async.constant("https://server.net/"),
 *     port: findFreePort,
 *     launchServer: ["hostname", "port", function (options, cb) {
 *         startServer(options, cb);
 *     }],
 *     //...
 * }, callback);
 */
var constant = function(/*...values*/) {
    var values = slice(arguments);
    var args = [null].concat(values);
    return function (/*...ignoredArgs, callback*/) {
        var callback = arguments[arguments.length - 1];
        return callback.apply(this, args);
    };
};

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

function _createTester(check, getResult) {
    return function(eachfn, arr, iteratee, cb) {
        cb = cb || noop;
        var testPassed = false;
        var testResult;
        eachfn(arr, function(value, _, callback) {
            iteratee(value, function(err, result) {
                if (err) {
                    callback(err);
                } else if (check(result) && !testResult) {
                    testPassed = true;
                    testResult = getResult(true, value);
                    callback(null, breakLoop);
                } else {
                    callback();
                }
            });
        }, function(err) {
            if (err) {
                cb(err);
            } else {
                cb(null, testPassed ? testResult : getResult(false));
            }
        });
    };
}

function _findGetResult(v, x) {
    return x;
}

/**
 * Returns the first value in `coll` that passes an async truth test. The
 * `iteratee` is applied in parallel, meaning the first iteratee to return
 * `true` will fire the detect `callback` with that result. That means the
 * result might not be the first item in the original `coll` (in terms of order)
 * that passes the test.

 * If order within the original `coll` is important, then look at
 * [`detectSeries`]{@link module:Collections.detectSeries}.
 *
 * @name detect
 * @static
 * @memberOf module:Collections
 * @method
 * @alias find
 * @category Collections
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee must complete with a boolean value as its result.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 * @example
 *
 * async.detect(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // result now equals the first file in the list that exists
 * });
 */
var detect = doParallel(_createTester(identity, _findGetResult));

/**
 * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name detectLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.detect]{@link module:Collections.detect}
 * @alias findLimit
 * @category Collections
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee must complete with a boolean value as its result.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 */
var detectLimit = doParallelLimit(_createTester(identity, _findGetResult));

/**
 * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
 *
 * @name detectSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.detect]{@link module:Collections.detect}
 * @alias findSeries
 * @category Collections
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee must complete with a boolean value as its result.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 */
var detectSeries = doLimit(detectLimit, 1);

function consoleFunc(name) {
    return function (fn/*, ...args*/) {
        var args = slice(arguments, 1);
        args.push(function (err/*, ...args*/) {
            var args = slice(arguments, 1);
            if (typeof console === 'object') {
                if (err) {
                    if (console.error) {
                        console.error(err);
                    }
                } else if (console[name]) {
                    arrayEach(args, function (x) {
                        console[name](x);
                    });
                }
            }
        });
        wrapAsync(fn).apply(null, args);
    };
}

/**
 * Logs the result of an [`async` function]{@link AsyncFunction} to the
 * `console` using `console.dir` to display the properties of the resulting object.
 * Only works in Node.js or in browsers that support `console.dir` and
 * `console.error` (such as FF and Chrome).
 * If multiple arguments are returned from the async function,
 * `console.dir` is called on each argument in order.
 *
 * @name dir
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {AsyncFunction} function - The function you want to eventually apply
 * all arguments to.
 * @param {...*} arguments... - Any number of arguments to apply to the function.
 * @example
 *
 * // in a module
 * var hello = function(name, callback) {
 *     setTimeout(function() {
 *         callback(null, {hello: name});
 *     }, 1000);
 * };
 *
 * // in the node repl
 * node> async.dir(hello, 'world');
 * {hello: 'world'}
 */
var dir = consoleFunc('dir');

/**
 * The post-check version of [`during`]{@link module:ControlFlow.during}. To reflect the difference in
 * the order of operations, the arguments `test` and `fn` are switched.
 *
 * Also a version of [`doWhilst`]{@link module:ControlFlow.doWhilst} with asynchronous `test` function.
 * @name doDuring
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.during]{@link module:ControlFlow.during}
 * @category Control Flow
 * @param {AsyncFunction} fn - An async function which is called each time
 * `test` passes. Invoked with (callback).
 * @param {AsyncFunction} test - asynchronous truth test to perform before each
 * execution of `fn`. Invoked with (...args, callback), where `...args` are the
 * non-error args from the previous callback of `fn`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error if one occurred, otherwise `null`.
 */
function doDuring(fn, test, callback) {
    callback = onlyOnce(callback || noop);
    var _fn = wrapAsync(fn);
    var _test = wrapAsync(test);

    function next(err/*, ...args*/) {
        if (err) return callback(err);
        var args = slice(arguments, 1);
        args.push(check);
        _test.apply(this, args);
    }

    function check(err, truth) {
        if (err) return callback(err);
        if (!truth) return callback(null);
        _fn(next);
    }

    check(null, true);

}

/**
 * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
 * the order of operations, the arguments `test` and `iteratee` are switched.
 *
 * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
 *
 * @name doWhilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {AsyncFunction} iteratee - A function which is called each time `test`
 * passes. Invoked with (callback).
 * @param {Function} test - synchronous truth test to perform after each
 * execution of `iteratee`. Invoked with any non-error callback results of
 * `iteratee`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped.
 * `callback` will be passed an error and any arguments passed to the final
 * `iteratee`'s callback. Invoked with (err, [results]);
 */
function doWhilst(iteratee, test, callback) {
    callback = onlyOnce(callback || noop);
    var _iteratee = wrapAsync(iteratee);
    var next = function(err/*, ...args*/) {
        if (err) return callback(err);
        var args = slice(arguments, 1);
        if (test.apply(this, args)) return _iteratee(next);
        callback.apply(null, [null].concat(args));
    };
    _iteratee(next);
}

/**
 * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
 * argument ordering differs from `until`.
 *
 * @name doUntil
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
 * @category Control Flow
 * @param {AsyncFunction} iteratee - An async function which is called each time
 * `test` fails. Invoked with (callback).
 * @param {Function} test - synchronous truth test to perform after each
 * execution of `iteratee`. Invoked with any non-error callback results of
 * `iteratee`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has passed and repeated execution of `iteratee` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `iteratee`'s
 * callback. Invoked with (err, [results]);
 */
function doUntil(iteratee, test, callback) {
    doWhilst(iteratee, function() {
        return !test.apply(this, arguments);
    }, callback);
}

/**
 * Like [`whilst`]{@link module:ControlFlow.whilst}, except the `test` is an asynchronous function that
 * is passed a callback in the form of `function (err, truth)`. If error is
 * passed to `test` or `fn`, the main callback is immediately called with the
 * value of the error.
 *
 * @name during
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {AsyncFunction} test - asynchronous truth test to perform before each
 * execution of `fn`. Invoked with (callback).
 * @param {AsyncFunction} fn - An async function which is called each time
 * `test` passes. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error, if one occurred, otherwise `null`.
 * @example
 *
 * var count = 0;
 *
 * async.during(
 *     function (callback) {
 *         return callback(null, count < 5);
 *     },
 *     function (callback) {
 *         count++;
 *         setTimeout(callback, 1000);
 *     },
 *     function (err) {
 *         // 5 seconds have passed
 *     }
 * );
 */
function during(test, fn, callback) {
    callback = onlyOnce(callback || noop);
    var _fn = wrapAsync(fn);
    var _test = wrapAsync(test);

    function next(err) {
        if (err) return callback(err);
        _test(check);
    }

    function check(err, truth) {
        if (err) return callback(err);
        if (!truth) return callback(null);
        _fn(next);
    }

    _test(check);
}

function _withoutIndex(iteratee) {
    return function (value, index, callback) {
        return iteratee(value, callback);
    };
}

/**
 * Applies the function `iteratee` to each item in `coll`, in parallel.
 * The `iteratee` is called with an item from the list, and a callback for when
 * it has finished. If the `iteratee` passes an error to its `callback`, the
 * main `callback` (for the `each` function) is immediately called with the
 * error.
 *
 * Note, that since this function applies `iteratee` to each item in parallel,
 * there is no guarantee that the iteratee functions will complete in order.
 *
 * @name each
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEach
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to
 * each item in `coll`. Invoked with (item, callback).
 * The array index is not passed to the iteratee.
 * If you need the index, use `eachOf`.
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @example
 *
 * // assuming openFiles is an array of file names and saveFile is a function
 * // to save the modified contents of that file:
 *
 * async.each(openFiles, saveFile, function(err){
 *   // if any of the saves produced an error, err would equal that error
 * });
 *
 * // assuming openFiles is an array of file names
 * async.each(openFiles, function(file, callback) {
 *
 *     // Perform operation on file here.
 *     console.log('Processing file ' + file);
 *
 *     if( file.length > 32 ) {
 *       console.log('This file name is too long');
 *       callback('File name too long');
 *     } else {
 *       // Do work to process file here
 *       console.log('File processed');
 *       callback();
 *     }
 * }, function(err) {
 *     // if any of the file processing produced an error, err would equal that error
 *     if( err ) {
 *       // One of the iterations produced an error.
 *       // All processing will now stop.
 *       console.log('A file failed to process');
 *     } else {
 *       console.log('All files have been processed successfully');
 *     }
 * });
 */
function eachLimit(coll, iteratee, callback) {
    eachOf(coll, _withoutIndex(wrapAsync(iteratee)), callback);
}

/**
 * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
 *
 * @name eachLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The array index is not passed to the iteratee.
 * If you need the index, use `eachOfLimit`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
function eachLimit$1(coll, limit, iteratee, callback) {
    _eachOfLimit(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
}

/**
 * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
 *
 * @name eachSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each
 * item in `coll`.
 * The array index is not passed to the iteratee.
 * If you need the index, use `eachOfSeries`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
var eachSeries = doLimit(eachLimit$1, 1);

/**
 * Wrap an async function and ensure it calls its callback on a later tick of
 * the event loop.  If the function already calls its callback on a next tick,
 * no extra deferral is added. This is useful for preventing stack overflows
 * (`RangeError: Maximum call stack size exceeded`) and generally keeping
 * [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
 * contained. ES2017 `async` functions are returned as-is -- they are immune
 * to Zalgo's corrupting influences, as they always resolve on a later tick.
 *
 * @name ensureAsync
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {AsyncFunction} fn - an async function, one that expects a node-style
 * callback as its last argument.
 * @returns {AsyncFunction} Returns a wrapped function with the exact same call
 * signature as the function passed in.
 * @example
 *
 * function sometimesAsync(arg, callback) {
 *     if (cache[arg]) {
 *         return callback(null, cache[arg]); // this would be synchronous!!
 *     } else {
 *         doSomeIO(arg, callback); // this IO would be asynchronous
 *     }
 * }
 *
 * // this has a risk of stack overflows if many results are cached in a row
 * async.mapSeries(args, sometimesAsync, done);
 *
 * // this will defer sometimesAsync's callback if necessary,
 * // preventing stack overflows
 * async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
 */
function ensureAsync(fn) {
    if (isAsync(fn)) return fn;
    return initialParams(function (args, callback) {
        var sync = true;
        args.push(function () {
            var innerArgs = arguments;
            if (sync) {
                setImmediate$1(function () {
                    callback.apply(null, innerArgs);
                });
            } else {
                callback.apply(null, innerArgs);
            }
        });
        fn.apply(this, args);
        sync = false;
    });
}

function notId(v) {
    return !v;
}

/**
 * Returns `true` if every element in `coll` satisfies an async test. If any
 * iteratee call returns `false`, the main `callback` is immediately called.
 *
 * @name every
 * @static
 * @memberOf module:Collections
 * @method
 * @alias all
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collection in parallel.
 * The iteratee must complete with a boolean result value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 * @example
 *
 * async.every(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // if result is true then every file exists
 * });
 */
var every = doParallel(_createTester(notId, notId));

/**
 * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
 *
 * @name everyLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.every]{@link module:Collections.every}
 * @alias allLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collection in parallel.
 * The iteratee must complete with a boolean result value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 */
var everyLimit = doParallelLimit(_createTester(notId, notId));

/**
 * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
 *
 * @name everySeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.every]{@link module:Collections.every}
 * @alias allSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collection in series.
 * The iteratee must complete with a boolean result value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 */
var everySeries = doLimit(everyLimit, 1);

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

function filterArray(eachfn, arr, iteratee, callback) {
    var truthValues = new Array(arr.length);
    eachfn(arr, function (x, index, callback) {
        iteratee(x, function (err, v) {
            truthValues[index] = !!v;
            callback(err);
        });
    }, function (err) {
        if (err) return callback(err);
        var results = [];
        for (var i = 0; i < arr.length; i++) {
            if (truthValues[i]) results.push(arr[i]);
        }
        callback(null, results);
    });
}

function filterGeneric(eachfn, coll, iteratee, callback) {
    var results = [];
    eachfn(coll, function (x, index, callback) {
        iteratee(x, function (err, v) {
            if (err) {
                callback(err);
            } else {
                if (v) {
                    results.push({index: index, value: x});
                }
                callback();
            }
        });
    }, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, arrayMap(results.sort(function (a, b) {
                return a.index - b.index;
            }), baseProperty('value')));
        }
    });
}

function _filter(eachfn, coll, iteratee, callback) {
    var filter = isArrayLike(coll) ? filterArray : filterGeneric;
    filter(eachfn, coll, wrapAsync(iteratee), callback || noop);
}

/**
 * Returns a new array of all the values in `coll` which pass an async truth
 * test. This operation is performed in parallel, but the results array will be
 * in the same order as the original.
 *
 * @name filter
 * @static
 * @memberOf module:Collections
 * @method
 * @alias select
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @example
 *
 * async.filter(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, results) {
 *     // results now equals an array of the existing files
 * });
 */
var filter = doParallel(_filter);

/**
 * The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name filterLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @alias selectLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 */
var filterLimit = doParallelLimit(_filter);

/**
 * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
 *
 * @name filterSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @alias selectSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results)
 */
var filterSeries = doLimit(filterLimit, 1);

/**
 * Calls the asynchronous function `fn` with a callback parameter that allows it
 * to call itself again, in series, indefinitely.

 * If an error is passed to the callback then `errback` is called with the
 * error, and execution stops, otherwise it will never be called.
 *
 * @name forever
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {AsyncFunction} fn - an async function to call repeatedly.
 * Invoked with (next).
 * @param {Function} [errback] - when `fn` passes an error to it's callback,
 * this function will be called, and execution stops. Invoked with (err).
 * @example
 *
 * async.forever(
 *     function(next) {
 *         // next is suitable for passing to things that need a callback(err [, whatever]);
 *         // it will result in this function being called again.
 *     },
 *     function(err) {
 *         // if next is called with a value in its first parameter, it will appear
 *         // in here as 'err', and execution will stop.
 *     }
 * );
 */
function forever(fn, errback) {
    var done = onlyOnce(errback || noop);
    var task = wrapAsync(ensureAsync(fn));

    function next(err) {
        if (err) return done(err);
        task(next);
    }
    next();
}

/**
 * The same as [`groupBy`]{@link module:Collections.groupBy} but runs a maximum of `limit` async operations at a time.
 *
 * @name groupByLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.groupBy]{@link module:Collections.groupBy}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with a `key` to group the value under.
 * Invoked with (value, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Result is an `Object` whoses
 * properties are arrays of values which returned the corresponding key.
 */
var groupByLimit = function(coll, limit, iteratee, callback) {
    callback = callback || noop;
    var _iteratee = wrapAsync(iteratee);
    mapLimit(coll, limit, function(val, callback) {
        _iteratee(val, function(err, key) {
            if (err) return callback(err);
            return callback(null, {key: key, val: val});
        });
    }, function(err, mapResults) {
        var result = {};
        // from MDN, handle object having an `hasOwnProperty` prop
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        for (var i = 0; i < mapResults.length; i++) {
            if (mapResults[i]) {
                var key = mapResults[i].key;
                var val = mapResults[i].val;

                if (hasOwnProperty.call(result, key)) {
                    result[key].push(val);
                } else {
                    result[key] = [val];
                }
            }
        }

        return callback(err, result);
    });
};

/**
 * Returns a new object, where each value corresponds to an array of items, from
 * `coll`, that returned the corresponding key. That is, the keys of the object
 * correspond to the values passed to the `iteratee` callback.
 *
 * Note: Since this function applies the `iteratee` to each item in parallel,
 * there is no guarantee that the `iteratee` functions will complete in order.
 * However, the values for each key in the `result` will be in the same order as
 * the original `coll`. For Objects, the values will roughly be in the order of
 * the original Objects' keys (but this can vary across JavaScript engines).
 *
 * @name groupBy
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with a `key` to group the value under.
 * Invoked with (value, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Result is an `Object` whoses
 * properties are arrays of values which returned the corresponding key.
 * @example
 *
 * async.groupBy(['userId1', 'userId2', 'userId3'], function(userId, callback) {
 *     db.findById(userId, function(err, user) {
 *         if (err) return callback(err);
 *         return callback(null, user.age);
 *     });
 * }, function(err, result) {
 *     // result is object containing the userIds grouped by age
 *     // e.g. { 30: ['userId1', 'userId3'], 42: ['userId2']};
 * });
 */
var groupBy = doLimit(groupByLimit, Infinity);

/**
 * The same as [`groupBy`]{@link module:Collections.groupBy} but runs only a single async operation at a time.
 *
 * @name groupBySeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.groupBy]{@link module:Collections.groupBy}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with a `key` to group the value under.
 * Invoked with (value, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Result is an `Object` whoses
 * properties are arrays of values which returned the corresponding key.
 */
var groupBySeries = doLimit(groupByLimit, 1);

/**
 * Logs the result of an `async` function to the `console`. Only works in
 * Node.js or in browsers that support `console.log` and `console.error` (such
 * as FF and Chrome). If multiple arguments are returned from the async
 * function, `console.log` is called on each argument in order.
 *
 * @name log
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {AsyncFunction} function - The function you want to eventually apply
 * all arguments to.
 * @param {...*} arguments... - Any number of arguments to apply to the function.
 * @example
 *
 * // in a module
 * var hello = function(name, callback) {
 *     setTimeout(function() {
 *         callback(null, 'hello ' + name);
 *     }, 1000);
 * };
 *
 * // in the node repl
 * node> async.log(hello, 'world');
 * 'hello world'
 */
var log = consoleFunc('log');

/**
 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name mapValuesLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.mapValues]{@link module:Collections.mapValues}
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - A function to apply to each value and key
 * in `coll`.
 * The iteratee should complete with the transformed value as its result.
 * Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 */
function mapValuesLimit(obj, limit, iteratee, callback) {
    callback = once(callback || noop);
    var newObj = {};
    var _iteratee = wrapAsync(iteratee);
    eachOfLimit(obj, limit, function(val, key, next) {
        _iteratee(val, key, function (err, result) {
            if (err) return next(err);
            newObj[key] = result;
            next();
        });
    }, function (err) {
        callback(err, newObj);
    });
}

/**
 * A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
 *
 * Produces a new Object by mapping each value of `obj` through the `iteratee`
 * function. The `iteratee` is called each `value` and `key` from `obj` and a
 * callback for when it has finished processing. Each of these callbacks takes
 * two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
 * passes an error to its callback, the main `callback` (for the `mapValues`
 * function) is immediately called with the error.
 *
 * Note, the order of the keys in the result is not guaranteed.  The keys will
 * be roughly in the order they complete, (but this is very engine-specific)
 *
 * @name mapValues
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each value and key
 * in `coll`.
 * The iteratee should complete with the transformed value as its result.
 * Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 * @example
 *
 * async.mapValues({
 *     f1: 'file1',
 *     f2: 'file2',
 *     f3: 'file3'
 * }, function (file, key, callback) {
 *   fs.stat(file, callback);
 * }, function(err, result) {
 *     // result is now a map of stats for each file, e.g.
 *     // {
 *     //     f1: [stats for file1],
 *     //     f2: [stats for file2],
 *     //     f3: [stats for file3]
 *     // }
 * });
 */

var mapValues = doLimit(mapValuesLimit, Infinity);

/**
 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
 *
 * @name mapValuesSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.mapValues]{@link module:Collections.mapValues}
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each value and key
 * in `coll`.
 * The iteratee should complete with the transformed value as its result.
 * Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 */
var mapValuesSeries = doLimit(mapValuesLimit, 1);

function has(obj, key) {
    return key in obj;
}

/**
 * Caches the results of an async function. When creating a hash to store
 * function results against, the callback is omitted from the hash and an
 * optional hash function can be used.
 *
 * If no hash function is specified, the first argument is used as a hash key,
 * which may work reasonably if it is a string or a data type that converts to a
 * distinct string. Note that objects and arrays will not behave reasonably.
 * Neither will cases where the other arguments are significant. In such cases,
 * specify your own hash function.
 *
 * The cache of results is exposed as the `memo` property of the function
 * returned by `memoize`.
 *
 * @name memoize
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {AsyncFunction} fn - The async function to proxy and cache results from.
 * @param {Function} hasher - An optional function for generating a custom hash
 * for storing results. It has all the arguments applied to it apart from the
 * callback, and must be synchronous.
 * @returns {AsyncFunction} a memoized version of `fn`
 * @example
 *
 * var slow_fn = function(name, callback) {
 *     // do something
 *     callback(null, result);
 * };
 * var fn = async.memoize(slow_fn);
 *
 * // fn can now be used as if it were slow_fn
 * fn('some name', function() {
 *     // callback
 * });
 */
function memoize(fn, hasher) {
    var memo = Object.create(null);
    var queues = Object.create(null);
    hasher = hasher || identity;
    var _fn = wrapAsync(fn);
    var memoized = initialParams(function memoized(args, callback) {
        var key = hasher.apply(null, args);
        if (has(memo, key)) {
            setImmediate$1(function() {
                callback.apply(null, memo[key]);
            });
        } else if (has(queues, key)) {
            queues[key].push(callback);
        } else {
            queues[key] = [callback];
            _fn.apply(null, args.concat(function(/*args*/) {
                var args = slice(arguments);
                memo[key] = args;
                var q = queues[key];
                delete queues[key];
                for (var i = 0, l = q.length; i < l; i++) {
                    q[i].apply(null, args);
                }
            }));
        }
    });
    memoized.memo = memo;
    memoized.unmemoized = fn;
    return memoized;
}

/**
 * Calls `callback` on a later loop around the event loop. In Node.js this just
 * calls `process.nextTick`.  In the browser it will use `setImmediate` if
 * available, otherwise `setTimeout(callback, 0)`, which means other higher
 * priority events may precede the execution of `callback`.
 *
 * This is used internally for browser-compatibility purposes.
 *
 * @name nextTick
 * @static
 * @memberOf module:Utils
 * @method
 * @see [async.setImmediate]{@link module:Utils.setImmediate}
 * @category Util
 * @param {Function} callback - The function to call on a later loop around
 * the event loop. Invoked with (args...).
 * @param {...*} args... - any number of additional arguments to pass to the
 * callback on the next tick.
 * @example
 *
 * var call_order = [];
 * async.nextTick(function() {
 *     call_order.push('two');
 *     // call_order now equals ['one','two']
 * });
 * call_order.push('one');
 *
 * async.setImmediate(function (a, b, c) {
 *     // a, b, and c equal 1, 2, and 3
 * }, 1, 2, 3);
 */
var _defer$1;

if (hasNextTick) {
    _defer$1 = process.nextTick;
} else if (hasSetImmediate) {
    _defer$1 = setImmediate;
} else {
    _defer$1 = fallback;
}

var nextTick = wrap(_defer$1);

function _parallel(eachfn, tasks, callback) {
    callback = callback || noop;
    var results = isArrayLike(tasks) ? [] : {};

    eachfn(tasks, function (task, key, callback) {
        wrapAsync(task)(function (err, result) {
            if (arguments.length > 2) {
                result = slice(arguments, 1);
            }
            results[key] = result;
            callback(err);
        });
    }, function (err) {
        callback(err, results);
    });
}

/**
 * Run the `tasks` collection of functions in parallel, without waiting until
 * the previous function has completed. If any of the functions pass an error to
 * its callback, the main `callback` is immediately called with the value of the
 * error. Once the `tasks` have completed, the results are passed to the final
 * `callback` as an array.
 *
 * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
 * parallel execution of code.  If your tasks do not use any timers or perform
 * any I/O, they will actually be executed in series.  Any synchronous setup
 * sections for each task will happen one after the other.  JavaScript remains
 * single-threaded.
 *
 * **Hint:** Use [`reflect`]{@link module:Utils.reflect} to continue the
 * execution of other tasks when a task fails.
 *
 * It is also possible to use an object instead of an array. Each property will
 * be run as a function and the results will be passed to the final `callback`
 * as an object instead of an array. This can be a more readable way of handling
 * results from {@link async.parallel}.
 *
 * @name parallel
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection of
 * [async functions]{@link AsyncFunction} to run.
 * Each async function can complete with any number of optional `result` values.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
 *
 * @example
 * async.parallel([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     // the results array will equal ['one','two'] even though
 *     // the second function had a shorter timeout.
 * });
 *
 * // an example using an object instead of an array
 * async.parallel({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }, function(err, results) {
 *     // results is now equals to: {one: 1, two: 2}
 * });
 */
function parallelLimit(tasks, callback) {
    _parallel(eachOf, tasks, callback);
}

/**
 * The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name parallelLimit
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.parallel]{@link module:ControlFlow.parallel}
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection of
 * [async functions]{@link AsyncFunction} to run.
 * Each async function can complete with any number of optional `result` values.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
 */
function parallelLimit$1(tasks, limit, callback) {
    _parallel(_eachOfLimit(limit), tasks, callback);
}

/**
 * A queue of tasks for the worker function to complete.
 * @typedef {Object} QueueObject
 * @memberOf module:ControlFlow
 * @property {Function} length - a function returning the number of items
 * waiting to be processed. Invoke with `queue.length()`.
 * @property {boolean} started - a boolean indicating whether or not any
 * items have been pushed and processed by the queue.
 * @property {Function} running - a function returning the number of items
 * currently being processed. Invoke with `queue.running()`.
 * @property {Function} workersList - a function returning the array of items
 * currently being processed. Invoke with `queue.workersList()`.
 * @property {Function} idle - a function returning false if there are items
 * waiting or being processed, or true if not. Invoke with `queue.idle()`.
 * @property {number} concurrency - an integer for determining how many `worker`
 * functions should be run in parallel. This property can be changed after a
 * `queue` is created to alter the concurrency on-the-fly.
 * @property {Function} push - add a new task to the `queue`. Calls `callback`
 * once the `worker` has finished processing the task. Instead of a single task,
 * a `tasks` array can be submitted. The respective callback is used for every
 * task in the list. Invoke with `queue.push(task, [callback])`,
 * @property {Function} unshift - add a new task to the front of the `queue`.
 * Invoke with `queue.unshift(task, [callback])`.
 * @property {Function} remove - remove items from the queue that match a test
 * function.  The test function will be passed an object with a `data` property,
 * and a `priority` property, if this is a
 * [priorityQueue]{@link module:ControlFlow.priorityQueue} object.
 * Invoked with `queue.remove(testFn)`, where `testFn` is of the form
 * `function ({data, priority}) {}` and returns a Boolean.
 * @property {Function} saturated - a callback that is called when the number of
 * running workers hits the `concurrency` limit, and further tasks will be
 * queued.
 * @property {Function} unsaturated - a callback that is called when the number
 * of running workers is less than the `concurrency` & `buffer` limits, and
 * further tasks will not be queued.
 * @property {number} buffer - A minimum threshold buffer in order to say that
 * the `queue` is `unsaturated`.
 * @property {Function} empty - a callback that is called when the last item
 * from the `queue` is given to a `worker`.
 * @property {Function} drain - a callback that is called when the last item
 * from the `queue` has returned from the `worker`.
 * @property {Function} error - a callback that is called when a task errors.
 * Has the signature `function(error, task)`.
 * @property {boolean} paused - a boolean for determining whether the queue is
 * in a paused state.
 * @property {Function} pause - a function that pauses the processing of tasks
 * until `resume()` is called. Invoke with `queue.pause()`.
 * @property {Function} resume - a function that resumes the processing of
 * queued tasks when the queue is paused. Invoke with `queue.resume()`.
 * @property {Function} kill - a function that removes the `drain` callback and
 * empties remaining tasks from the queue forcing it to go idle. No more tasks
 * should be pushed to the queue after calling this function. Invoke with `queue.kill()`.
 */

/**
 * Creates a `queue` object with the specified `concurrency`. Tasks added to the
 * `queue` are processed in parallel (up to the `concurrency` limit). If all
 * `worker`s are in progress, the task is queued until one becomes available.
 * Once a `worker` completes a `task`, that `task`'s callback is called.
 *
 * @name queue
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {AsyncFunction} worker - An async function for processing a queued task.
 * If you want to handle errors from an individual task, pass a callback to
 * `q.push()`. Invoked with (task, callback).
 * @param {number} [concurrency=1] - An `integer` for determining how many
 * `worker` functions should be run in parallel.  If omitted, the concurrency
 * defaults to `1`.  If the concurrency is `0`, an error is thrown.
 * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can
 * attached as certain properties to listen for specific events during the
 * lifecycle of the queue.
 * @example
 *
 * // create a queue object with concurrency 2
 * var q = async.queue(function(task, callback) {
 *     console.log('hello ' + task.name);
 *     callback();
 * }, 2);
 *
 * // assign a callback
 * q.drain = function() {
 *     console.log('all items have been processed');
 * };
 *
 * // add some items to the queue
 * q.push({name: 'foo'}, function(err) {
 *     console.log('finished processing foo');
 * });
 * q.push({name: 'bar'}, function (err) {
 *     console.log('finished processing bar');
 * });
 *
 * // add some items to the queue (batch-wise)
 * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
 *     console.log('finished processing item');
 * });
 *
 * // add some items to the front of the queue
 * q.unshift({name: 'bar'}, function (err) {
 *     console.log('finished processing bar');
 * });
 */
var queue$1 = function (worker, concurrency) {
    var _worker = wrapAsync(worker);
    return queue(function (items, cb) {
        _worker(items[0], cb);
    }, concurrency, 1);
};

/**
 * The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
 * completed in ascending priority order.
 *
 * @name priorityQueue
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.queue]{@link module:ControlFlow.queue}
 * @category Control Flow
 * @param {AsyncFunction} worker - An async function for processing a queued task.
 * If you want to handle errors from an individual task, pass a callback to
 * `q.push()`.
 * Invoked with (task, callback).
 * @param {number} concurrency - An `integer` for determining how many `worker`
 * functions should be run in parallel.  If omitted, the concurrency defaults to
 * `1`.  If the concurrency is `0`, an error is thrown.
 * @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are two
 * differences between `queue` and `priorityQueue` objects:
 * * `push(task, priority, [callback])` - `priority` should be a number. If an
 *   array of `tasks` is given, all tasks will be assigned the same priority.
 * * The `unshift` method was removed.
 */
var priorityQueue = function(worker, concurrency) {
    // Start with a normal queue
    var q = queue$1(worker, concurrency);

    // Override push to accept second parameter representing priority
    q.push = function(data, priority, callback) {
        if (callback == null) callback = noop;
        if (typeof callback !== 'function') {
            throw new Error('task callback must be a function');
        }
        q.started = true;
        if (!isArray(data)) {
            data = [data];
        }
        if (data.length === 0) {
            // call drain immediately if there are no tasks
            return setImmediate$1(function() {
                q.drain();
            });
        }

        priority = priority || 0;
        var nextNode = q._tasks.head;
        while (nextNode && priority >= nextNode.priority) {
            nextNode = nextNode.next;
        }

        for (var i = 0, l = data.length; i < l; i++) {
            var item = {
                data: data[i],
                priority: priority,
                callback: callback
            };

            if (nextNode) {
                q._tasks.insertBefore(nextNode, item);
            } else {
                q._tasks.push(item);
            }
        }
        setImmediate$1(q.process);
    };

    // Remove unshift function
    delete q.unshift;

    return q;
};

/**
 * Runs the `tasks` array of functions in parallel, without waiting until the
 * previous function has completed. Once any of the `tasks` complete or pass an
 * error to its callback, the main `callback` is immediately called. It's
 * equivalent to `Promise.race()`.
 *
 * @name race
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array containing [async functions]{@link AsyncFunction}
 * to run. Each function can complete with an optional `result` value.
 * @param {Function} callback - A callback to run once any of the functions have
 * completed. This function gets an error or result from the first function that
 * completed. Invoked with (err, result).
 * @returns undefined
 * @example
 *
 * async.race([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ],
 * // main callback
 * function(err, result) {
 *     // the result will be equal to 'two' as it finishes earlier
 * });
 */
function race(tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new TypeError('First argument to race must be an array of functions'));
    if (!tasks.length) return callback();
    for (var i = 0, l = tasks.length; i < l; i++) {
        wrapAsync(tasks[i])(callback);
    }
}

/**
 * Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
 *
 * @name reduceRight
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reduce]{@link module:Collections.reduce}
 * @alias foldr
 * @category Collection
 * @param {Array} array - A collection to iterate over.
 * @param {*} memo - The initial state of the reduction.
 * @param {AsyncFunction} iteratee - A function applied to each item in the
 * array to produce the next step in the reduction.
 * The `iteratee` should complete with the next state of the reduction.
 * If the iteratee complete with an error, the reduction is stopped and the
 * main `callback` is immediately called with the error.
 * Invoked with (memo, item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the reduced value. Invoked with
 * (err, result).
 */
function reduceRight (array, memo, iteratee, callback) {
    var reversed = slice(array).reverse();
    reduce(reversed, memo, iteratee, callback);
}

/**
 * Wraps the async function in another function that always completes with a
 * result object, even when it errors.
 *
 * The result object has either the property `error` or `value`.
 *
 * @name reflect
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {AsyncFunction} fn - The async function you want to wrap
 * @returns {Function} - A function that always passes null to it's callback as
 * the error. The second argument to the callback will be an `object` with
 * either an `error` or a `value` property.
 * @example
 *
 * async.parallel([
 *     async.reflect(function(callback) {
 *         // do some stuff ...
 *         callback(null, 'one');
 *     }),
 *     async.reflect(function(callback) {
 *         // do some more stuff but error ...
 *         callback('bad stuff happened');
 *     }),
 *     async.reflect(function(callback) {
 *         // do some more stuff ...
 *         callback(null, 'two');
 *     })
 * ],
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results[0].value = 'one'
 *     // results[1].error = 'bad stuff happened'
 *     // results[2].value = 'two'
 * });
 */
function reflect(fn) {
    var _fn = wrapAsync(fn);
    return initialParams(function reflectOn(args, reflectCallback) {
        args.push(function callback(error, cbArg) {
            if (error) {
                reflectCallback(null, { error: error });
            } else {
                var value;
                if (arguments.length <= 2) {
                    value = cbArg;
                } else {
                    value = slice(arguments, 1);
                }
                reflectCallback(null, { value: value });
            }
        });

        return _fn.apply(this, args);
    });
}

/**
 * A helper function that wraps an array or an object of functions with `reflect`.
 *
 * @name reflectAll
 * @static
 * @memberOf module:Utils
 * @method
 * @see [async.reflect]{@link module:Utils.reflect}
 * @category Util
 * @param {Array|Object|Iterable} tasks - The collection of
 * [async functions]{@link AsyncFunction} to wrap in `async.reflect`.
 * @returns {Array} Returns an array of async functions, each wrapped in
 * `async.reflect`
 * @example
 *
 * let tasks = [
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         // do some more stuff but error ...
 *         callback(new Error('bad stuff happened'));
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ];
 *
 * async.parallel(async.reflectAll(tasks),
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results[0].value = 'one'
 *     // results[1].error = Error('bad stuff happened')
 *     // results[2].value = 'two'
 * });
 *
 * // an example using an object instead of an array
 * let tasks = {
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         callback('two');
 *     },
 *     three: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'three');
 *         }, 100);
 *     }
 * };
 *
 * async.parallel(async.reflectAll(tasks),
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results.one.value = 'one'
 *     // results.two.error = 'two'
 *     // results.three.value = 'three'
 * });
 */
function reflectAll(tasks) {
    var results;
    if (isArray(tasks)) {
        results = arrayMap(tasks, reflect);
    } else {
        results = {};
        baseForOwn(tasks, function(task, key) {
            results[key] = reflect.call(this, task);
        });
    }
    return results;
}

function reject$1(eachfn, arr, iteratee, callback) {
    _filter(eachfn, arr, function(value, cb) {
        iteratee(value, function(err, v) {
            cb(err, !v);
        });
    }, callback);
}

/**
 * The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
 *
 * @name reject
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - An async truth test to apply to each item in
 * `coll`.
 * The should complete with a boolean value as its `result`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @example
 *
 * async.reject(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, results) {
 *     // results now equals an array of missing files
 *     createFiles(results);
 * });
 */
var reject = doParallel(reject$1);

/**
 * The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name rejectLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reject]{@link module:Collections.reject}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - An async truth test to apply to each item in
 * `coll`.
 * The should complete with a boolean value as its `result`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 */
var rejectLimit = doParallelLimit(reject$1);

/**
 * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
 *
 * @name rejectSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reject]{@link module:Collections.reject}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - An async truth test to apply to each item in
 * `coll`.
 * The should complete with a boolean value as its `result`.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 */
var rejectSeries = doLimit(rejectLimit, 1);

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant$1(value) {
  return function() {
    return value;
  };
}

/**
 * Attempts to get a successful response from `task` no more than `times` times
 * before returning an error. If the task is successful, the `callback` will be
 * passed the result of the successful task. If all attempts fail, the callback
 * will be passed the error and result (if any) of the final attempt.
 *
 * @name retry
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @see [async.retryable]{@link module:ControlFlow.retryable}
 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
 * object with `times` and `interval` or a number.
 * * `times` - The number of attempts to make before giving up.  The default
 *   is `5`.
 * * `interval` - The time to wait between retries, in milliseconds.  The
 *   default is `0`. The interval may also be specified as a function of the
 *   retry count (see example).
 * * `errorFilter` - An optional synchronous function that is invoked on
 *   erroneous result. If it returns `true` the retry attempts will continue;
 *   if the function returns `false` the retry flow is aborted with the current
 *   attempt's error and result being returned to the final callback.
 *   Invoked with (err).
 * * If `opts` is a number, the number specifies the number of times to retry,
 *   with the default interval of `0`.
 * @param {AsyncFunction} task - An async function to retry.
 * Invoked with (callback).
 * @param {Function} [callback] - An optional callback which is called when the
 * task has succeeded, or after the final failed attempt. It receives the `err`
 * and `result` arguments of the last attempt at completing the `task`. Invoked
 * with (err, results).
 *
 * @example
 *
 * // The `retry` function can be used as a stand-alone control flow by passing
 * // a callback, as shown below:
 *
 * // try calling apiMethod 3 times
 * async.retry(3, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 3 times, waiting 200 ms between each retry
 * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 10 times with exponential backoff
 * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
 * async.retry({
 *   times: 10,
 *   interval: function(retryCount) {
 *     return 50 * Math.pow(2, retryCount);
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod the default 5 times no delay between each retry
 * async.retry(apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod only when error condition satisfies, all other
 * // errors will abort the retry control flow and return to final callback
 * async.retry({
 *   errorFilter: function(err) {
 *     return err.message === 'Temporary error'; // only retry on a specific error
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // to retry individual methods that are not as reliable within other
 * // control flow functions, use the `retryable` wrapper:
 * async.auto({
 *     users: api.getUsers.bind(api),
 *     payments: async.retryable(3, api.getPayments.bind(api))
 * }, function(err, results) {
 *     // do something with the results
 * });
 *
 */
function retry(opts, task, callback) {
    var DEFAULT_TIMES = 5;
    var DEFAULT_INTERVAL = 0;

    var options = {
        times: DEFAULT_TIMES,
        intervalFunc: constant$1(DEFAULT_INTERVAL)
    };

    function parseTimes(acc, t) {
        if (typeof t === 'object') {
            acc.times = +t.times || DEFAULT_TIMES;

            acc.intervalFunc = typeof t.interval === 'function' ?
                t.interval :
                constant$1(+t.interval || DEFAULT_INTERVAL);

            acc.errorFilter = t.errorFilter;
        } else if (typeof t === 'number' || typeof t === 'string') {
            acc.times = +t || DEFAULT_TIMES;
        } else {
            throw new Error("Invalid arguments for async.retry");
        }
    }

    if (arguments.length < 3 && typeof opts === 'function') {
        callback = task || noop;
        task = opts;
    } else {
        parseTimes(options, opts);
        callback = callback || noop;
    }

    if (typeof task !== 'function') {
        throw new Error("Invalid arguments for async.retry");
    }

    var _task = wrapAsync(task);

    var attempt = 1;
    function retryAttempt() {
        _task(function(err) {
            if (err && attempt++ < options.times &&
                (typeof options.errorFilter != 'function' ||
                    options.errorFilter(err))) {
                setTimeout(retryAttempt, options.intervalFunc(attempt));
            } else {
                callback.apply(null, arguments);
            }
        });
    }

    retryAttempt();
}

/**
 * A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method
 * wraps a task and makes it retryable, rather than immediately calling it
 * with retries.
 *
 * @name retryable
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.retry]{@link module:ControlFlow.retry}
 * @category Control Flow
 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
 * options, exactly the same as from `retry`
 * @param {AsyncFunction} task - the asynchronous function to wrap.
 * This function will be passed any arguments passed to the returned wrapper.
 * Invoked with (...args, callback).
 * @returns {AsyncFunction} The wrapped function, which when invoked, will
 * retry on an error, based on the parameters specified in `opts`.
 * This function will accept the same parameters as `task`.
 * @example
 *
 * async.auto({
 *     dep1: async.retryable(3, getFromFlakyService),
 *     process: ["dep1", async.retryable(3, function (results, cb) {
 *         maybeProcessData(results.dep1, cb);
 *     })]
 * }, callback);
 */
var retryable = function (opts, task) {
    if (!task) {
        task = opts;
        opts = null;
    }
    var _task = wrapAsync(task);
    return initialParams(function (args, callback) {
        function taskFn(cb) {
            _task.apply(null, args.concat(cb));
        }

        if (opts) retry(opts, taskFn, callback);
        else retry(taskFn, callback);

    });
};

/**
 * Run the functions in the `tasks` collection in series, each one running once
 * the previous function has completed. If any functions in the series pass an
 * error to its callback, no more functions are run, and `callback` is
 * immediately called with the value of the error. Otherwise, `callback`
 * receives an array of results when `tasks` have completed.
 *
 * It is also possible to use an object instead of an array. Each property will
 * be run as a function, and the results will be passed to the final `callback`
 * as an object instead of an array. This can be a more readable way of handling
 *  results from {@link async.series}.
 *
 * **Note** that while many implementations preserve the order of object
 * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
 * explicitly states that
 *
 * > The mechanics and order of enumerating the properties is not specified.
 *
 * So if you rely on the order in which your series of functions are executed,
 * and want this to work on all platforms, consider using an array.
 *
 * @name series
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection containing
 * [async functions]{@link AsyncFunction} to run in series.
 * Each function can complete with any number of optional `result` values.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This function gets a results array (or object)
 * containing all the result arguments passed to the `task` callbacks. Invoked
 * with (err, result).
 * @example
 * async.series([
 *     function(callback) {
 *         // do some stuff ...
 *         callback(null, 'one');
 *     },
 *     function(callback) {
 *         // do some more stuff ...
 *         callback(null, 'two');
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     // results is now equal to ['one', 'two']
 * });
 *
 * async.series({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback){
 *         setTimeout(function() {
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }, function(err, results) {
 *     // results is now equal to: {one: 1, two: 2}
 * });
 */
function series(tasks, callback) {
    _parallel(eachOfSeries, tasks, callback);
}

/**
 * Returns `true` if at least one element in the `coll` satisfies an async test.
 * If any iteratee call returns `true`, the main `callback` is immediately
 * called.
 *
 * @name some
 * @static
 * @memberOf module:Collections
 * @method
 * @alias any
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collections in parallel.
 * The iteratee should complete with a boolean `result` value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 * @example
 *
 * async.some(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // if result is true then at least one of the files exists
 * });
 */
var some = doParallel(_createTester(Boolean, identity));

/**
 * The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
 *
 * @name someLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.some]{@link module:Collections.some}
 * @alias anyLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collections in parallel.
 * The iteratee should complete with a boolean `result` value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 */
var someLimit = doParallelLimit(_createTester(Boolean, identity));

/**
 * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
 *
 * @name someSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.some]{@link module:Collections.some}
 * @alias anySeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collections in series.
 * The iteratee should complete with a boolean `result` value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 */
var someSeries = doLimit(someLimit, 1);

/**
 * Sorts a list by the results of running each `coll` value through an async
 * `iteratee`.
 *
 * @name sortBy
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in
 * `coll`.
 * The iteratee should complete with a value to use as the sort criteria as
 * its `result`.
 * Invoked with (item, callback).
 * @param {Function} callback - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is the items
 * from the original `coll` sorted by the values returned by the `iteratee`
 * calls. Invoked with (err, results).
 * @example
 *
 * async.sortBy(['file1','file2','file3'], function(file, callback) {
 *     fs.stat(file, function(err, stats) {
 *         callback(err, stats.mtime);
 *     });
 * }, function(err, results) {
 *     // results is now the original array of files sorted by
 *     // modified date
 * });
 *
 * // By modifying the callback parameter the
 * // sorting order can be influenced:
 *
 * // ascending order
 * async.sortBy([1,9,3,5], function(x, callback) {
 *     callback(null, x);
 * }, function(err,result) {
 *     // result callback
 * });
 *
 * // descending order
 * async.sortBy([1,9,3,5], function(x, callback) {
 *     callback(null, x*-1);    //<- x*-1 instead of x, turns the order around
 * }, function(err,result) {
 *     // result callback
 * });
 */
function sortBy (coll, iteratee, callback) {
    var _iteratee = wrapAsync(iteratee);
    map(coll, function (x, callback) {
        _iteratee(x, function (err, criteria) {
            if (err) return callback(err);
            callback(null, {value: x, criteria: criteria});
        });
    }, function (err, results) {
        if (err) return callback(err);
        callback(null, arrayMap(results.sort(comparator), baseProperty('value')));
    });

    function comparator(left, right) {
        var a = left.criteria, b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
    }
}

/**
 * Sets a time limit on an asynchronous function. If the function does not call
 * its callback within the specified milliseconds, it will be called with a
 * timeout error. The code property for the error object will be `'ETIMEDOUT'`.
 *
 * @name timeout
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {AsyncFunction} asyncFn - The async function to limit in time.
 * @param {number} milliseconds - The specified time limit.
 * @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
 * to timeout Error for more information..
 * @returns {AsyncFunction} Returns a wrapped function that can be used with any
 * of the control flow functions.
 * Invoke this function with the same parameters as you would `asyncFunc`.
 * @example
 *
 * function myFunction(foo, callback) {
 *     doAsyncTask(foo, function(err, data) {
 *         // handle errors
 *         if (err) return callback(err);
 *
 *         // do some stuff ...
 *
 *         // return processed data
 *         return callback(null, data);
 *     });
 * }
 *
 * var wrapped = async.timeout(myFunction, 1000);
 *
 * // call `wrapped` as you would `myFunction`
 * wrapped({ bar: 'bar' }, function(err, data) {
 *     // if `myFunction` takes < 1000 ms to execute, `err`
 *     // and `data` will have their expected values
 *
 *     // else `err` will be an Error with the code 'ETIMEDOUT'
 * });
 */
function timeout(asyncFn, milliseconds, info) {
    var fn = wrapAsync(asyncFn);

    return initialParams(function (args, callback) {
        var timedOut = false;
        var timer;

        function timeoutCallback() {
            var name = asyncFn.name || 'anonymous';
            var error  = new Error('Callback function "' + name + '" timed out.');
            error.code = 'ETIMEDOUT';
            if (info) {
                error.info = info;
            }
            timedOut = true;
            callback(error);
        }

        args.push(function () {
            if (!timedOut) {
                callback.apply(null, arguments);
                clearTimeout(timer);
            }
        });

        // setup timer and call original function
        timer = setTimeout(timeoutCallback, milliseconds);
        fn.apply(null, args);
    });
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil;
var nativeMax = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

/**
 * The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name timesLimit
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.times]{@link module:ControlFlow.times}
 * @category Control Flow
 * @param {number} count - The number of times to run the function.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - The async function to call `n` times.
 * Invoked with the iteration index and a callback: (n, next).
 * @param {Function} callback - see [async.map]{@link module:Collections.map}.
 */
function timeLimit(count, limit, iteratee, callback) {
    var _iteratee = wrapAsync(iteratee);
    mapLimit(baseRange(0, count, 1), limit, _iteratee, callback);
}

/**
 * Calls the `iteratee` function `n` times, and accumulates results in the same
 * manner you would use with [map]{@link module:Collections.map}.
 *
 * @name times
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Control Flow
 * @param {number} n - The number of times to run the function.
 * @param {AsyncFunction} iteratee - The async function to call `n` times.
 * Invoked with the iteration index and a callback: (n, next).
 * @param {Function} callback - see {@link module:Collections.map}.
 * @example
 *
 * // Pretend this is some complicated async factory
 * var createUser = function(id, callback) {
 *     callback(null, {
 *         id: 'user' + id
 *     });
 * };
 *
 * // generate 5 users
 * async.times(5, function(n, next) {
 *     createUser(n, function(err, user) {
 *         next(err, user);
 *     });
 * }, function(err, users) {
 *     // we should now have 5 users
 * });
 */
var times = doLimit(timeLimit, Infinity);

/**
 * The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
 *
 * @name timesSeries
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.times]{@link module:ControlFlow.times}
 * @category Control Flow
 * @param {number} n - The number of times to run the function.
 * @param {AsyncFunction} iteratee - The async function to call `n` times.
 * Invoked with the iteration index and a callback: (n, next).
 * @param {Function} callback - see {@link module:Collections.map}.
 */
var timesSeries = doLimit(timeLimit, 1);

/**
 * A relative of `reduce`.  Takes an Object or Array, and iterates over each
 * element in series, each step potentially mutating an `accumulator` value.
 * The type of the accumulator defaults to the type of collection passed in.
 *
 * @name transform
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {*} [accumulator] - The initial state of the transform.  If omitted,
 * it will default to an empty Object or Array, depending on the type of `coll`
 * @param {AsyncFunction} iteratee - A function applied to each item in the
 * collection that potentially modifies the accumulator.
 * Invoked with (accumulator, item, key, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the transformed accumulator.
 * Invoked with (err, result).
 * @example
 *
 * async.transform([1,2,3], function(acc, item, index, callback) {
 *     // pointless async:
 *     process.nextTick(function() {
 *         acc.push(item * 2)
 *         callback(null)
 *     });
 * }, function(err, result) {
 *     // result is now equal to [2, 4, 6]
 * });
 *
 * @example
 *
 * async.transform({a: 1, b: 2, c: 3}, function (obj, val, key, callback) {
 *     setImmediate(function () {
 *         obj[key] = val * 2;
 *         callback();
 *     })
 * }, function (err, result) {
 *     // result is equal to {a: 2, b: 4, c: 6}
 * })
 */
function transform (coll, accumulator, iteratee, callback) {
    if (arguments.length <= 3) {
        callback = iteratee;
        iteratee = accumulator;
        accumulator = isArray(coll) ? [] : {};
    }
    callback = once(callback || noop);
    var _iteratee = wrapAsync(iteratee);

    eachOf(coll, function(v, k, cb) {
        _iteratee(accumulator, v, k, cb);
    }, function(err) {
        callback(err, accumulator);
    });
}

/**
 * It runs each task in series but stops whenever any of the functions were
 * successful. If one of the tasks were successful, the `callback` will be
 * passed the result of the successful task. If all tasks fail, the callback
 * will be passed the error and result (if any) of the final attempt.
 *
 * @name tryEach
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection containing functions to
 * run, each function is passed a `callback(err, result)` it must call on
 * completion with an error `err` (which can be `null`) and an optional `result`
 * value.
 * @param {Function} [callback] - An optional callback which is called when one
 * of the tasks has succeeded, or all have failed. It receives the `err` and
 * `result` arguments of the last attempt at completing the `task`. Invoked with
 * (err, results).
 * @example
 * async.tryEach([
 *     function getDataFromFirstWebsite(callback) {
 *         // Try getting the data from the first website
 *         callback(err, data);
 *     },
 *     function getDataFromSecondWebsite(callback) {
 *         // First website failed,
 *         // Try getting the data from the backup website
 *         callback(err, data);
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     Now do something with the data.
 * });
 *
 */
function tryEach(tasks, callback) {
    var error = null;
    var result;
    callback = callback || noop;
    eachSeries(tasks, function(task, callback) {
        wrapAsync(task)(function (err, res/*, ...args*/) {
            if (arguments.length > 2) {
                result = slice(arguments, 1);
            } else {
                result = res;
            }
            error = err;
            callback(!err);
        });
    }, function () {
        callback(error, result);
    });
}

/**
 * Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
 * unmemoized form. Handy for testing.
 *
 * @name unmemoize
 * @static
 * @memberOf module:Utils
 * @method
 * @see [async.memoize]{@link module:Utils.memoize}
 * @category Util
 * @param {AsyncFunction} fn - the memoized function
 * @returns {AsyncFunction} a function that calls the original unmemoized function
 */
function unmemoize(fn) {
    return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
    };
}

/**
 * Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
 * stopped, or an error occurs.
 *
 * @name whilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Function} test - synchronous truth test to perform before each
 * execution of `iteratee`. Invoked with ().
 * @param {AsyncFunction} iteratee - An async function which is called each time
 * `test` passes. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `iteratee`'s
 * callback. Invoked with (err, [results]);
 * @returns undefined
 * @example
 *
 * var count = 0;
 * async.whilst(
 *     function() { return count < 5; },
 *     function(callback) {
 *         count++;
 *         setTimeout(function() {
 *             callback(null, count);
 *         }, 1000);
 *     },
 *     function (err, n) {
 *         // 5 seconds have passed, n = 5
 *     }
 * );
 */
function whilst(test, iteratee, callback) {
    callback = onlyOnce(callback || noop);
    var _iteratee = wrapAsync(iteratee);
    if (!test()) return callback(null);
    var next = function(err/*, ...args*/) {
        if (err) return callback(err);
        if (test()) return _iteratee(next);
        var args = slice(arguments, 1);
        callback.apply(null, [null].concat(args));
    };
    _iteratee(next);
}

/**
 * Repeatedly call `iteratee` until `test` returns `true`. Calls `callback` when
 * stopped, or an error occurs. `callback` will be passed an error and any
 * arguments passed to the final `iteratee`'s callback.
 *
 * The inverse of [whilst]{@link module:ControlFlow.whilst}.
 *
 * @name until
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {Function} test - synchronous truth test to perform before each
 * execution of `iteratee`. Invoked with ().
 * @param {AsyncFunction} iteratee - An async function which is called each time
 * `test` fails. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has passed and repeated execution of `iteratee` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `iteratee`'s
 * callback. Invoked with (err, [results]);
 */
function until(test, iteratee, callback) {
    whilst(function() {
        return !test.apply(this, arguments);
    }, iteratee, callback);
}

/**
 * Runs the `tasks` array of functions in series, each passing their results to
 * the next in the array. However, if any of the `tasks` pass an error to their
 * own callback, the next function is not executed, and the main `callback` is
 * immediately called with the error.
 *
 * @name waterfall
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array of [async functions]{@link AsyncFunction}
 * to run.
 * Each function should complete with any number of `result` values.
 * The `result` values will be passed as arguments, in order, to the next task.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This will be passed the results of the last task's
 * callback. Invoked with (err, [results]).
 * @returns undefined
 * @example
 *
 * async.waterfall([
 *     function(callback) {
 *         callback(null, 'one', 'two');
 *     },
 *     function(arg1, arg2, callback) {
 *         // arg1 now equals 'one' and arg2 now equals 'two'
 *         callback(null, 'three');
 *     },
 *     function(arg1, callback) {
 *         // arg1 now equals 'three'
 *         callback(null, 'done');
 *     }
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 *
 * // Or, with named functions:
 * async.waterfall([
 *     myFirstFunction,
 *     mySecondFunction,
 *     myLastFunction,
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 * function myFirstFunction(callback) {
 *     callback(null, 'one', 'two');
 * }
 * function mySecondFunction(arg1, arg2, callback) {
 *     // arg1 now equals 'one' and arg2 now equals 'two'
 *     callback(null, 'three');
 * }
 * function myLastFunction(arg1, callback) {
 *     // arg1 now equals 'three'
 *     callback(null, 'done');
 * }
 */
var waterfall = function(tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
    if (!tasks.length) return callback();
    var taskIndex = 0;

    function nextTask(args) {
        var task = wrapAsync(tasks[taskIndex++]);
        args.push(onlyOnce(next));
        task.apply(null, args);
    }

    function next(err/*, ...args*/) {
        if (err || taskIndex === tasks.length) {
            return callback.apply(null, arguments);
        }
        nextTask(slice(arguments, 1));
    }

    nextTask([]);
};

/**
 * An "async function" in the context of Async is an asynchronous function with
 * a variable number of parameters, with the final parameter being a callback.
 * (`function (arg1, arg2, ..., callback) {}`)
 * The final callback is of the form `callback(err, results...)`, which must be
 * called once the function is completed.  The callback should be called with a
 * Error as its first argument to signal that an error occurred.
 * Otherwise, if no error occurred, it should be called with `null` as the first
 * argument, and any additional `result` arguments that may apply, to signal
 * successful completion.
 * The callback must be called exactly once, ideally on a later tick of the
 * JavaScript event loop.
 *
 * This type of function is also referred to as a "Node-style async function",
 * or a "continuation passing-style function" (CPS). Most of the methods of this
 * library are themselves CPS/Node-style async functions, or functions that
 * return CPS/Node-style async functions.
 *
 * Wherever we accept a Node-style async function, we also directly accept an
 * [ES2017 `async` function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}.
 * In this case, the `async` function will not be passed a final callback
 * argument, and any thrown error will be used as the `err` argument of the
 * implicit callback, and the return value will be used as the `result` value.
 * (i.e. a `rejected` of the returned Promise becomes the `err` callback
 * argument, and a `resolved` value becomes the `result`.)
 *
 * Note, due to JavaScript limitations, we can only detect native `async`
 * functions and not transpilied implementations.
 * Your environment must have `async`/`await` support for this to work.
 * (e.g. Node > v7.6, or a recent version of a modern browser).
 * If you are using `async` functions through a transpiler (e.g. Babel), you
 * must still wrap the function with [asyncify]{@link module:Utils.asyncify},
 * because the `async function` will be compiled to an ordinary function that
 * returns a promise.
 *
 * @typedef {Function} AsyncFunction
 * @static
 */

/**
 * Async is a utility module which provides straight-forward, powerful functions
 * for working with asynchronous JavaScript. Although originally designed for
 * use with [Node.js](http://nodejs.org) and installable via
 * `npm install --save async`, it can also be used directly in the browser.
 * @module async
 * @see AsyncFunction
 */


/**
 * A collection of `async` functions for manipulating collections, such as
 * arrays and objects.
 * @module Collections
 */

/**
 * A collection of `async` functions for controlling the flow through a script.
 * @module ControlFlow
 */

/**
 * A collection of `async` utility functions.
 * @module Utils
 */

var index = {
    apply: apply,
    applyEach: applyEach,
    applyEachSeries: applyEachSeries,
    asyncify: asyncify,
    auto: auto,
    autoInject: autoInject,
    cargo: cargo,
    compose: compose,
    concat: concat,
    concatLimit: concatLimit,
    concatSeries: concatSeries,
    constant: constant,
    detect: detect,
    detectLimit: detectLimit,
    detectSeries: detectSeries,
    dir: dir,
    doDuring: doDuring,
    doUntil: doUntil,
    doWhilst: doWhilst,
    during: during,
    each: eachLimit,
    eachLimit: eachLimit$1,
    eachOf: eachOf,
    eachOfLimit: eachOfLimit,
    eachOfSeries: eachOfSeries,
    eachSeries: eachSeries,
    ensureAsync: ensureAsync,
    every: every,
    everyLimit: everyLimit,
    everySeries: everySeries,
    filter: filter,
    filterLimit: filterLimit,
    filterSeries: filterSeries,
    forever: forever,
    groupBy: groupBy,
    groupByLimit: groupByLimit,
    groupBySeries: groupBySeries,
    log: log,
    map: map,
    mapLimit: mapLimit,
    mapSeries: mapSeries,
    mapValues: mapValues,
    mapValuesLimit: mapValuesLimit,
    mapValuesSeries: mapValuesSeries,
    memoize: memoize,
    nextTick: nextTick,
    parallel: parallelLimit,
    parallelLimit: parallelLimit$1,
    priorityQueue: priorityQueue,
    queue: queue$1,
    race: race,
    reduce: reduce,
    reduceRight: reduceRight,
    reflect: reflect,
    reflectAll: reflectAll,
    reject: reject,
    rejectLimit: rejectLimit,
    rejectSeries: rejectSeries,
    retry: retry,
    retryable: retryable,
    seq: seq,
    series: series,
    setImmediate: setImmediate$1,
    some: some,
    someLimit: someLimit,
    someSeries: someSeries,
    sortBy: sortBy,
    timeout: timeout,
    times: times,
    timesLimit: timeLimit,
    timesSeries: timesSeries,
    transform: transform,
    tryEach: tryEach,
    unmemoize: unmemoize,
    until: until,
    waterfall: waterfall,
    whilst: whilst,

    // aliases
    all: every,
    allLimit: everyLimit,
    allSeries: everySeries,
    any: some,
    anyLimit: someLimit,
    anySeries: someSeries,
    find: detect,
    findLimit: detectLimit,
    findSeries: detectSeries,
    forEach: eachLimit,
    forEachSeries: eachSeries,
    forEachLimit: eachLimit$1,
    forEachOf: eachOf,
    forEachOfSeries: eachOfSeries,
    forEachOfLimit: eachOfLimit,
    inject: reduce,
    foldl: reduce,
    foldr: reduceRight,
    select: filter,
    selectLimit: filterLimit,
    selectSeries: filterSeries,
    wrapSync: asyncify
};

exports['default'] = index;
exports.apply = apply;
exports.applyEach = applyEach;
exports.applyEachSeries = applyEachSeries;
exports.asyncify = asyncify;
exports.auto = auto;
exports.autoInject = autoInject;
exports.cargo = cargo;
exports.compose = compose;
exports.concat = concat;
exports.concatLimit = concatLimit;
exports.concatSeries = concatSeries;
exports.constant = constant;
exports.detect = detect;
exports.detectLimit = detectLimit;
exports.detectSeries = detectSeries;
exports.dir = dir;
exports.doDuring = doDuring;
exports.doUntil = doUntil;
exports.doWhilst = doWhilst;
exports.during = during;
exports.each = eachLimit;
exports.eachLimit = eachLimit$1;
exports.eachOf = eachOf;
exports.eachOfLimit = eachOfLimit;
exports.eachOfSeries = eachOfSeries;
exports.eachSeries = eachSeries;
exports.ensureAsync = ensureAsync;
exports.every = every;
exports.everyLimit = everyLimit;
exports.everySeries = everySeries;
exports.filter = filter;
exports.filterLimit = filterLimit;
exports.filterSeries = filterSeries;
exports.forever = forever;
exports.groupBy = groupBy;
exports.groupByLimit = groupByLimit;
exports.groupBySeries = groupBySeries;
exports.log = log;
exports.map = map;
exports.mapLimit = mapLimit;
exports.mapSeries = mapSeries;
exports.mapValues = mapValues;
exports.mapValuesLimit = mapValuesLimit;
exports.mapValuesSeries = mapValuesSeries;
exports.memoize = memoize;
exports.nextTick = nextTick;
exports.parallel = parallelLimit;
exports.parallelLimit = parallelLimit$1;
exports.priorityQueue = priorityQueue;
exports.queue = queue$1;
exports.race = race;
exports.reduce = reduce;
exports.reduceRight = reduceRight;
exports.reflect = reflect;
exports.reflectAll = reflectAll;
exports.reject = reject;
exports.rejectLimit = rejectLimit;
exports.rejectSeries = rejectSeries;
exports.retry = retry;
exports.retryable = retryable;
exports.seq = seq;
exports.series = series;
exports.setImmediate = setImmediate$1;
exports.some = some;
exports.someLimit = someLimit;
exports.someSeries = someSeries;
exports.sortBy = sortBy;
exports.timeout = timeout;
exports.times = times;
exports.timesLimit = timeLimit;
exports.timesSeries = timesSeries;
exports.transform = transform;
exports.tryEach = tryEach;
exports.unmemoize = unmemoize;
exports.until = until;
exports.waterfall = waterfall;
exports.whilst = whilst;
exports.all = every;
exports.allLimit = everyLimit;
exports.allSeries = everySeries;
exports.any = some;
exports.anyLimit = someLimit;
exports.anySeries = someSeries;
exports.find = detect;
exports.findLimit = detectLimit;
exports.findSeries = detectSeries;
exports.forEach = eachLimit;
exports.forEachSeries = eachSeries;
exports.forEachLimit = eachLimit$1;
exports.forEachOf = eachOf;
exports.forEachOfSeries = eachOfSeries;
exports.forEachOfLimit = eachOfLimit;
exports.inject = reduce;
exports.foldl = reduce;
exports.foldr = reduceRight;
exports.select = filter;
exports.selectLimit = filterLimit;
exports.selectSeries = filterSeries;
exports.wrapSync = asyncify;

Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"_process":37,"timers":38}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (process){(function (){
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = require('./common')(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};

}).call(this)}).call(this,require('_process'))
},{"./common":5,"_process":37}],5:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":36}],6:[function(require,module,exports){
(function (process,setImmediate){(function (){
/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */
;!function(undefined) {
  var hasOwnProperty= Object.hasOwnProperty;
  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;
  var nextTickSupported= typeof process=='object' && typeof process.nextTick=='function';
  var symbolsSupported= typeof Symbol==='function';
  var reflectSupported= typeof Reflect === 'object';
  var setImmediateSupported= typeof setImmediate === 'function';
  var _setImmediate= setImmediateSupported ? setImmediate : setTimeout;
  var ownKeys= symbolsSupported? (reflectSupported && typeof Reflect.ownKeys==='function'? Reflect.ownKeys : function(obj){
    var arr= Object.getOwnPropertyNames(obj);
    arr.push.apply(arr, Object.getOwnPropertySymbols(obj));
    return arr;
  }) : Object.keys;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {
      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);

      if(conf.maxListeners!==undefined){
          this._maxListeners= conf.maxListeners;
      }

      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this._newListener = conf.newListener);
      conf.removeListener && (this._removeListener = conf.removeListener);
      conf.verboseMemoryLeak && (this.verboseMemoryLeak = conf.verboseMemoryLeak);
      conf.ignoreErrors && (this.ignoreErrors = conf.ignoreErrors);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    }
  }

  function logPossibleMemoryLeak(count, eventName) {
    var errorMsg = '(node) warning: possible EventEmitter memory ' +
        'leak detected. ' + count + ' listeners added. ' +
        'Use emitter.setMaxListeners() to increase limit.';

    if(this.verboseMemoryLeak){
      errorMsg += ' Event name: ' + eventName + '.';
    }

    if(typeof process !== 'undefined' && process.emitWarning){
      var e = new Error(errorMsg);
      e.name = 'MaxListenersExceededWarning';
      e.emitter = this;
      e.count = count;
      process.emitWarning(e);
    } else {
      console.error(errorMsg);

      if (console.trace){
        console.trace();
      }
    }
  }

  var toArray = function (a, b, c) {
    var n = arguments.length;
    switch (n) {
      case 0:
        return [];
      case 1:
        return [a];
      case 2:
        return [a, b];
      case 3:
        return [a, b, c];
      default:
        var arr = new Array(n);
        while (n--) {
          arr[n] = arguments[n];
        }
        return arr;
    }
  };

  function toObject(keys, values) {
    var obj = {};
    var key;
    var len = keys.length;
    var valuesCount = values ? values.length : 0;
    for (var i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = i < valuesCount ? values[i] : undefined;
    }
    return obj;
  }

  function TargetObserver(emitter, target, options) {
    this._emitter = emitter;
    this._target = target;
    this._listeners = {};
    this._listenersCount = 0;

    var on, off;

    if (options.on || options.off) {
      on = options.on;
      off = options.off;
    }

    if (target.addEventListener) {
      on = target.addEventListener;
      off = target.removeEventListener;
    } else if (target.addListener) {
      on = target.addListener;
      off = target.removeListener;
    } else if (target.on) {
      on = target.on;
      off = target.off;
    }

    if (!on && !off) {
      throw Error('target does not implement any known event API');
    }

    if (typeof on !== 'function') {
      throw TypeError('on method must be a function');
    }

    if (typeof off !== 'function') {
      throw TypeError('off method must be a function');
    }

    this._on = on;
    this._off = off;

    var _observers= emitter._observers;
    if(_observers){
      _observers.push(this);
    }else{
      emitter._observers= [this];
    }
  }

  Object.assign(TargetObserver.prototype, {
    subscribe: function(event, localEvent, reducer){
      var observer= this;
      var target= this._target;
      var emitter= this._emitter;
      var listeners= this._listeners;
      var handler= function(){
        var args= toArray.apply(null, arguments);
        var eventObj= {
          data: args,
          name: localEvent,
          original: event
        };
        if(reducer){
          var result= reducer.call(target, eventObj);
          if(result!==false){
            emitter.emit.apply(emitter, [eventObj.name].concat(args))
          }
          return;
        }
        emitter.emit.apply(emitter, [localEvent].concat(args));
      };


      if(listeners[event]){
        throw Error('Event \'' + event + '\' is already listening');
      }

      this._listenersCount++;

      if(emitter._newListener && emitter._removeListener && !observer._onNewListener){

        this._onNewListener = function (_event) {
          if (_event === localEvent && listeners[event] === null) {
            listeners[event] = handler;
            observer._on.call(target, event, handler);
          }
        };

        emitter.on('newListener', this._onNewListener);

        this._onRemoveListener= function(_event){
          if(_event === localEvent && !emitter.hasListeners(_event) && listeners[event]){
            listeners[event]= null;
            observer._off.call(target, event, handler);
          }
        };

        listeners[event]= null;

        emitter.on('removeListener', this._onRemoveListener);
      }else{
        listeners[event]= handler;
        observer._on.call(target, event, handler);
      }
    },

    unsubscribe: function(event){
      var observer= this;
      var listeners= this._listeners;
      var emitter= this._emitter;
      var handler;
      var events;
      var off= this._off;
      var target= this._target;
      var i;

      if(event && typeof event!=='string'){
        throw TypeError('event must be a string');
      }

      function clearRefs(){
        if(observer._onNewListener){
          emitter.off('newListener', observer._onNewListener);
          emitter.off('removeListener', observer._onRemoveListener);
          observer._onNewListener= null;
          observer._onRemoveListener= null;
        }
        var index= findTargetIndex.call(emitter, observer);
        emitter._observers.splice(index, 1);
      }

      if(event){
        handler= listeners[event];
        if(!handler) return;
        off.call(target, event, handler);
        delete listeners[event];
        if(!--this._listenersCount){
          clearRefs();
        }
      }else{
        events= ownKeys(listeners);
        i= events.length;
        while(i-->0){
          event= events[i];
          off.call(target, event, listeners[event]);
        }
        this._listeners= {};
        this._listenersCount= 0;
        clearRefs();
      }
    }
  });

  function resolveOptions(options, schema, reducers, allowUnknown) {
    var computedOptions = Object.assign({}, schema);

    if (!options) return computedOptions;

    if (typeof options !== 'object') {
      throw TypeError('options must be an object')
    }

    var keys = Object.keys(options);
    var length = keys.length;
    var option, value;
    var reducer;

    function reject(reason) {
      throw Error('Invalid "' + option + '" option value' + (reason ? '. Reason: ' + reason : ''))
    }

    for (var i = 0; i < length; i++) {
      option = keys[i];
      if (!allowUnknown && !hasOwnProperty.call(schema, option)) {
        throw Error('Unknown "' + option + '" option');
      }
      value = options[option];
      if (value !== undefined) {
        reducer = reducers[option];
        computedOptions[option] = reducer ? reducer(value, reject) : value;
      }
    }
    return computedOptions;
  }

  function constructorReducer(value, reject) {
    if (typeof value !== 'function' || !value.hasOwnProperty('prototype')) {
      reject('value must be a constructor');
    }
    return value;
  }

  function makeTypeReducer(types) {
    var message= 'value must be type of ' + types.join('|');
    var len= types.length;
    var firstType= types[0];
    var secondType= types[1];

    if (len === 1) {
      return function (v, reject) {
        if (typeof v === firstType) {
          return v;
        }
        reject(message);
      }
    }

    if (len === 2) {
      return function (v, reject) {
        var kind= typeof v;
        if (kind === firstType || kind === secondType) return v;
        reject(message);
      }
    }

    return function (v, reject) {
      var kind = typeof v;
      var i = len;
      while (i-- > 0) {
        if (kind === types[i]) return v;
      }
      reject(message);
    }
  }

  var functionReducer= makeTypeReducer(['function']);

  var objectFunctionReducer= makeTypeReducer(['object', 'function']);

  function makeCancelablePromise(Promise, executor, options) {
    var isCancelable;
    var callbacks;
    var timer= 0;
    var subscriptionClosed;

    var promise = new Promise(function (resolve, reject, onCancel) {
      options= resolveOptions(options, {
        timeout: 0,
        overload: false
      }, {
        timeout: function(value, reject){
          value*= 1;
          if (typeof value !== 'number' || value < 0 || !Number.isFinite(value)) {
            reject('timeout must be a positive number');
          }
          return value;
        }
      });

      isCancelable = !options.overload && typeof Promise.prototype.cancel === 'function' && typeof onCancel === 'function';

      function cleanup() {
        if (callbacks) {
          callbacks = null;
        }
        if (timer) {
          clearTimeout(timer);
          timer = 0;
        }
      }

      var _resolve= function(value){
        cleanup();
        resolve(value);
      };

      var _reject= function(err){
        cleanup();
        reject(err);
      };

      if (isCancelable) {
        executor(_resolve, _reject, onCancel);
      } else {
        callbacks = [function(reason){
          _reject(reason || Error('canceled'));
        }];
        executor(_resolve, _reject, function (cb) {
          if (subscriptionClosed) {
            throw Error('Unable to subscribe on cancel event asynchronously')
          }
          if (typeof cb !== 'function') {
            throw TypeError('onCancel callback must be a function');
          }
          callbacks.push(cb);
        });
        subscriptionClosed= true;
      }

      if (options.timeout > 0) {
        timer= setTimeout(function(){
          var reason= Error('timeout');
          reason.code = 'ETIMEDOUT'
          timer= 0;
          promise.cancel(reason);
          reject(reason);
        }, options.timeout);
      }
    });

    if (!isCancelable) {
      promise.cancel = function (reason) {
        if (!callbacks) {
          return;
        }
        var length = callbacks.length;
        for (var i = 1; i < length; i++) {
          callbacks[i](reason);
        }
        // internal callback to reject the promise
        callbacks[0](reason);
        callbacks = null;
      };
    }

    return promise;
  }

  function findTargetIndex(observer) {
    var observers = this._observers;
    if(!observers){
      return -1;
    }
    var len = observers.length;
    for (var i = 0; i < len; i++) {
      if (observers[i]._target === observer) return i;
    }
    return -1;
  }

  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i, typeLength) {
    if (!tree) {
      return null;
    }

    if (i === 0) {
      var kind = typeof type;
      if (kind === 'string') {
        var ns, n, l = 0, j = 0, delimiter = this.delimiter, dl = delimiter.length;
        if ((n = type.indexOf(delimiter)) !== -1) {
          ns = new Array(5);
          do {
            ns[l++] = type.slice(j, n);
            j = n + dl;
          } while ((n = type.indexOf(delimiter, j)) !== -1);

          ns[l++] = type.slice(j);
          type = ns;
          typeLength = l;
        } else {
          type = [type];
          typeLength = 1;
        }
      } else if (kind === 'object') {
        typeLength = type.length;
      } else {
        type = [type];
        typeLength = 1;
      }
    }

    var listeners= null, branch, xTree, xxTree, isolatedBranch, endReached, currentType = type[i],
        nextType = type[i + 1], branches, _listeners;

    if (i === typeLength) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //

      if(tree._listeners) {
        if (typeof tree._listeners === 'function') {
          handlers && handlers.push(tree._listeners);
          listeners = [tree];
        } else {
          handlers && handlers.push.apply(handlers, tree._listeners);
          listeners = [tree];
        }
      }
    } else {

      if (currentType === '*') {
        //
        // If the event emitted is '*' at this part
        // or there is a concrete match at this patch
        //
        branches = ownKeys(tree);
        n = branches.length;
        while (n-- > 0) {
          branch = branches[n];
          if (branch !== '_listeners') {
            _listeners = searchListenerTree(handlers, type, tree[branch], i + 1, typeLength);
            if (_listeners) {
              if (listeners) {
                listeners.push.apply(listeners, _listeners);
              } else {
                listeners = _listeners;
              }
            }
          }
        }
        return listeners;
      } else if (currentType === '**') {
        endReached = (i + 1 === typeLength || (i + 2 === typeLength && nextType === '*'));
        if (endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = searchListenerTree(handlers, type, tree, typeLength, typeLength);
        }

        branches = ownKeys(tree);
        n = branches.length;
        while (n-- > 0) {
          branch = branches[n];
          if (branch !== '_listeners') {
            if (branch === '*' || branch === '**') {
              if (tree[branch]._listeners && !endReached) {
                _listeners = searchListenerTree(handlers, type, tree[branch], typeLength, typeLength);
                if (_listeners) {
                  if (listeners) {
                    listeners.push.apply(listeners, _listeners);
                  } else {
                    listeners = _listeners;
                  }
                }
              }
              _listeners = searchListenerTree(handlers, type, tree[branch], i, typeLength);
            } else if (branch === nextType) {
              _listeners = searchListenerTree(handlers, type, tree[branch], i + 2, typeLength);
            } else {
              // No match on this one, shift into the tree but not in the type array.
              _listeners = searchListenerTree(handlers, type, tree[branch], i, typeLength);
            }
            if (_listeners) {
              if (listeners) {
                listeners.push.apply(listeners, _listeners);
              } else {
                listeners = _listeners;
              }
            }
          }
        }
        return listeners;
      } else if (tree[currentType]) {
        listeners = searchListenerTree(handlers, type, tree[currentType], i + 1, typeLength);
      }
    }

      xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i + 1, typeLength);
    }

    xxTree = tree['**'];
    if (xxTree) {
      if (i < typeLength) {
        if (xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength, typeLength);
        }

        // Build arrays of matching next branches and others.
        branches= ownKeys(xxTree);
        n= branches.length;
        while(n-->0){
          branch= branches[n];
          if (branch !== '_listeners') {
            if (branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i + 2, typeLength);
            } else if (branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i + 1, typeLength);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, {'**': isolatedBranch}, i + 1, typeLength);
            }
          }
        }
      } else if (xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength, typeLength);
      } else if (xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength, typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener, prepend) {
    var len = 0, j = 0, i, delimiter = this.delimiter, dl= delimiter.length, ns;

    if(typeof type==='string') {
      if ((i = type.indexOf(delimiter)) !== -1) {
        ns = new Array(5);
        do {
          ns[len++] = type.slice(j, i);
          j = i + dl;
        } while ((i = type.indexOf(delimiter, j)) !== -1);

        ns[len++] = type.slice(j);
      }else{
        ns= [type];
        len= 1;
      }
    }else{
      ns= type;
      len= type.length;
    }

    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    if (len > 1) {
      for (i = 0; i + 1 < len; i++) {
        if (ns[i] === '**' && ns[i + 1] === '**') {
          return;
        }
      }
    }



    var tree = this.listenerTree, name;

    for (i = 0; i < len; i++) {
      name = ns[i];

      tree = tree[name] || (tree[name] = {});

      if (i === len - 1) {
        if (!tree._listeners) {
          tree._listeners = listener;
        } else {
          if (typeof tree._listeners === 'function') {
            tree._listeners = [tree._listeners];
          }

          if (prepend) {
            tree._listeners.unshift(listener);
          } else {
            tree._listeners.push(listener);
          }

          if (
              !tree._listeners.warned &&
              this._maxListeners > 0 &&
              tree._listeners.length > this._maxListeners
          ) {
            tree._listeners.warned = true;
            logPossibleMemoryLeak.call(this, tree._listeners.length, name);
          }
        }
        return true;
      }
    }

    return true;
  }

  function collectTreeEvents(tree, events, root, asArray){
     var branches= ownKeys(tree);
     var i= branches.length;
     var branch, branchName, path;
     var hasListeners= tree['_listeners'];
     var isArrayPath;

     while(i-->0){
         branchName= branches[i];

         branch= tree[branchName];

         if(branchName==='_listeners'){
             path= root;
         }else {
             path = root ? root.concat(branchName) : [branchName];
         }

         isArrayPath= asArray || typeof branchName==='symbol';

         hasListeners && events.push(isArrayPath? path : path.join(this.delimiter));

         if(typeof branch==='object'){
             collectTreeEvents.call(this, branch, events, path, isArrayPath);
         }
     }

     return events;
  }

  function recursivelyGarbageCollect(root) {
    var keys = ownKeys(root);
    var i= keys.length;
    var obj, key, flag;
    while(i-->0){
      key = keys[i];
      obj = root[key];

      if(obj){
          flag= true;
          if(key !== '_listeners' && !recursivelyGarbageCollect(obj)){
             delete root[key];
          }
      }
    }

    return flag;
  }

  function Listener(emitter, event, listener){
    this.emitter= emitter;
    this.event= event;
    this.listener= listener;
  }

  Listener.prototype.off= function(){
    this.emitter.off(this.event, this.listener);
    return this;
  };

  function setupListener(event, listener, options){
      if (options === true) {
        promisify = true;
      } else if (options === false) {
        async = true;
      } else {
        if (!options || typeof options !== 'object') {
          throw TypeError('options should be an object or true');
        }
        var async = options.async;
        var promisify = options.promisify;
        var nextTick = options.nextTick;
        var objectify = options.objectify;
      }

      if (async || nextTick || promisify) {
        var _listener = listener;
        var _origin = listener._origin || listener;

        if (nextTick && !nextTickSupported) {
          throw Error('process.nextTick is not supported');
        }

        if (promisify === undefined) {
          promisify = listener.constructor.name === 'AsyncFunction';
        }

        listener = function () {
          var args = arguments;
          var context = this;
          var event = this.event;

          return promisify ? (nextTick ? Promise.resolve() : new Promise(function (resolve) {
            _setImmediate(resolve);
          }).then(function () {
            context.event = event;
            return _listener.apply(context, args)
          })) : (nextTick ? process.nextTick : _setImmediate)(function () {
            context.event = event;
            _listener.apply(context, args)
          });
        };

        listener._async = true;
        listener._origin = _origin;
      }

    return [listener, objectify? new Listener(this, event, listener): this];
  }

  function EventEmitter(conf) {
    this._events = {};
    this._newListener = false;
    this._removeListener = false;
    this.verboseMemoryLeak = false;
    configure.call(this, conf);
  }

  EventEmitter.EventEmitter2 = EventEmitter; // backwards compatibility for exporting EventEmitter property

  EventEmitter.prototype.listenTo= function(target, events, options){
    if(typeof target!=='object'){
      throw TypeError('target musts be an object');
    }

    var emitter= this;

    options = resolveOptions(options, {
      on: undefined,
      off: undefined,
      reducers: undefined
    }, {
      on: functionReducer,
      off: functionReducer,
      reducers: objectFunctionReducer
    });

    function listen(events){
      if(typeof events!=='object'){
        throw TypeError('events must be an object');
      }

      var reducers= options.reducers;
      var index= findTargetIndex.call(emitter, target);
      var observer;

      if(index===-1){
        observer= new TargetObserver(emitter, target, options);
      }else{
        observer= emitter._observers[index];
      }

      var keys= ownKeys(events);
      var len= keys.length;
      var event;
      var isSingleReducer= typeof reducers==='function';

      for(var i=0; i<len; i++){
        event= keys[i];
        observer.subscribe(
            event,
            events[event] || event,
            isSingleReducer ? reducers : reducers && reducers[event]
        );
      }
    }

    isArray(events)?
        listen(toObject(events)) :
        (typeof events==='string'? listen(toObject(events.split(/\s+/))): listen(events));

    return this;
  };

  EventEmitter.prototype.stopListeningTo = function (target, event) {
    var observers = this._observers;

    if(!observers){
      return false;
    }

    var i = observers.length;
    var observer;
    var matched= false;

    if(target && typeof target!=='object'){
      throw TypeError('target should be an object');
    }

    while (i-- > 0) {
      observer = observers[i];
      if (!target || observer._target === target) {
        observer.unsubscribe(event);
        matched= true;
      }
    }

    return matched;
  };

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    if (n !== undefined) {
      this._maxListeners = n;
      if (!this._conf) this._conf = {};
      this._conf.maxListeners = n;
    }
  };

  EventEmitter.prototype.getMaxListeners = function() {
    return this._maxListeners;
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn, options) {
    return this._once(event, fn, false, options);
  };

  EventEmitter.prototype.prependOnceListener = function(event, fn, options) {
    return this._once(event, fn, true, options);
  };

  EventEmitter.prototype._once = function(event, fn, prepend, options) {
    return this._many(event, 1, fn, prepend, options);
  };

  EventEmitter.prototype.many = function(event, ttl, fn, options) {
    return this._many(event, ttl, fn, false, options);
  };

  EventEmitter.prototype.prependMany = function(event, ttl, fn, options) {
    return this._many(event, ttl, fn, true, options);
  };

  EventEmitter.prototype._many = function(event, ttl, fn, prepend, options) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      return fn.apply(this, arguments);
    }

    listener._origin = fn;

    return this._on(event, listener, prepend, options);
  };

  EventEmitter.prototype.emit = function() {
    if (!this._events && !this._all) {
      return false;
    }

    this._events || init.call(this);

    var type = arguments[0], ns, wildcard= this.wildcard;
    var args,l,i,j, containsSymbol;

    if (type === 'newListener' && !this._newListener) {
      if (!this._events.newListener) {
        return false;
      }
    }

    if (wildcard) {
      ns= type;
      if(type!=='newListener' && type!=='removeListener'){
        if (typeof type === 'object') {
          l = type.length;
          if (symbolsSupported) {
            for (i = 0; i < l; i++) {
              if (typeof type[i] === 'symbol') {
                containsSymbol = true;
                break;
              }
            }
          }
          if (!containsSymbol) {
            type = type.join(this.delimiter);
          }
        }
      }
    }

    var al = arguments.length;
    var handler;

    if (this._all && this._all.length) {
      handler = this._all.slice();

      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          handler[i].call(this, type);
          break;
        case 2:
          handler[i].call(this, type, arguments[1]);
          break;
        case 3:
          handler[i].call(this, type, arguments[1], arguments[2]);
          break;
        default:
          handler[i].apply(this, arguments);
        }
      }
    }

    if (wildcard) {
      handler = [];
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0, l);
    } else {
      handler = this._events[type];
      if (typeof handler === 'function') {
        this.event = type;
        switch (al) {
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        default:
          args = new Array(al - 1);
          for (j = 1; j < al; j++) args[j - 1] = arguments[j];
          handler.apply(this, args);
        }
        return true;
      } else if (handler) {
        // need to make copy of handlers because list can change in the middle
        // of emit call
        handler = handler.slice();
      }
    }

    if (handler && handler.length) {
      if (al > 3) {
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
      }
      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          handler[i].call(this);
          break;
        case 2:
          handler[i].call(this, arguments[1]);
          break;
        case 3:
          handler[i].call(this, arguments[1], arguments[2]);
          break;
        default:
          handler[i].apply(this, args);
        }
      }
      return true;
    } else if (!this.ignoreErrors && !this._all && type === 'error') {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
    }

    return !!this._all;
  };

  EventEmitter.prototype.emitAsync = function() {
    if (!this._events && !this._all) {
      return false;
    }

    this._events || init.call(this);

    var type = arguments[0], wildcard= this.wildcard, ns, containsSymbol;
    var args,l,i,j;

    if (type === 'newListener' && !this._newListener) {
        if (!this._events.newListener) { return Promise.resolve([false]); }
    }

    if (wildcard) {
      ns= type;
      if(type!=='newListener' && type!=='removeListener'){
        if (typeof type === 'object') {
          l = type.length;
          if (symbolsSupported) {
            for (i = 0; i < l; i++) {
              if (typeof type[i] === 'symbol') {
                containsSymbol = true;
                break;
              }
            }
          }
          if (!containsSymbol) {
            type = type.join(this.delimiter);
          }
        }
      }
    }

    var promises= [];

    var al = arguments.length;
    var handler;

    if (this._all) {
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          promises.push(this._all[i].call(this, type));
          break;
        case 2:
          promises.push(this._all[i].call(this, type, arguments[1]));
          break;
        case 3:
          promises.push(this._all[i].call(this, type, arguments[1], arguments[2]));
          break;
        default:
          promises.push(this._all[i].apply(this, arguments));
        }
      }
    }

    if (wildcard) {
      handler = [];
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    } else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      switch (al) {
      case 1:
        promises.push(handler.call(this));
        break;
      case 2:
        promises.push(handler.call(this, arguments[1]));
        break;
      case 3:
        promises.push(handler.call(this, arguments[1], arguments[2]));
        break;
      default:
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
        promises.push(handler.apply(this, args));
      }
    } else if (handler && handler.length) {
      handler = handler.slice();
      if (al > 3) {
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
      }
      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          promises.push(handler[i].call(this));
          break;
        case 2:
          promises.push(handler[i].call(this, arguments[1]));
          break;
        case 3:
          promises.push(handler[i].call(this, arguments[1], arguments[2]));
          break;
        default:
          promises.push(handler[i].apply(this, args));
        }
      }
    } else if (!this.ignoreErrors && !this._all && type === 'error') {
      if (arguments[1] instanceof Error) {
        return Promise.reject(arguments[1]); // Unhandled 'error' event
      } else {
        return Promise.reject("Uncaught, unspecified 'error' event.");
      }
    }

    return Promise.all(promises);
  };

  EventEmitter.prototype.on = function(type, listener, options) {
    return this._on(type, listener, false, options);
  };

  EventEmitter.prototype.prependListener = function(type, listener, options) {
    return this._on(type, listener, true, options);
  };

  EventEmitter.prototype.onAny = function(fn) {
    return this._onAny(fn, false);
  };

  EventEmitter.prototype.prependAny = function(fn) {
    return this._onAny(fn, true);
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype._onAny = function(fn, prepend){
    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    if (!this._all) {
      this._all = [];
    }

    // Add the function to the event listener collection.
    if(prepend){
      this._all.unshift(fn);
    }else{
      this._all.push(fn);
    }

    return this;
  };

  EventEmitter.prototype._on = function(type, listener, prepend, options) {
    if (typeof type === 'function') {
      this._onAny(type, listener);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    var returnValue= this, temp;

    if (options !== undefined) {
      temp = setupListener.call(this, type, listener, options);
      listener = temp[0];
      returnValue = temp[1];
    }

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    if (this._newListener) {
      this.emit('newListener', type, listener);
    }

    if (this.wildcard) {
      growListenerTree.call(this, type, listener, prepend);
      return returnValue;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    } else {
      if (typeof this._events[type] === 'function') {
        // Change to array.
        this._events[type] = [this._events[type]];
      }

      // If we've already got an array, just add
      if(prepend){
        this._events[type].unshift(listener);
      }else{
        this._events[type].push(listener);
      }

      // Check for listener leak
      if (
        !this._events[type].warned &&
        this._maxListeners > 0 &&
        this._events[type].length > this._maxListeners
      ) {
        this._events[type].warned = true;
        logPossibleMemoryLeak.call(this, this._events[type].length, type);
      }
    }

    return returnValue;
  };

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
      if(!leafs) return this;
    } else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }
        if (this._removeListener)
          this.emit("removeListener", type, listener);

        return this;
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }
        if (this._removeListener)
          this.emit("removeListener", type, listener);
      }
    }

    this.listenerTree && recursivelyGarbageCollect(this.listenerTree);

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          if (this._removeListener)
            this.emit("removeListenerAny", fn);
          return this;
        }
      }
    } else {
      fns = this._all;
      if (this._removeListener) {
        for(i = 0, l = fns.length; i < l; i++)
          this.emit("removeListenerAny", fns[i]);
      }
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function (type) {
    if (type === undefined) {
      !this._events || init.call(this);
      return this;
    }

    if (this.wildcard) {
      var leafs = searchListenerTree.call(this, null, type, this.listenerTree, 0), leaf, i;
      if (!leafs) return this;
      for (i = 0; i < leafs.length; i++) {
        leaf = leafs[i];
        leaf._listeners = null;
      }
      this.listenerTree && recursivelyGarbageCollect(this.listenerTree);
    } else if (this._events) {
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function (type) {
    var _events = this._events;
    var keys, listeners, allListeners;
    var i;
    var listenerTree;

    if (type === undefined) {
      if (this.wildcard) {
        throw Error('event name required for wildcard emitter');
      }

      if (!_events) {
        return [];
      }

      keys = ownKeys(_events);
      i = keys.length;
      allListeners = [];
      while (i-- > 0) {
        listeners = _events[keys[i]];
        if (typeof listeners === 'function') {
          allListeners.push(listeners);
        } else {
          allListeners.push.apply(allListeners, listeners);
        }
      }
      return allListeners;
    } else {
      if (this.wildcard) {
        listenerTree= this.listenerTree;
        if(!listenerTree) return [];
        var handlers = [];
        var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
        searchListenerTree.call(this, handlers, ns, listenerTree, 0);
        return handlers;
      }

      if (!_events) {
        return [];
      }

      listeners = _events[type];

      if (!listeners) {
        return [];
      }
      return typeof listeners === 'function' ? [listeners] : listeners;
    }
  };

  EventEmitter.prototype.eventNames = function(nsAsArray){
    var _events= this._events;
    return this.wildcard? collectTreeEvents.call(this, this.listenerTree, [], null, nsAsArray) : (_events? ownKeys(_events) : []);
  };

  EventEmitter.prototype.listenerCount = function(type) {
    return this.listeners(type).length;
  };

  EventEmitter.prototype.hasListeners = function (type) {
    if (this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers.length > 0;
    }

    var _events = this._events;
    var _all = this._all;

    return !!(_all && _all.length || _events && (type === undefined ? ownKeys(_events).length : _events[type]));
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  EventEmitter.prototype.waitFor = function (event, options) {
    var self = this;
    var type = typeof options;
    if (type === 'number') {
      options = {timeout: options};
    } else if (type === 'function') {
      options = {filter: options};
    }

    options= resolveOptions(options, {
      timeout: 0,
      filter: undefined,
      handleError: false,
      Promise: Promise,
      overload: false
    }, {
      filter: functionReducer,
      Promise: constructorReducer
    });

    return makeCancelablePromise(options.Promise, function (resolve, reject, onCancel) {
      function listener() {
        var filter= options.filter;
        if (filter && !filter.apply(self, arguments)) {
          return;
        }
        self.off(event, listener);
        if (options.handleError) {
          var err = arguments[0];
          err ? reject(err) : resolve(toArray.apply(null, arguments).slice(1));
        } else {
          resolve(toArray.apply(null, arguments));
        }
      }

      onCancel(function(){
        self.off(event, listener);
      });

      self._on(event, listener, false);
    }, {
      timeout: options.timeout,
      overload: options.overload
    })
  };

  function once(emitter, name, options) {
    options= resolveOptions(options, {
      Promise: Promise,
      timeout: 0,
      overload: false
    }, {
      Promise: constructorReducer
    });

    var _Promise= options.Promise;

    return makeCancelablePromise(_Promise, function(resolve, reject, onCancel){
      var handler;
      if (typeof emitter.addEventListener === 'function') {
        handler=  function () {
          resolve(toArray.apply(null, arguments));
        };

        onCancel(function(){
          emitter.removeEventListener(name, handler);
        });

        emitter.addEventListener(
            name,
            handler,
            {once: true}
        );
        return;
      }

      var eventListener = function(){
        errorListener && emitter.removeListener('error', errorListener);
        resolve(toArray.apply(null, arguments));
      };

      var errorListener;

      if (name !== 'error') {
        errorListener = function (err){
          emitter.removeListener(name, eventListener);
          reject(err);
        };

        emitter.once('error', errorListener);
      }

      onCancel(function(){
        errorListener && emitter.removeListener('error', errorListener);
        emitter.removeListener(name, eventListener);
      });

      emitter.once(name, eventListener);
    }, {
      timeout: options.timeout,
      overload: options.overload
    });
  }

  var prototype= EventEmitter.prototype;

  Object.defineProperties(EventEmitter, {
    defaultMaxListeners: {
      get: function () {
        return prototype._maxListeners;
      },
      set: function (n) {
        if (typeof n !== 'number' || n < 0 || Number.isNaN(n)) {
          throw TypeError('n must be a non-negative number')
        }
        prototype._maxListeners = n;
      },
      enumerable: true
    },
    once: {
      value: once,
      writable: true,
      configurable: true
    }
  });

  Object.defineProperties(prototype, {
      _maxListeners: {
          value: defaultMaxListeners,
          writable: true,
          configurable: true
      },
      _observers: {value: null, writable: true, configurable: true}
  });

  if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
    define(function() {
      return EventEmitter;
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = EventEmitter;
  }
  else {
    // global for any kind of environment.
    var _global= new Function('','return this')();
    _global.EventEmitter2 = EventEmitter;
  }
}();

}).call(this)}).call(this,require('_process'),require("timers").setImmediate)
},{"_process":37,"timers":38}],7:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":9}],8:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/buildFullPath":15,"../core/createError":16,"./../core/settle":20,"./../helpers/buildURL":24,"./../helpers/cookies":26,"./../helpers/isURLSameOrigin":29,"./../helpers/parseHeaders":31,"./../utils":34}],9:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":10,"./cancel/CancelToken":11,"./cancel/isCancel":12,"./core/Axios":13,"./core/mergeConfig":19,"./defaults":22,"./helpers/bind":23,"./helpers/isAxiosError":28,"./helpers/spread":32,"./utils":34}],10:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],11:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":10}],12:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],13:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');
var validator = require('../helpers/validator');

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":24,"../helpers/validator":33,"./../utils":34,"./InterceptorManager":14,"./dispatchRequest":17,"./mergeConfig":19}],14:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":34}],15:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":25,"../helpers/isAbsoluteURL":27}],16:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":18}],17:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":12,"../defaults":22,"./../utils":34,"./transformData":21}],18:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],19:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

},{"../utils":34}],20:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":16}],21:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var defaults = require('./../defaults');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

},{"./../defaults":22,"./../utils":34}],22:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');
var enhanceError = require('./core/enhanceError');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this)}).call(this,require('_process'))
},{"./adapters/http":8,"./adapters/xhr":8,"./core/enhanceError":18,"./helpers/normalizeHeaderName":30,"./utils":34,"_process":37}],23:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],24:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":34}],25:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],26:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":34}],27:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],28:[function(require,module,exports){
'use strict';

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

},{}],29:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":34}],30:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":34}],31:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":34}],32:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],33:[function(require,module,exports){
'use strict';

var pkg = require('./../../package.json');

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};

},{"./../../package.json":35}],34:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":23}],35:[function(require,module,exports){
module.exports={
  "name": "extrareqp2",
  "version": "1.0.0",
  "description": "Promise based HTTP client for the browser and node.js",
  "main": "index.js",
  "scripts": {
    "test": "grunt test",
    "start": "node ./sandbox/server.js",
    "build": "NODE_ENV=production grunt build",
    "preversion": "npm test",
    "version": "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
    "postversion": "git push && git push --tags",
    "examples": "node ./examples/server.js",
    "coveralls": "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
    "fix": "eslint --fix lib/**/*.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/keymetrics/extrareqp2"
  },
  "keywords": [
    "xhr",
    "http",
    "ajax",
    "promise",
    "node"
  ],
  "author": "Matt Zabriskie",
  "license": "MIT",
  "homepage": "https://axios-http.com",
  "devDependencies": {
    "coveralls": "^3.0.0",
    "es6-promise": "^4.2.4",
    "grunt": "^1.3.0",
    "grunt-banner": "^0.6.0",
    "grunt-cli": "^1.2.0",
    "grunt-contrib-clean": "^1.1.0",
    "grunt-contrib-watch": "^1.0.0",
    "grunt-eslint": "^23.0.0",
    "grunt-karma": "^4.0.0",
    "grunt-mocha-test": "^0.13.3",
    "grunt-ts": "^6.0.0-beta.19",
    "grunt-webpack": "^4.0.2",
    "istanbul-instrumenter-loader": "^1.0.0",
    "jasmine-core": "^2.4.1",
    "karma": "^6.3.2",
    "karma-chrome-launcher": "^3.1.0",
    "karma-firefox-launcher": "^2.1.0",
    "karma-jasmine": "^1.1.1",
    "karma-jasmine-ajax": "^0.1.13",
    "karma-safari-launcher": "^1.0.0",
    "karma-sauce-launcher": "^4.3.6",
    "karma-sinon": "^1.0.5",
    "karma-sourcemap-loader": "^0.3.8",
    "karma-webpack": "^4.0.2",
    "load-grunt-tasks": "^3.5.2",
    "minimist": "^1.2.0",
    "mocha": "^8.2.1",
    "sinon": "^4.5.0",
    "terser-webpack-plugin": "^4.2.3",
    "typescript": "^4.0.5",
    "url-search-params": "^0.10.0",
    "webpack": "^4.44.2",
    "webpack-dev-server": "^3.11.0"
  },
  "browser": {
    "./lib/adapters/http.js": "./lib/adapters/xhr.js"
  },
  "jsdelivr": "dist/axios.min.js",
  "unpkg": "dist/axios.min.js",
  "typings": "./index.d.ts",
  "dependencies": {
    "follow-redirects": "^1.14.0"
  },
  "bundlesize": [
    {
      "path": "./dist/axios.min.js",
      "threshold": "5kB"
    }
  ]
}

},{}],36:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],37:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],38:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":37,"timers":38}],39:[function(require,module,exports){
module.exports={
  "name": "@pm2/js-api",
  "version": "0.8.0",
  "description": "PM2.io API Client for Javascript",
  "main": "index.js",
  "unpkg": "dist/keymetrics.es5.min.js",
  "engines": {
    "node": ">=4.0"
  },
  "scripts": {
    "test": "mocha test/*",
    "build": "mkdir -p dist; browserify -s Keymetrics -r ./ > ./dist/keymetrics.es5.js",
    "dist": "mkdir -p dist; browserify -s Keymetrics -r ./ | uglifyjs -c warnings=false -m > ./dist/keymetrics.es5.min.js",
    "doc": "jsdoc -r ./src --readme ./README.md -d doc -t ./node_modules/minami",
    "clean": "rm dist/*",
    "prepare": "npm run build && npm run dist"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/keymetrics/km.js.git"
  },
  "keywords": [
    "keymetrics",
    "api",
    "dashboard",
    "monitoring",
    "wrapper"
  ],
  "author": "Keymetrics Team",
  "license": "Apache-2",
  "bugs": {
    "url": "https://github.com/keymetrics/km.js/issues"
  },
  "homepage": "https://github.com/keymetrics/km.js#readme",
  "dependencies": {
    "async": "^2.6.3",
    "extrareqp2": "^1.0.0",
    "debug": "~4.3.1",
    "eventemitter2": "^6.3.1",
    "ws": "^7.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.0.0",
    "@babel/preset-env": "^7.0.0",
    "babelify": "10.0.0",
    "browserify": "^17.0.0",
    "jsdoc": "^3.4.2",
    "minami": "^1.1.1",
    "mocha": "^7.0.0",
    "should": "*",
    "uglify-es": "~3.3.9"
  },
  "browserify": {
    "debug": true,
    "transform": [
      [
        "babelify",
        {
          "presets": [
            [
              "@babel/preset-env",
              {
                "debug": false,
                "forceAllTransforms": true
              }
            ]
          ],
          "sourceMaps": true
        }
      ]
    ]
  },
  "browser": {
    "./src/auth_strategies/embed_strategy.js": false,
    "ws": false
  }
}

},{}],40:[function(require,module,exports){
module.exports={"actions":[{"route":{"name":"/api/bucket/:id/actions/trigger","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"server_name","type":"string","description":"the name of the server","optional":false,"defaultvalue":null},{"name":"process_id","type":"number","description":"the id of the process","optional":true,"defaultvalue":null},{"name":"app_name","type":"number","description":"the name of the process","optional":true,"defaultvalue":null},{"name":"action_name","type":"string","description":"the name of the action to trigger","optional":false,"defaultvalue":null},{"name":"opts","type":"object","description":"any specific options to be passed to the function","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully run the action","optional":false}],"response":[{"name":"success","type":"boolean","description":"succesully sended the action to PM2","optional":false,"defaultvalue":null}],"name":"triggerAction","longname":"Actions.triggerAction","scope":"route"},{"route":{"name":"/api/bucket/:id/actions/triggerPM2","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"server_name","type":"string","description":"the name of the server","optional":false,"defaultvalue":null},{"name":"method_name","type":"string","description":"the name of the pm2 method to trigger","optional":false,"defaultvalue":null},{"name":"app_name","type":"string","description":"the name of the application","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"failed action","optional":false},{"type":"200","description":"succesfully run the action","optional":false}],"response":[{"name":"success","type":"boolean","description":"succesully sended the action to PM2","optional":false,"defaultvalue":null}],"name":"triggerPM2Action","longname":"Actions.triggerPM2Action","scope":"route"},{"route":{"name":"/api/bucket/:id/actions/triggerScopedAction","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"server_name","type":"string","description":"the name of the server","optional":false,"defaultvalue":null},{"name":"action_name","type":"string","description":"the name of the pm2 method to trigger","optional":false,"defaultvalue":null},{"name":"app_name","type":"string","description":"the name of the application","optional":false,"defaultvalue":null},{"name":"pm_id","type":"number","description":"the id of the process","optional":false,"defaultvalue":null},{"name":"opts","type":"object","description":"custom parameters to give to the action","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully run the action","optional":false}],"response":[{"name":".","type":"object","description":"the action sended to the process","optional":false,"defaultvalue":null}],"name":"triggerScopedAction","longname":"Actions.triggerScopedAction","scope":"route"}],"bucket":{"alert":{"analyzer":[{"route":{"name":"/api/bucket/:id/alerts/analyzer","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"size","type":"integer","description":"line limit, default to 20","optional":true,"defaultvalue":null},{"name":"from","type":"integer","description":"offset limit","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"list all alerts","optional":false}],"name":"list","longname":"Bucket.alert.analyzer.list","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/alerts/analyzer/:alert","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":alert","type":"string","description":"alert id","optional":false}],"body":[{"name":"useful","type":"boolean","description":"","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"content modified","optional":false}],"name":"editState","longname":"Bucket.alert.analyzer.editState","scope":"route"},{"route":{"name":"/api/bucket/:id/alerts/analyzer/:analyzer/config","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":analyzer","type":"string","description":"analyzer name","optional":false}],"body":[{"name":"blacklist","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"blacklist.apps","type":"array","description":"","optional":true,"defaultvalue":null},{"name":"blacklist.servers","type":"array","description":"","optional":true,"defaultvalue":null},{"name":"blacklist.metrics","type":"array","description":"","optional":true,"defaultvalue":null},{"name":"threshold","type":"number","description":"","optional":false,"defaultvalue":null},{"name":"window","type":"number","description":"","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"content modified","optional":false}],"name":"updateConfig","longname":"Bucket.alert.analyzer.updateConfig","scope":"route"}],"default":[{"route":{"name":"/api/bucket/:id/alerts","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"name","type":"string","description":"Alert name","optional":false,"defaultvalue":null},{"name":"enabled","type":"boolean","description":"Alert's state","optional":true,"defaultvalue":null},{"name":"type","type":"string","description":"Should be `metric`, `event` or `webcheck`","optional":false,"defaultvalue":null},{"name":"initiator","type":"string","description":"Should be metric name or event name","optional":false,"defaultvalue":null},{"name":"options","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"options.operator","type":"string","description":"Should be `>`, `<`, `=`, `>=` or `<=`","optional":true,"defaultvalue":null},{"name":"options.threshold","type":"number","description":"Value to reach to send an alert","optional":true,"defaultvalue":null},{"name":"options.act","type":"string","description":"Should be `always`, `opposite`, `first` or `diff`","optional":true,"defaultvalue":null},{"name":"options.timerange","type":"number","description":"Timerange to check, in seconds","optional":true,"defaultvalue":null},{"name":"scope","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"scope.apps","type":"object","description":"Array of strings with apps name (can be empty)","optional":true,"defaultvalue":null},{"name":"scope.servers","type":"object","description":"Array of strings with servers name (can be empty)","optional":true,"defaultvalue":null},{"name":"scope.initiators","type":"object","description":"Array of strings with initiators name (need to be set if no apps or servers)","optional":true,"defaultvalue":null},{"name":"scope.sources","type":"object","description":"Array of strings with sources name (can be empty)","optional":true,"defaultvalue":null},{"name":"actions","type":"object","description":"List of actions to trigger","optional":false,"defaultvalue":null},{"name":"actions[].type","type":"string","description":"Type of action","optional":true,"defaultvalue":null},{"name":"actions[].params","type":"object","description":"Params for action","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"missing parameters","optional":false},{"type":"200","description":"successfuly created alert","optional":false}],"name":"create","longname":"Bucket.alert.create","scope":"route"},{"route":{"name":"/api/bucket/:id/alerts/:alert","type":"DELETE"},"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":alert","type":"string","description":"alert id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"204","description":"successfuly deleted alert","optional":false}],"name":"delete","longname":"Bucket.alert.delete","scope":"route","authentication":false},{"route":{"name":"/api/bucket/:id/alerts/","type":"GET"},"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"list all alerts","optional":false}],"name":"list","longname":"Bucket.alert.list","scope":"route","authentication":false},{"route":{"name":"/api/bucket/:id/alerts/:alert","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":alert","type":"string","description":"alert id","optional":false}],"body":[{"name":"name","type":"string","description":"Alert name","optional":true,"defaultvalue":null},{"name":"enabled","type":"boolean","description":"Alert's state","optional":true,"defaultvalue":null},{"name":"type","type":"string","description":"Should be `metric`, `event` or `webcheck`","optional":true,"defaultvalue":null},{"name":"initiator","type":"string","description":"Should be metric name or event name","optional":true,"defaultvalue":null},{"name":"options","type":"object","description":"","optional":true,"defaultvalue":null},{"name":"options.operator","type":"string","description":"Should be `>`, `<`, `=`, `<=` or `>=`","optional":true,"defaultvalue":null},{"name":"options.threshold","type":"number","description":"Value to reach to send an alert","optional":true,"defaultvalue":null},{"name":"options.act","type":"string","description":"Should be `always`, `opposite`, `first` or `diff`","optional":true,"defaultvalue":null},{"name":"options.timerange","type":"number","description":"Timerange to check, in seconds","optional":true,"defaultvalue":null},{"name":"scope","type":"object","description":"","optional":true,"defaultvalue":null},{"name":"scope.apps","type":"array","description":"Array of strings with apps name (can be empty)","optional":true,"defaultvalue":null},{"name":"scope.servers","type":"array","description":"Array of strings with servers name (can be empty)","optional":true,"defaultvalue":null},{"name":"scope.initiators","type":"object","description":"Array of strings with initiators name (need to be set if no apps or servers)","optional":true,"defaultvalue":null},{"name":"scope.sources","type":"object","description":"Array of strings with sources name (can be empty)","optional":true,"defaultvalue":null},{"name":"actions","type":"array","description":"List of actions to trigger","optional":true,"defaultvalue":null},{"name":"actions[].type","type":"string","description":"Type of action","optional":true,"defaultvalue":null},{"name":"actions[].params","type":"object","description":"Params for action","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"missing parameters","optional":false},{"type":"404","description":"alert not found","optional":false},{"type":"200","description":"successfuly created alert","optional":false}],"name":"updateAlert","longname":"Bucket.alert.updateAlert","scope":"route"},{"route":{"name":"/api/bucket/:id/alerts/:alert","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":alert","type":"string","description":"alert id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"404","description":"alert not found","optional":false},{"type":"200","description":"successfuly returned alert","optional":false}],"name":"get","longname":"Bucket.alert.get","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/alerts/:alert/sample","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":alert","type":"string","description":"alert id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"404","description":"alert not found","optional":false},{"type":"202","description":"successfuly sended alert actions","optional":false}],"name":"triggerSample","longname":"Bucket.alert.triggerSample","scope":"route"},{"route":{"name":"/api/bucket/:id/alerts/update","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"triggers","type":"object","description":"","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"missing triggers parameter","optional":false},{"type":"200","description":"succesfully update triggers","optional":false}],"response":[{"name":"triggers","type":"object","description":"new triggers object","optional":false,"defaultvalue":null}],"name":"update","longname":"Bucket.alert.update","scope":"route"},{"route":{"name":"/api/bucket/:id/alerts/updateSlack","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"slack","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"slack.active","type":"boolean","description":"","optional":true,"defaultvalue":null},{"name":"slack.url","type":"boolean","description":"needed if active is set to true","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"missing triggers parameter","optional":false},{"type":"200","description":"succesfully update triggers","optional":false}],"response":[{"name":"bucket","type":"object","description":"","optional":false,"defaultvalue":null}],"name":"updateSlack","longname":"Bucket.alert.updateSlack","scope":"route"},{"route":{"name":"/api/bucket/:id/alerts/updateWebhooks","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"webhooks","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"webhooks.active","type":"boolean","description":"","optional":true,"defaultvalue":null},{"name":"webhooks.url","type":"boolean","description":"needed if active is set to true","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"missing triggers parameter","optional":false},{"type":"200","description":"succesfully update triggers","optional":false}],"response":[{"name":"bucket","type":"object","description":"","optional":false,"defaultvalue":null}],"name":"updateWebhooks","longname":"Bucket.alert.updateWebhooks","scope":"route"}]},"application":[{"route":{"name":"/api/bucket/:id/applications","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"successfuly retrieved applications","optional":false}],"name":"list","longname":"Bucket.application.list","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/applications/:application","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":application","type":"string","description":"application id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"404","description":"application not found","optional":false},{"type":"200","description":"successfuly retrieved application","optional":false}],"name":"get","longname":"Bucket.application.get","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/applications","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"name","type":"string","description":"","optional":false,"defaultvalue":null},{"name":"domains","type":"object","description":"Array of string with domains","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"missing parameters","optional":false},{"type":"200","description":"successfuly created application","optional":false}],"name":"create","longname":"Bucket.application.create","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/applications/:application","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":application","type":"string","description":"application id","optional":false}],"body":[{"name":"name","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"domains","type":"object","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"missing parameters","optional":false},{"type":"200","description":"successfuly updated application","optional":false}],"name":"update","longname":"Bucket.application.update","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/applications/:application","type":"DELETE"},"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":application","type":"string","description":"application id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"204","description":"successfuly deleted application","optional":false}],"name":"delete","longname":"Bucket.application.delete","scope":"route","async":true,"authentication":false},{"route":{"name":"/api/bucket/:id/applications/:application/preview","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":application","type":"string","description":"application id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"404","description":"preview not found","optional":false},{"type":"200","description":"successfuly retrieved application screenshot","optional":false}],"name":"getPreview","longname":"Bucket.application.getPreview","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/applications/:application/report","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":application","type":"string","description":"application id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"404","description":"report not found","optional":false},{"type":"200","description":"successfuly retrieved application report","optional":false}],"name":"getReports","longname":"Bucket.application.getReports","scope":"route","async":true}],"billing":[{"route":{"name":"/api/bucket/:id/payment/subscribe","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"plan","type":"string","description":"name of the plan to upgrade to","optional":false,"defaultvalue":null},{"name":"stripe_token","type":"string","description":"a card token created by stripe","optional":true,"defaultvalue":null},{"name":"coupon_id","type":"string","description":"the id of the stripe coupon","optional":true,"defaultvalue":null}],"code":[{"type":"400","description":"missing/invalid parameters","optional":false},{"type":"403","description":"need a credit card OR not allowed to subscribe to the plan","optional":false},{"type":"500","description":"stripe/database error","optional":false},{"type":"200","description":"succesfully upgraded","optional":false}],"response":[{"name":"bucket","type":"object","description":"the bucket object","optional":false,"defaultvalue":null},{"name":"subscription","type":"object","description":"the subscription object attached to the subscription","optional":false,"defaultvalue":null}],"name":"subscribe","longname":"Bucket.billing.subscribe","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/payment/subscribe/:paymentIntent","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":paymentIntent","type":"string","description":"paymentIntent id","optional":false}],"body":[{"name":"plan","type":"string","description":"name of the plan to upgrade to","optional":false,"defaultvalue":null}],"code":[{"type":"400","description":"missing/invalid parameters","optional":false},{"type":"500","description":"stripe/database error","optional":false},{"type":"200","description":"succesfully upgraded","optional":false}],"response":[{"name":"bucket","type":"object","description":"the bucket object","optional":false,"defaultvalue":null}],"name":"paymentIntentSucceed","longname":"Bucket.billing.paymentIntentSucceed","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/payment/trial","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"plan","type":"string","description":"Plan to trial","optional":false,"defaultvalue":null}],"code":[{"type":"400","description":"can't claim trial","optional":false},{"type":"200","description":"trial launched","optional":false}],"response":[{"name":"duration","type":"string","description":"the duration of the trial","optional":false,"defaultvalue":null},{"name":"plan","type":"string","description":"the plan of the trial","optional":false,"defaultvalue":null}],"name":"startTrial","longname":"Bucket.billing.startTrial","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/payment/invoices","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"400","description":"Missing/invalid parameters","optional":false},{"type":"404","description":"This bucket hasn't invoices","optional":false},{"type":"200","description":"succesfully returns invoices","optional":false}],"response":[{"name":".","type":"array","description":"array of invoices","optional":false,"defaultvalue":null}],"name":"getInvoices","longname":"Bucket.billing.getInvoices","scope":"route"},{"route":{"name":"/api/bucket/:id/payment/receipts","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"400","description":"Missing/invalid parameters","optional":false},{"type":"404","description":"This bucket hasn't receipts","optional":false},{"type":"200","description":"succesfully returns receipts","optional":false}],"response":[{"name":".","type":"array","description":"array of receipts","optional":false,"defaultvalue":null}],"name":"getReceipts","longname":"Bucket.billing.getReceipts","scope":"route"},{"route":{"name":"/api/bucket/:id/payment/subscription","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"404","description":"the bucket doesnt have any subscription","optional":false},{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved the subscription","optional":false}],"response":[{"name":".","type":"object","description":"subscription object","optional":false,"defaultvalue":null}],"name":"getSubcription","longname":"Bucket.billing.getSubcription","scope":"route"},{"route":{"name":"/api/bucket/:id/payment/subscription/state","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"404","description":"the bucket doesnt have any subscription","optional":false},{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved the subscription","optional":false}],"response":[{"name":"status","type":"string","description":"stripe state of the subscription","optional":false,"defaultvalue":null},{"name":"plan","type":"string","description":"stripe plan name of the subscription","optional":false,"defaultvalue":null},{"name":"canceled_at","type":"string","description":"if he sub has been cancelled, add the date","optional":false,"defaultvalue":null}],"name":"getSubcriptionState","longname":"Bucket.billing.getSubcriptionState","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/payment/cards","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"token","type":"string","description":"card token generated by stripe","optional":false,"defaultvalue":null}],"code":[{"type":"400","description":"missing parameters","optional":false},{"type":"500","description":"stripe error","optional":false},{"type":"200","description":"succesfully added the card","optional":false}],"response":[{"name":"data","type":"object","description":"stripe credit card Object","optional":false,"defaultvalue":null}],"name":"attachCreditCard","longname":"Bucket.billing.attachCreditCard","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/payment/cards","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"404","description":"the user doesn't have any default card","optional":false},{"type":"200","description":"succesfully retieved the charges","optional":false}],"response":[{"name":"data","type":"array","description":"list of stripe cards object","optional":false,"defaultvalue":null}],"name":"fetchCreditCards","longname":"Bucket.billing.fetchCreditCards","scope":"route"},{"route":{"name":"/api/bucket/:id/payment/card/:card_id","type":"GET"},"authentication":true,"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":card_id","type":"string","description":"the stripe id of the card","optional":false}],"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"400","description":"missing parameters card_id","optional":false},{"type":"404","description":"the user doesn't have any default card","optional":false},{"type":"200","description":"succesfully retieved the card","optional":false}],"response":[{"name":"data","type":"array","description":"stripe card object","optional":false,"defaultvalue":null}],"name":"fetchCreditCard","longname":"Bucket.billing.fetchCreditCard","scope":"route"},{"route":{"name":"/api/bucket/:id/payment/card","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"404","description":"the user doesn't have any default card","optional":false},{"type":"200","description":"succesfully retieved the card","optional":false}],"response":[{"name":"data","type":"array","description":"stripe card object","optional":false,"defaultvalue":null}],"name":"fetchDefaultCreditCard","longname":"Bucket.billing.fetchDefaultCreditCard","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/payment/card","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"id","type":"string","description":"stripe card id","optional":false,"defaultvalue":null},{"name":"address_line1","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"address_country","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"address_zip","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"address_city","type":"string","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"400","description":"missing parameters, you need to specify a card","optional":false},{"type":"200","description":"succesfully updated the card","optional":false}],"response":[{"name":"data","type":"array","description":"stripe card object","optional":false,"defaultvalue":null}],"name":"updateCreditCard","longname":"Bucket.billing.updateCreditCard","scope":"route"},{"route":{"name":"/api/bucket/:id/payment/card/:card_id","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":card_id","type":"string","description":"the stripe id of the card","optional":false}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"400","description":"missing parameters card_id","optional":false},{"type":"200","description":"succesfully retieved the card","optional":false},{"type":"403","description":"the user must have one card active when having a subscription","optional":false}],"response":[{"name":".","type":"object","description":"stripe card object","optional":false,"defaultvalue":null}],"name":"deleteCreditCard","longname":"Bucket.billing.deleteCreditCard","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/payment/card/:card_id/default","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":card_id","type":"string","description":"the stripe id of the card","optional":false}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"400","description":"missing parameters card_id","optional":false},{"type":"200","description":"succesfully set the card as default","optional":false}],"response":[{"name":"data","type":"object","description":"stripe card object","optional":false,"defaultvalue":null}],"name":"setDefaultCard","longname":"Bucket.billing.setDefaultCard","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/payment","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"400","description":"missing parameters card_id","optional":false},{"type":"200","description":"succesfully retrieved the metadata","optional":false}],"response":[{"name":".","type":"object","description":"stripe metadata object","optional":false,"defaultvalue":null}],"name":"fetchMetadata","longname":"Bucket.billing.fetchMetadata","scope":"route"},{"route":{"name":"/api/bucket/:id/payment","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"metadata","type":"object","description":"the metadata you can update","optional":false,"defaultvalue":null},{"name":"metadata.vat_number","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"metadata.company_name","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"metadata.receipt_email","type":"string","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"400","description":"missing parameters, you need to specify a card","optional":false},{"type":"200","description":"succesfully updated the card","optional":false}],"response":[{"name":"data","type":"array","description":"stripe customer metadata object","optional":false,"defaultvalue":null}],"name":"updateMetadata","longname":"Bucket.billing.updateMetadata","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/payment/banks","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"iban","type":"string","description":"the iban used to recognize the account","optional":true,"defaultvalue":null},{"name":"type","type":"string","description":"the type of the bank account (currently only sepa is available)","optional":false,"defaultvalue":null},{"name":"name","type":"string","description":"name of the bank account owner","optional":false,"defaultvalue":null}],"code":[{"type":"400","description":"missing parameters","optional":false},{"type":"500","description":"stripe error","optional":false},{"type":"200","description":"succesfully added the account","optional":false}],"response":[{"name":"data","type":"object","description":"stripe credit card Object","optional":false,"defaultvalue":null}],"name":"attachBankAccount","longname":"Bucket.billing.attachBankAccount","scope":"route"},{"route":{"name":"/api/bucket/:id/payment/banks","type":"GET"},"authentication":true,"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"404","description":"the user doesn't have any default account","optional":false},{"type":"200","description":"succesfully retieved the card","optional":false}],"response":[{"name":"data","type":"object","description":"stripe source object","optional":false,"defaultvalue":null}],"name":"fetchBankAccount","longname":"Bucket.billing.fetchBankAccount","scope":"route"},{"route":{"name":"/api/bucket/:id/payment/banks","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"200","description":"succesfully retieved the card","optional":false},{"type":"404","description":"the user doesn't have any default account","optional":false}],"response":[{"name":".","type":"object","description":"stripe source object","optional":false,"defaultvalue":null}],"name":"deleteBankAccount","longname":"Bucket.billing.deleteBankAccount","scope":"route"}],"dashboardschema":[{"route":{"name":"/api/bucket/:id/dashboardSchema/","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"name","type":"string","description":"the name of the dashboard","optional":false,"defaultvalue":null},{"name":"data","type":"object","description":"the list of component that compose the dashboard","optional":false,"defaultvalue":null},{"name":"mode","type":"string","description":"the dashboard mode","optional":false,"defaultvalue":null},{"name":"image","type":"object","description":"background image for the dashboard","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully created dashboard","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":".","type":"dashboard","description":"complete dashboard object from database","optional":false,"defaultvalue":null}],"name":"create","longname":"Bucket.dashboardschema.create","scope":"route"},{"route":{"name":"/api/bucket/:id/dashboardSchema/","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":".","type":"array","description":"array of servers status","optional":false,"defaultvalue":null}],"name":"retrieveAll","longname":"Bucket.dashboardschema.retrieveAll","scope":"route"},{"route":{"name":"/api/bucket/:id/dashboardSchema/:dashid/visualization","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":dashid","type":"string","description":"dashboard id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"404","description":"dashboard not found","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":".","type":"array","description":"array of dashboards","optional":false,"defaultvalue":null}],"name":"visualization","longname":"Bucket.dashboardschema.visualization","scope":"route"},{"route":{"name":"/api/bucket/:id/dashboardSchema/:dashid","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":dashid","type":"string","description":"dashboard id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"404","description":"dashboard not found","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":".","type":"array","description":"array of dashboards","optional":false,"defaultvalue":null}],"name":"retrieve","longname":"Bucket.dashboardschema.retrieve","scope":"route"},{"route":{"name":"/api/bucket/:id/dashboardSchema/:dashid","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":dashid","type":"string","description":"dashboard id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully deleted dashboard","optional":false},{"type":"400","description":"Invalid params","optional":false},{"type":"404","description":"dashboard not found","optional":false}],"response":[{"name":".","type":"array","description":"array of dashboards","optional":false,"defaultvalue":null}],"name":"remove","longname":"Bucket.dashboardschema.remove","scope":"route"},{"route":{"name":"/api/bucket/:id/dashboardSchema/:dashId","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":dashId","type":"string","description":"dashboard id","optional":false}],"body":[{"name":"name","type":"string","description":"the name of the dashboard","optional":false,"defaultvalue":null},{"name":"data","type":"object","description":"the data to populate the dashboard","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"404","description":"dashboard not found","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":".","type":"array","description":"array of servers status","optional":false,"defaultvalue":null}],"name":"update","longname":"Bucket.dashboardschema.update","scope":"route"}],"server":[{"route":{"name":"/api/bucket/:id/data/deleteServer","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"server_name","type":"string","description":"the name of server","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"406","description":"require an action before delete","optional":false},{"type":"400","description":"missing or invalid parameters","optional":false},{"type":"200","description":"successfully deleted","optional":false}],"response":[{"name":"success","type":"boolean","description":"can be true or false","optional":false,"defaultvalue":null},{"name":"msg","type":"string","description":"response","optional":false,"defaultvalue":null}],"name":"deleteServer","longname":"Bucket.server.deleteServer","scope":"route"}],"webcheck":[{"route":{"name":"/api/bucket/:id/webchecks/metrics","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"successfuly retrieved webchecks metrics","optional":false}],"name":"listMetrics","longname":"Bucket.webcheck.listMetrics","scope":"route"},{"route":{"name":"/api/bucket/:id/webchecks/regions","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"successfuly retrieved webchecks regions","optional":false}],"name":"listRegions","longname":"Bucket.webcheck.listRegions","scope":"route"},{"route":{"name":"/api/bucket/:id/webchecks/:webcheck/metrics","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":webcheck","type":"string","description":"webcheck id","optional":false}],"body":[{"name":"start","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"metrics","type":"array","description":"","optional":true,"defaultvalue":null},{"name":"end","type":"string","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"successfuly retrieved webchecks regions","optional":false}],"name":"getMetrics","longname":"Bucket.webcheck.getMetrics","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/webchecks","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"query":[{"name":"application","type":"string","description":"Application's id to filter","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"successfuly retrieved webchecks","optional":false}],"name":"list","longname":"Bucket.webcheck.list","scope":"route"},{"route":{"name":"/api/bucket/:id/webchecks/:webcheck","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":webcheck","type":"string","description":"webcheck id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"404","description":"webcheck not found","optional":false},{"type":"200","description":"successfuly retrieved webcheck","optional":false}],"name":"get","longname":"Bucket.webcheck.get","scope":"route"},{"route":{"name":"/api/bucket/:id/webchecks","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"name","type":"string","description":"Webcheck name","optional":false,"defaultvalue":null},{"name":"enabled","type":"boolean","description":"Webcheck's state","optional":true,"defaultvalue":null},{"name":"target","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"target.type","type":"string","description":"Should be `http`, `https` or `tcp`","optional":true,"defaultvalue":null},{"name":"target.port","type":"number","description":"Target's port","optional":true,"defaultvalue":null},{"name":"target.address","type":"string","description":"Target's IP/domain","optional":true,"defaultvalue":null},{"name":"target.path","type":"string","description":"HTTP Path (only for http/https)","optional":true,"defaultvalue":null},{"name":"target.is_frontend","type":"boolean","description":"Enable or disable frontend metrics (via puppeteer)","optional":true,"defaultvalue":null},{"name":"body","type":"string","description":"Body need to match this regex to succeed webcheck (only for http/https)","optional":true,"defaultvalue":null},{"name":"interval","type":"number","description":"Webcheck's interval check (ms)","optional":false,"defaultvalue":null},{"name":"timeout","type":"number","description":"Webcheck's timeout (ms)","optional":false,"defaultvalue":null},{"name":"source","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"source.region","type":"string","description":"Webcheck's worker region","optional":true,"defaultvalue":null},{"name":"retry","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"retry.max","type":"number","description":"Max webcheck's retry before mark as failed","optional":true,"defaultvalue":null},{"name":"retry.interval","type":"number","description":"Webcheck's retry interval (ms)","optional":true,"defaultvalue":null},{"name":"alerts","type":"object","description":"List of alerts (cf. Alert type)","optional":false,"defaultvalue":null},{"name":"application","type":"string","description":"Application's id","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"missing parameters","optional":false},{"type":"200","description":"successfuly created webcheck","optional":false}],"name":"create","longname":"Bucket.webcheck.create","scope":"route"},{"route":{"name":"/api/bucket/:id/webchecks/:webcheck","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":webcheck","type":"string","description":"webcheck id","optional":false}],"body":[{"name":"name","type":"string","description":"Webcheck name","optional":true,"defaultvalue":null},{"name":"enabled","type":"boolean","description":"Webcheck's state","optional":true,"defaultvalue":null},{"name":"target","type":"object","description":"","optional":true,"defaultvalue":null},{"name":"target.type","type":"string","description":"Should be `http`, `https` or `tcp`","optional":true,"defaultvalue":null},{"name":"target.port","type":"number","description":"Target's port","optional":true,"defaultvalue":null},{"name":"target.address","type":"string","description":"Target's IP/domain","optional":true,"defaultvalue":null},{"name":"target.path","type":"string","description":"HTTP Path (only for http/https)","optional":true,"defaultvalue":null},{"name":"target.is_frontend","type":"boolean","description":"Enable or disable frontend metrics (via puppeteer)","optional":true,"defaultvalue":null},{"name":"body","type":"string","description":"Body need to match this regex to succeed webcheck (only for http/https)","optional":true,"defaultvalue":null},{"name":"interval","type":"number","description":"Webcheck's interval check (ms)","optional":true,"defaultvalue":null},{"name":"timeout","type":"number","description":"Webcheck's timeout (ms)","optional":true,"defaultvalue":null},{"name":"source","type":"object","description":"","optional":true,"defaultvalue":null},{"name":"source.region","type":"string","description":"Webcheck's worker region","optional":true,"defaultvalue":null},{"name":"retry","type":"object","description":"","optional":true,"defaultvalue":null},{"name":"retry.max","type":"number","description":"Max webcheck's retry before mark as failed","optional":true,"defaultvalue":null},{"name":"retry.interval","type":"number","description":"Webcheck's retry interval (ms)","optional":true,"defaultvalue":null},{"name":"alerts","type":"object","description":"List of alerts (cf. Alert type)","optional":true,"defaultvalue":null},{"name":"application","type":"string","description":"Application's id","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"missing parameters","optional":false},{"type":"200","description":"successfuly updated webcheck","optional":false}],"name":"update","longname":"Bucket.webcheck.update","scope":"route"},{"route":{"name":"/api/bucket/:id/webchecks/:webcheck","type":"DELETE"},"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":webcheck","type":"string","description":"webcheck id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"204","description":"successfuly deleted webcheck","optional":false}],"name":"delete","longname":"Bucket.webcheck.delete","scope":"route","authentication":false}],"default":[{"route":{"name":"/api/bucket/:id/feedback","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"feedback","type":"string","description":"the feedback text","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"missing feedback field","optional":false},{"type":"200","description":"succesfully registered the feedback","optional":false}],"response":[{"name":"feedback","type":"string","description":"the feedback that hasn't been registered","optional":false,"defaultvalue":null}],"name":"sendFeedback","longname":"Bucket.sendFeedback","scope":"route"},{"name":"retrieveUsers","route":{"name":"/api/bucket/:id/users_authorized","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved bucket's members","optional":false}],"response":[{"name":".","type":"array","description":"a array of user containing their email, username and roles","optional":false,"defaultvalue":null}],"longname":"Bucket.retrieveUsers","scope":"route"},{"name":"currentRole","route":{"name":"/api/bucket/:id/current_role","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"200","description":"succesfully retrieved the use role","optional":false}],"response":[{"name":"role","type":"string","description":"the user role","optional":false,"defaultvalue":null}],"longname":"Bucket.currentRole","scope":"route"},{"route":{"name":"/api/bucket/:id/manage_notif","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"email","type":"string","description":"the user email","optional":false,"defaultvalue":null},{"name":"state","type":"string","description":"the notification state you want to set for that user\n (either 'email' or 'nonde)","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"404","description":"user not found","optional":false}],"response":[{"name":".","type":"array","description":"array of state for each user","optional":false,"defaultvalue":null}],"name":"setNotificationState","longname":"Bucket.setNotificationState","scope":"route"},{"name":"inviteUser","route":{"name":"/api/bucket/:id/add_user","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"email","type":"string","description":"the email of the user","optional":false,"defaultvalue":null}],"code":[{"type":"400","description":"missing/invalid parameters","optional":false},{"type":"403","description":"you cant invit more users because you hit the bucket limit","optional":false},{"type":"200","description":"succesfully invited the user (either directly or by email)","optional":false}],"response":[{"name":"invitations","type":"array","description":"the list of invitations actually active","optional":false,"defaultvalue":null}],"longname":"Bucket.inviteUser","scope":"route"},{"route":{"name":"/api/bucket/:id/invitation","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"query":[{"name":"email","type":"string","description":"the email of the invitation you want to delete","optional":true,"defaultvalue":null}],"code":[{"type":"400","description":"invalid/missing parameters","optional":false},{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully deleted the invitation","optional":false}],"response":[{"name":"invitations","type":"array","description":"the list of invitations actually active","optional":false,"defaultvalue":null}],"name":"removeInvitation","longname":"Bucket.removeInvitation","scope":"route"},{"route":{"name":"/api/bucket/:id/remove_user","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"email","type":"string","description":"the email of the user you want to remove","optional":false,"defaultvalue":null}],"code":[{"type":"400","description":"missing/invalid parameters","optional":false},{"type":"404","description":"user not found","optional":false},{"type":"403","description":"impossible to remove the owner from the bucket","optional":false},{"type":"500","description":"database error","optional":false}],"response":[{"name":".","type":"array","description":"a array of user containing their email, username and roles","optional":false,"defaultvalue":null}],"name":"removeUser","longname":"Bucket.removeUser","scope":"route"},{"route":{"name":"/api/bucket/:id/promote_user","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"email","type":"string","description":"the email of the user you want to change the role","optional":false,"defaultvalue":null},{"name":"role","type":"string","description":"the role you want to set","optional":false,"defaultvalue":null}],"code":[{"type":"400","description":"invalid/missing parameters","optional":false},{"type":"404","description":"user not found","optional":false},{"type":"403","description":"impossible to set the role of the owner","optional":false}],"response":[{"name":".","type":"array","description":"a array of user containing their email, username and roles","optional":false,"defaultvalue":null}],"name":"setUserRole","longname":"Bucket.setUserRole","scope":"route"},{"name":"retrieveAll","route":{"name":"/api/bucket/","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully fetched bucket","optional":false}],"response":[{"name":".","type":"array","description":"array of buckets","optional":false,"defaultvalue":null}],"longname":"Bucket.retrieveAll","scope":"route"},{"name":"create","route":{"name":"/api/bucket/create_classic","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"body":[{"name":"name","type":"string","description":"the name of the bucket","optional":false,"defaultvalue":null},{"name":"comment","type":"string","description":"any comments that will be written under the bucket name","optional":true,"defaultvalue":null},{"name":"app_url","type":"string","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"400","description":"missing parameters","optional":false},{"type":"403","description":"you cant create any more bucket","optional":false},{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully created a bucket","optional":false}],"response":[{"name":"bucket","type":"object","description":"the created bucket","optional":false,"defaultvalue":null}],"longname":"Bucket.create","scope":"route"},{"deprecated":true,"route":{"name":"/api/bucket/:id/start_trial","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"400","description":"can't claim trial","optional":false},{"type":"200","description":"trial launched","optional":false}],"response":[{"name":"duration","type":"string","description":"the duration of the trial","optional":false,"defaultvalue":null},{"name":"plan","type":"string","description":"the plan of the trial","optional":false,"defaultvalue":null}],"name":"claimTrial","longname":"Bucket.claimTrial","scope":"route"},{"deprecated":true,"name":"upgrade","route":{"name":"/api/bucket/:id/upgrade","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"plan","type":"string","description":"name of the plan to upgrade to","optional":false,"defaultvalue":null},{"name":"stripe_token","type":"string","description":"a card token created by stripe","optional":true,"defaultvalue":null},{"name":"coupon_id","type":"string","description":"the id of the stripe coupon","optional":true,"defaultvalue":null}],"code":[{"type":"400","description":"missing/invalid parameters","optional":false},{"type":"403","description":"need a credit card OR not allowed to subscribe to the plan","optional":false},{"type":"500","description":"stripe/database error","optional":false},{"type":"200","description":"succesfully upgraded","optional":false}],"response":[{"name":"bucket","type":"object","description":"the bucket object","optional":false,"defaultvalue":null},{"name":"subscription","type":"object","description":"the subscription object attached to the subscription","optional":false,"defaultvalue":null}],"longname":"Bucket.upgrade","scope":"route"},{"name":"retrieve","route":{"name":"/api/bucket/:id","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"200","description":"succesfully retrieved the bucket","optional":false}],"response":[{"name":".","type":"object","description":"bucket object","optional":false,"defaultvalue":null}],"longname":"Bucket.retrieve","scope":"route"},{"route":{"name":"/api/bucket/:id","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"name","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"comment","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"app_url","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"configuration","type":"string","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"missing parameters","optional":false}],"response":[{"name":".","type":"object","description":"bucket object","optional":false,"defaultvalue":null}],"name":"update","longname":"Bucket.update","scope":"route","async":true},{"name":"retrieveServers","route":{"name":"/api/bucket/:id/meta_servers","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved the server's metadata","optional":false}],"response":[{"name":".","type":"array","description":"servers metadata","optional":false,"defaultvalue":null}],"longname":"Bucket.retrieveServers","scope":"route"},{"route":{"name":"/api/bucket/:id","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully deleted the bucket","optional":false}],"response":[{"name":".","type":"object","description":"the deleted bucket","optional":false,"defaultvalue":null}],"name":"destroy","longname":"Bucket.destroy","scope":"route"},{"route":{"name":"/api/bucket/:id/transfer_ownership","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"new_owner","type":"string","description":"the wanted owner's email","optional":false,"defaultvalue":null}],"code":[{"type":"400","description":"Missing/invalid parameters","optional":false},{"type":"404","description":"user not found","optional":false},{"type":"403","description":"the new owner need to have a active credit card","optional":false},{"type":"200","description":"succesfully transfered the bucket, old owner is now admin","optional":false}],"response":[{"name":".","type":"object","description":"bucket object","optional":false,"defaultvalue":null}],"name":"transferOwnership","longname":"Bucket.transferOwnership","scope":"route"},{"route":{"name":"/api/bucket/:id/user_options","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"options","type":"object","description":"user options","optional":false,"defaultvalue":null}],"code":[{"type":"200","description":"succesfully update user options","optional":false},{"type":"400","description":"missing parameters","optional":false}],"response":[{"name":"bucket","type":"object","description":"","optional":false,"defaultvalue":null}],"name":"updateUserOptions","longname":"Bucket.updateUserOptions","scope":"route"}]},"dashboard":[{"route":{"name":"/api/bucket/:id/dashboard/","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":".","type":"array","description":"array of servers status","optional":false,"defaultvalue":null}],"name":"retrieveAll","longname":"Dashboard.retrieveAll","scope":"route"},{"route":{"name":"/api/bucket/:id/dashboard/:dashid","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":dashid","type":"string","description":"dashboard id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"404","description":"dashboard not found","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":".","type":"array","description":"array of dashboards","optional":false,"defaultvalue":null}],"name":"retrieve","longname":"Dashboard.retrieve","scope":"route"},{"route":{"name":"/api/bucket/:id/dashboard/:dashid","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":dashid","type":"string","description":"dashboard id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully deleted dashboard","optional":false},{"type":"400","description":"Invalid params","optional":false},{"type":"404","description":"dashboard not found","optional":false}],"response":[{"name":".","type":"array","description":"array of dashboards","optional":false,"defaultvalue":null}],"name":"remove","longname":"Dashboard.remove","scope":"route"},{"route":{"name":"/api/bucket/:id/dashboard/:dashId","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":dashId","type":"string","description":"dashboard id","optional":false}],"body":[{"name":"name","type":"string","description":"the name of the dashboard","optional":false,"defaultvalue":null},{"name":"children","type":"object","description":"the list of component that compose the dashboard","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"404","description":"dashboard not found","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":".","type":"array","description":"array of servers status","optional":false,"defaultvalue":null}],"name":"update","longname":"Dashboard.update","scope":"route"},{"route":{"name":"/api/bucket/:id/dashboard/","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"name","type":"string","description":"the name of the dashboard","optional":false,"defaultvalue":null},{"name":"children","type":"object","description":"the list of component that compose the dashboard","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully created dashboard","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":".","type":"dashboard","description":"complete dashboard object from database","optional":false,"defaultvalue":null}],"name":"create","longname":"Dashboard.create","scope":"route"}],"data":{"dependencies":[{"route":{"name":"/api/bucket/:id/data/dependencies/","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"app_name","type":"string","description":"the application name","optional":false,"defaultvalue":null},{"name":"server_name","type":"string","description":"filter by server name","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"400","description":"missing parameters","optional":false}],"response":[{"name":".","type":"array","description":"recorded dependencies","optional":false,"defaultvalue":null}],"examples":["km.data.dependencies.retrieve(bucket._id, {\n   app_name: 'my_api'\n })"],"name":"retrieve","longname":"Data.dependencies.retrieve","scope":"route"}],"events":[{"route":{"name":"/api/bucket/:id/data/events","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"event_name","type":"string","description":"the event name to retrieve","optional":false,"defaultvalue":null},{"name":"start","type":"date","description":"from which date to retrieve events","optional":true,"defaultvalue":null},{"name":"end","type":"date","description":"to which date to retrieve events","optional":true,"defaultvalue":null},{"name":"app_name","type":"string","description":"filter events by app source","optional":true,"defaultvalue":null},{"name":"server_name","type":"string","description":"filter events by server source","optional":true,"defaultvalue":null},{"name":"limit","type":"number","description":"limit the number of events to retrieve","optional":true,"defaultvalue":100},{"name":"offset","type":"number","description":"offset research by X","optional":true,"defaultvalue":0}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"invalid parameters","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of events","optional":false,"defaultvalue":null}],"name":"retrieve","longname":"Data.events.retrieve","scope":"route"},{"route":{"name":"/api/bucket/:id/data/eventsKeysByApp","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"invalid parameters","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of object representing events emitted for each application name","optional":false,"defaultvalue":null}],"name":"retrieveMetadatas","longname":"Data.events.retrieveMetadatas","scope":"route"},{"route":{"name":"/api/bucket/:id/data/events/stats","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"event_name","type":"string","description":"the event name to retrieve","optional":false,"defaultvalue":null},{"name":"app_name","type":"string","description":"filter events by app source","optional":true,"defaultvalue":null},{"name":"server_name","type":"string","description":"filter events by server source","optional":true,"defaultvalue":null},{"name":"days","type":"number","description":"limit the number of days of data","optional":true,"defaultvalue":2},{"name":"interval","type":"string","description":"interval of time between two point","optional":true,"defaultvalue":"minute"}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"invalid parameters","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of point (each point is one dimensional array, X are at 0 and Y at 1)","optional":false,"defaultvalue":null}],"name":"retrieveHistogram","longname":"Data.events.retrieveHistogram","scope":"route"},{"route":{"name":"/api/bucket/:id/data/events/delete_all","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully deleted data","optional":false}],"response":[{"name":".","type":"array","description":"array of object representing events emitted for each application name","optional":false,"defaultvalue":null}],"name":"deleteAll","longname":"Data.events.deleteAll","scope":"route"}],"exceptions":[{"route":{"name":"/api/bucket/:id/data/exceptions","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"server_name","type":"string","description":"filter exceptions by server source","optional":true,"defaultvalue":null},{"name":"app_name","type":"string","description":"filter exceptions by app source","optional":true,"defaultvalue":null},{"name":"before","type":"string","description":"filter out exceptions older than X (in minutes)","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of exceptions","optional":false,"defaultvalue":null}],"name":"retrieve","longname":"Data.exceptions.retrieve","scope":"route"},{"route":{"name":"/api/bucket/:id/data/exceptions/summary","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of object containing exceptions for each application for each server","optional":false,"defaultvalue":null}],"name":"retrieveSummary","longname":"Data.exceptions.retrieveSummary","scope":"route"},{"route":{"name":"/api/bucket/:id/data/exceptions/delete_all","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"name":"deleteAll","longname":"Data.exceptions.deleteAll","scope":"route"},{"route":{"name":"/api/bucket/:id/data/exceptions/delete","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"identifier","type":"string","description":"exception identifier","optional":true,"defaultvalue":null},{"name":"app_name","type":"string","description":"the application on which exception happened","optional":true,"defaultvalue":null},{"name":"server_name","type":"string","description":"the server on which exception happened","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"400","description":"missing/invalid parameters","optional":false}],"response":[{"name":".","type":"array","description":"array of deleted exceptions","optional":false,"defaultvalue":null}],"name":"delete","longname":"Data.exceptions.delete","scope":"route"}],"issues":[{"route":{"name":"/api/bucket/:id/data/issues/list","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"server_name","type":"string","description":"filter exceptions by server source","optional":true,"defaultvalue":null},{"name":"app_name","type":"string","description":"filter exceptions by app source needed if initiator+source not provided","optional":true,"defaultvalue":null},{"name":"before","type":"string","description":"exclude exceptions older than 'before' minutes","optional":true,"defaultvalue":null},{"name":"initiator","type":"string","description":"filter exceptions by initiator (node/golang/browser/webcheck...) needed with source","optional":true,"defaultvalue":null},{"name":"source","type":"string","description":"filter exceptions by source (browser app id, webcheck id...)","optional":true,"defaultvalue":null},{"name":"tags","type":"array","description":"array of string to filter tags","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of exceptions","optional":false,"defaultvalue":null}],"name":"list","longname":"Data.issues.list","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/issues/occurrences/:identifier","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":identifier","type":"string","description":"issue identifier","optional":false}],"query":[{"name":"from","type":"number","description":"","optional":true,"defaultvalue":null},{"name":"search_after","type":"number","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of occurrences id","optional":false,"defaultvalue":null}],"name":"listOccurencesForIdentifier","longname":"Data.issues.listOccurencesForIdentifier","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/issues/replay/:uuid","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":uuid","type":"string","description":"replay id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":"replay","type":"string","description":"","optional":false,"defaultvalue":null}],"name":"getReplay","longname":"Data.issues.getReplay","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/issues/histogram","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"app_name","type":"string","description":"a specific app name","optional":true,"defaultvalue":null},{"name":"start","type":"string","description":"ignore issue before this date","optional":true,"defaultvalue":null},{"name":"identifier","type":"string","description":"a specific issue identifier","optional":true,"defaultvalue":null},{"name":"interval","type":"string","description":"ignore issue before this date","optional":true,"defaultvalue":null},{"name":"end","type":"string","description":"ignore issue after this date","optional":true,"defaultvalue":null},{"name":"includeFixed","type":"boolean","description":"choose to ignore or not the fixed occurences","optional":true,"defaultvalue":false},{"name":"initiator","type":"string","description":"filter exceptions by initiator (node/golang/browser/webcheck...) needed with source","optional":true,"defaultvalue":null},{"name":"source","type":"string","description":"filter exceptions by source (browser app id, webcheck id...)","optional":true,"defaultvalue":null},{"name":"tags","type":"array","description":"array of string to filter tags","optional":true,"defaultvalue":null},{"name":"includeEmptyDocs","type":"boolean","description":"add empty docs","optional":true,"defaultvalue":false},{"name":"invertedTags","type":"boolean","description":"filter issue without tags","optional":true,"defaultvalue":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of object containing exceptions for each application for each server","optional":false,"defaultvalue":null}],"name":"retrieveHistogram","longname":"Data.issues.retrieveHistogram","scope":"route"},{"route":{"name":"/api/bucket/:id/data/issues/ocurrences","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"identifier","type":"object","description":"find occurence by using an issue identifier","optional":true,"defaultvalue":null},{"name":"occurrence_id","type":"object","description":"find ocurrence by his id","optional":true,"defaultvalue":null},{"name":"includeFixed","type":"boolean","description":"choose to ignore or not the fixed occurences","optional":true,"defaultvalue":false},{"name":"limit","type":"number","description":"limit","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of object containing ocurrences","optional":false,"defaultvalue":null}],"name":"findOccurences","longname":"Data.issues.findOccurences","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/issues/search","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"message","type":"string","description":"find occurence that match this message","optional":false,"defaultvalue":null},{"name":"includeFixed","type":"boolean","description":"choose to ignore or not the fixed occurences","optional":true,"defaultvalue":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of object containing exceptions for each application for each server","optional":false,"defaultvalue":null}],"name":"search","longname":"Data.issues.search","scope":"route"},{"route":{"name":"/api/bucket/:id/data/issues/summary/:aggregateBy","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":aggregateBy","type":"string","description":"servers, apps, initiators or sources","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"issues count aggregated","optional":false,"defaultvalue":null}],"name":"summary","longname":"Data.issues.summary","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/issues","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"query":[{"name":"app_name","type":"string","description":"an specific application to delete application","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"name":"deleteAll","longname":"Data.issues.deleteAll","scope":"route"},{"route":{"name":"/api/bucket/:id/data/issues/:identifier","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":identifier","type":"string","description":"the identifier of issue that you want to delete","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"400","description":"missing/invalid parameters","optional":false}],"response":[{"name":".","type":"array","description":"array of deleted exceptions","optional":false,"defaultvalue":null}],"name":"delete","longname":"Data.issues.delete","scope":"route"}],"logs":[{"route":{"name":"/api/bucket/:id/data/logs","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"app_name","type":"string","description":"the application name","optional":true,"defaultvalue":null},{"name":"server_name","type":"string","description":"filter by server name","optional":true,"defaultvalue":null},{"name":"before","type":"string","description":"only search log oldest than <before>","optional":true,"defaultvalue":null},{"name":"after","type":"string","description":"only search log newer than <after>","optional":true,"defaultvalue":null},{"name":"size","type":"integer","description":"line limit, default to 100","optional":true,"defaultvalue":null},{"name":"from","type":"integer","description":"offset limit","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"400","description":"missing parameters","optional":false}],"response":[{"name":".","type":"array","description":"recorded dependencies","optional":false,"defaultvalue":null}],"examples":["km.data.logs.retrieve(bucket._id, {\n   app_name: 'my_api'\n })"],"name":"retrieve","longname":"Data.logs.retrieve","scope":"route"},{"route":{"name":"/api/bucket/:id/data/logs/histogram","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"app_name","type":"object","description":"a specific app name","optional":true,"defaultvalue":null},{"name":"start","type":"object","description":"ignore log before this date","optional":true,"defaultvalue":null},{"name":"interval","type":"object","description":"ignore log before this date","optional":true,"defaultvalue":null},{"name":"end","type":"object","description":"ignore log after this date","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of object containing exceptions for each application for each server","optional":false,"defaultvalue":null}],"name":"retrieveHistogram","longname":"Data.logs.retrieveHistogram","scope":"route"}],"metrics":[{"route":{"name":"/api/bucket/:id/data/metrics/aggregations","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"aggregations","type":"object","description":"array of aggregations to compute","optional":false,"defaultvalue":null},{"name":"aggregations[].name","type":"string","description":"the name of metric to compute the graph","optional":false,"defaultvalue":null},{"name":"aggregations[].types","type":"array","description":"type of aggregation (e.g. ['histogram', 'servers'])","optional":false,"defaultvalue":null},{"name":"aggregations[].start","type":"date","description":"oldest documents to aggregate on","optional":false,"defaultvalue":null},{"name":"aggregations[].end","type":"date","description":"newest documents to aggregate on","optional":true,"defaultvalue":null},{"name":"aggregations[].apps","type":"array","description":"filter source applications to aggregate on","optional":true,"defaultvalue":null},{"name":"aggregations[].interval","type":"number","description":"interval between two points","optional":true,"defaultvalue":null},{"name":"aggregations[].servers","type":"array","description":"filter source server to aggregate on","optional":true,"defaultvalue":null},{"name":"aggregations[].initiator","type":"string","description":"filter source initiator to aggregate on","optional":true,"defaultvalue":null},{"name":"aggregations[].webcheck","type":"string","description":"filter source webcheck to aggregate on","optional":true,"defaultvalue":null},{"name":"aggregations[].collector","type":"string","description":"filter source collector to aggregate on","optional":true,"defaultvalue":null},{"name":"aggregations[].tags","type":"array","description":"filter tags to aggregate on","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"aggregations","optional":false,"defaultvalue":null}],"examples":["// Example #1: Retrieve HTTP metrics of app INTERACTION, WEB-API, WORKER from all servers\n km.data.metrics.retrieveAggregations(bucket._id, {\n  aggregations: [\n    {\n     'start': 'now-5m',\n     'apps': ['INTERACTION', 'WEB-API', 'WORKER'],\n     'types': ['histogram', 'apps', 'servers'],\n     'name': 'HTTP'\n    }\n  ]\n})\n\n // Example #2: Retrieve HTTP metrics of ALL apps from all servers\n km.data.metrics.retrieveAggregations(bucket._id, {\n  aggregations: [\n    {\n     'start': 'now-1d',\n     'types': ['histogram', 'apps', 'servers'],\n     'name': 'HTTP'\n    }\n  ]\n})"],"name":"retrieveAggregations","longname":"Data.metrics.retrieveAggregations","scope":"route"},{"route":{"name":"/api/bucket/:id/data/metrics/histogram","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"app_name","type":"string","description":"filter probes by app source","optional":true,"defaultvalue":null},{"name":"server_name","type":"string","description":"filter probes by server source","optional":true,"defaultvalue":null},{"name":"interval","type":"string","description":"interval of time between two point","optional":true,"defaultvalue":"minute"},{"name":"before","type":"string","description":"filter out probes that are after X minute","optional":true,"defaultvalue":60}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":"server_name","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"server_name.app_name","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"server_name.app_name.metrics","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"server_name.app_name.metrics.agg_type","type":"string","description":"the type of aggregation for this probe","optional":false,"defaultvalue":null},{"name":"server_name.app_name.metrics_name.timestamps_and_stats","type":"array","description":"array of point","optional":false,"defaultvalue":null}],"name":"retrieveHistogram","longname":"Data.metrics.retrieveHistogram","scope":"route"},{"route":{"name":"/api/bucket/:id/data/metrics/histogramPrecise","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"probe","type":"string","description":"probe name","optional":false,"defaultvalue":null},{"name":"app","type":"string","description":"filter probes by app source","optional":false,"defaultvalue":null},{"name":"server","type":"string","description":"filter probes by server source","optional":false,"defaultvalue":null},{"name":"after","type":"string","description":"interval of time between two point (now-5d, now-5m...)","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":"Array","type":"array","description":"of points","optional":false,"defaultvalue":null}],"name":"retrieveHistogramPrecise","longname":"Data.metrics.retrieveHistogramPrecise","scope":"route"},{"route":{"name":"/api/bucket/:id/data/metrics/list","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"servers","type":"object","description":"filter metrics by app name","optional":true,"defaultvalue":null},{"name":"apps","type":"object","description":"filter metrics by server name","optional":true,"defaultvalue":null},{"name":"initiator","type":"string","description":"filter metrics by a specific initiator","optional":true,"defaultvalue":null},{"name":"source","type":"string","description":"filter metrics by a specific source","optional":true,"defaultvalue":null},{"name":"collector","type":"string","description":"filter metrics by a specific collector","optional":true,"defaultvalue":null},{"name":"webcheck","type":"string","description":"filter metrics by a specific webcheck","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"name":"retrieveList","longname":"Data.metrics.retrieveList","scope":"route"},{"route":{"name":"/api/bucket/:id/data/metrics","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"app_name","type":"string","description":"filter metrics by app source","optional":false,"defaultvalue":null},{"name":"server_name","type":"string","description":"filter metrics by server source","optional":true,"defaultvalue":null},{"name":"before","type":"string","description":"filter out metrics that are after X minute","optional":true,"defaultvalue":720}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"name":"retrieveMetadatas","longname":"Data.metrics.retrieveMetadatas","scope":"route"}],"notifications":[{"route":{"name":"/api/bucket/:id/data/notifications","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"type","type":"string","description":"Type of notification","optional":true,"defaultvalue":null},{"name":"before","type":"string","description":"we search logs before this date (lower than)","optional":true,"defaultvalue":null},{"name":"after","type":"string","description":"we search logs after this date (greater than)","optional":true,"defaultvalue":null},{"name":"size","type":"number","description":"","optional":true,"defaultvalue":null},{"name":"from","type":"number","description":"","optional":true,"defaultvalue":null},{"name":"type","type":"string","description":"type of notification","optional":true,"defaultvalue":null},{"name":"providers","type":"array","description":"find notifications with this providers","optional":true,"defaultvalue":null},{"name":"contacts","type":"array","description":"find notifications with this contact","optional":true,"defaultvalue":null},{"name":"size","type":"integer","description":"line limit, default to 20","optional":true,"defaultvalue":null},{"name":"from","type":"integer","description":"offset limit","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"tags":[{"originalTitle":"reponse","title":"reponse","text":"{Array} . array of traces","value":"{Array} . array of traces","optional":false,"type":null}],"name":"list","longname":"Data.notifications.list","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/notifications/:notification","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":notification","type":"string","description":"notification id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"tags":[{"originalTitle":"reponse","title":"reponse","text":"{Object} . notification","value":"{Object} . notification","optional":false,"type":null}],"name":"retrieve","longname":"Data.notifications.retrieve","scope":"route","async":true}],"outliers":[{"route":{"name":"/api/bucket/:id/data/outliers/","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"app_name","type":"string","description":"the application name","optional":true,"defaultvalue":null},{"name":"server_name","type":"string","description":"filter by server name","optional":true,"defaultvalue":null},{"name":"start","type":"string","description":"only search outlier newer than <start>","optional":true,"defaultvalue":null},{"name":"end","type":"string","description":"only search outlier older than <end>","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"400","description":"missing parameters","optional":false}],"response":[{"name":".","type":"array","description":"recorded dependencies","optional":false,"defaultvalue":null}],"examples":["km.data.outliers.retrieve(bucket._id, {\n   app_name: 'my_api'\n })"],"name":"retrieve","longname":"Data.outliers.retrieve","scope":"route"}],"processes":[{"route":{"name":"/api/bucket/:id/data/processEvents","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"app_name","type":"string","description":"filter events by app source","optional":true,"defaultvalue":null},{"name":"server_name","type":"string","description":"filter events by server source","optional":true,"defaultvalue":null},{"name":"before","type":"string","description":"filter out events that are after X minute","optional":true,"defaultvalue":60}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of process events","optional":false,"defaultvalue":null}],"name":"retrieveEvents","longname":"Data.processes.retrieveEvents","scope":"route"},{"route":{"name":"/api/bucket/:id/data/processEvents/deployments","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"app_name","type":"string","description":"filter events by app source","optional":true,"defaultvalue":null},{"name":"server_name","type":"string","description":"filter events by server source","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of deployments","optional":false,"defaultvalue":null}],"name":"retrieveDeployments","longname":"Data.processes.retrieveDeployments","scope":"route"}],"profiling":[{"route":{"name":"/api/bucket/:id/data/profilings/:filename","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":filename","type":"string","description":"filename","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"invalid parameters","optional":false}],"response":[{"name":".","type":"object","description":"return profile data","optional":false,"defaultvalue":null}],"name":"retrieve","longname":"Data.profiling.retrieve","scope":"route"},{"route":{"name":"/api/bucket/:id/data/profilings/:filename/download","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":filename","type":"string","description":"filename","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"invalid parameters","optional":false}],"response":[{"name":".","type":"file","description":"return a file","optional":false,"defaultvalue":null}],"name":"download","longname":"Data.profiling.download","scope":"route"},{"route":{"name":"/api/bucket/:id/data/profilings","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"apps","type":"object","description":"","optional":true,"defaultvalue":null},{"name":"servers","type":"object","description":"","optional":true,"defaultvalue":null},{"name":"from","type":"object","description":"","optional":true,"defaultvalue":null},{"name":"size","type":"object","description":"","optional":true,"defaultvalue":null},{"name":"type","type":"object","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of object containing profilings","optional":false,"defaultvalue":null}],"name":"list","longname":"Data.profiling.list","scope":"route"},{"route":{"name":"/api/bucket/:id/data/profilings/:filename","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":filename","type":"string","description":"filename","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"invalid parameters","optional":false}],"response":[{"name":".","type":"file","description":"return a file","optional":false,"defaultvalue":null}],"name":"delete","longname":"Data.profiling.delete","scope":"route"}],"status":[{"route":{"name":"/api/bucket/:id/data/status","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"tags":[{"originalTitle":"reponse","title":"reponse","text":"{Array} . array of servers status","value":"{Array} . array of servers status","optional":false,"type":null}],"name":"retrieve","longname":"Data.status.retrieve","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/status/blacklisted","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"tags":[{"originalTitle":"reponse","title":"reponse","text":"{Array} . array of servers status","value":"{Array} . array of servers status","optional":false,"type":null}],"name":"retrieveBlacklisted","longname":"Data.status.retrieveBlacklisted","scope":"route","async":true}],"traces":[{"route":{"name":"/api/bucket/:id/data/traces","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"includeSpans","type":"boolean","description":"","optional":true,"defaultvalue":true},{"name":"serviceName","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"limit","type":"string","description":"default: 10, max: 100","optional":true,"defaultvalue":null},{"name":"kind","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"minDuration","type":"number","description":"","optional":true,"defaultvalue":null},{"name":"start","type":"string","description":"date","optional":true,"defaultvalue":null},{"name":"end","type":"string","description":"date","optional":true,"defaultvalue":null},{"name":"tags","type":"array","description":"Query string array like [error=500, error, ...]","optional":true,"defaultvalue":null},{"name":"orderBy","type":"string","description":"Default: newest, enum: oldest, newest, shortest, longest","optional":true,"defaultvalue":null},{"name":"spanName","type":"string","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"tags":[{"originalTitle":"reponse","title":"reponse","text":"{Array} . array of traces","value":"{Array} . array of traces","optional":false,"type":null}],"name":"list","longname":"Data.traces.list","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/traces/:trace","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false},{"name":":trace","type":"string","description":"trace id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"tags":[{"originalTitle":"reponse","title":"reponse","text":"{Object} . trace","value":"{Object} . trace","optional":false,"type":null}],"name":"retrieve","longname":"Data.traces.retrieve","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/traces/services","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":"services,","type":"object","description":"spans names","optional":false,"defaultvalue":null}],"name":"getServices","longname":"Data.traces.getServices","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/traces/tags","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":"tags","type":"array","description":"","optional":false,"defaultvalue":null}],"name":"getTags","longname":"Data.traces.getTags","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/traces/histogram/tag","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"tag","type":"string","description":"","optional":false,"defaultvalue":null},{"name":"start","type":"string","description":"date","optional":true,"defaultvalue":null},{"name":"end","type":"string","description":"date","optional":true,"defaultvalue":null},{"name":"serviceName","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"spanName","type":"string","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":"aggregation","type":"array","description":"","optional":false,"defaultvalue":null}],"name":"getHistogramByTag","longname":"Data.traces.getHistogramByTag","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/traces/aggregation/tag","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"tag","type":"string","description":"","optional":false,"defaultvalue":null},{"name":"start","type":"string","description":"date","optional":true,"defaultvalue":null},{"name":"end","type":"string","description":"date","optional":true,"defaultvalue":null},{"name":"serviceName","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"spanName","type":"string","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":"aggregation","type":"array","description":"","optional":false,"defaultvalue":null}],"name":"getTagsValue","longname":"Data.traces.getTagsValue","scope":"route","async":true},{"route":{"name":"/api/bucket/:id/data/traces/aggregation/duration","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"start","type":"string","description":"date","optional":true,"defaultvalue":null},{"name":"end","type":"string","description":"date","optional":true,"defaultvalue":null},{"name":"serviceName","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"spanName","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"tags","type":"array","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":"aggregation","type":"array","description":"","optional":false,"defaultvalue":null}],"name":"getDurationAvg","longname":"Data.traces.getDurationAvg","scope":"route","async":true}],"transactions":[{"route":{"name":"/api/bucket/:id/data/transactions/v2/histogram","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"app_name","type":"string","description":"filter transactions by app source","optional":true,"defaultvalue":null},{"name":"server_name","type":"string","description":"filter transactions by server source","optional":true,"defaultvalue":null},{"name":"interval","type":"string","description":"interval of time between two point","optional":true,"defaultvalue":"minute"},{"name":"before","type":"string","description":"filter out transactions that are after X minute","optional":true,"defaultvalue":60}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":".","type":"array","description":"array of times series containing points","optional":false,"defaultvalue":null}],"name":"retrieveHistogram","longname":"Data.transactions.retrieveHistogram","scope":"route"},{"route":{"name":"/api/bucket/:id/data/transactions/v2/summary","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"body":[{"name":"app_name","type":"string","description":"filter transactions by app source","optional":true,"defaultvalue":null},{"name":"server_name","type":"string","description":"filter transactions by server source","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":"server_name","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"server_name.app_name","type":"object","description":"transaction object","optional":false,"defaultvalue":null}],"name":"retrieveSummary","longname":"Data.transactions.retrieveSummary","scope":"route"},{"route":{"name":"/api/bucket/:id/data/transactions/v2/delete","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"bucket id","optional":false}],"query":[{"name":"app_name","type":"string","description":"filter transactions by app source","optional":true,"defaultvalue":null},{"name":"server_name","type":"string","description":"filter transactions by server source","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false}],"response":[{"name":"server_name","type":"object","description":"","optional":false,"defaultvalue":null},{"name":"server_name.app_name","type":"object","description":"transaction object","optional":false,"defaultvalue":null}],"name":"delete","longname":"Data.transactions.delete","scope":"route"}]},"misc":[{"route":{"name":"/api/misc/changelog","type":"GET"},"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":"changelog","type":"array","description":"articles","optional":false,"defaultvalue":null}],"name":"listChangelogArticles","longname":"Misc.listChangelogArticles","scope":"route","params":[],"authentication":false},{"route":{"name":"/api/misc/release/pm2","type":"GET"},"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":"pm2_version","type":"string","description":"latest version","optional":false,"defaultvalue":null}],"name":"retrievePM2Version","longname":"Misc.retrievePM2Version","scope":"route","params":[],"authentication":false},{"route":{"name":"/api/misc/release/nodejs/:version","type":"GET"},"params":[{"name":":version","type":"string","description":"semver version range","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":".","type":"array","description":"array of releases matching the range requested","optional":false,"defaultvalue":null}],"name":"retrieveNodeRelease","longname":"Misc.retrieveNodeRelease","scope":"route","authentication":false},{"route":{"name":"/api/misc/plans","type":"GET"},"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"succesfully retrieved data","optional":false},{"type":"400","description":"Invalid params","optional":false}],"response":[{"name":".","type":"object","description":"list of plans keyed by plan name","optional":false,"defaultvalue":null}],"name":"retrievePlans","longname":"Misc.retrievePlans","scope":"route","params":[],"authentication":false},{"route":{"name":"/api/misc/stripe/retrieveCoupon","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"body":[{"name":"coupon","type":"string","description":"the coupon name","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"200","description":"succesfully retrieved the metadata","optional":false}],"response":[{"name":"coupon","type":"object","description":"the coupon object","optional":false,"defaultvalue":null}],"name":"retrieveCoupon","longname":"Misc.retrieveCoupon","scope":"route","params":[]},{"route":{"name":"/api/misc/stripe/retrieveCompany","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"body":[{"name":"vat_id","type":"string","description":"the vat id of the company","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"200","description":"succesfully retrieved the metadata","optional":false}],"response":[{"name":".","type":"object","description":"metadata about company","optional":false,"defaultvalue":null}],"name":"retrieveCompany","longname":"Misc.retrieveCompany","scope":"route","params":[]},{"route":{"name":"/api/misc/stripe/retrieveVat","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"body":[{"name":"country","type":"string","description":"country code of the user","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"stripe error","optional":false},{"type":"200","description":"succesfully retrieved the metadata","optional":false}],"response":[{"name":"coupon","type":"object","description":"the coupon object","optional":false,"defaultvalue":null}],"name":"retrieveVAT","longname":"Misc.retrieveVAT","scope":"route","params":[]}],"node":[{"route":{"name":"/api/node/default","type":"GET"},"response":[{"name":"node","type":"object","description":"Return node object","optional":false,"defaultvalue":null}],"name":"getDefaultNode","longname":"Node.getDefaultNode","scope":"route","params":[],"authentication":false}],"orchestration":[{"route":{"name":"/api/bucket/:id/balance","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"balancing error","optional":false},{"type":"403","description":"already on new node or not premium","optional":false},{"type":"200","description":"succesfully balanced the bucket","optional":false}],"response":[{"name":"migration","type":"object","description":"is equal true if succesfull","optional":false,"defaultvalue":null}],"name":"selfSend","longname":"Orchestration.selfSend","scope":"route","params":[]}],"tokens":[{"route":{"name":"/api/users/token/","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"200","description":"successfully retrieved","optional":false}],"response":[{"name":".","type":"object","description":"array of tokens","optional":false,"defaultvalue":null}],"name":"retrieve","longname":"Tokens.retrieve","scope":"route","params":[]},{"route":{"name":"/api/users/token/:id","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"params":[{"name":":id","type":"string","description":"token id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"404","description":"token not found","optional":false},{"type":"200","description":"refresh token has been deleted and all access token that have been created with it","optional":false}],"response":[{"name":".","type":"object","description":"array of tokens","optional":false,"defaultvalue":null}],"name":"remove","longname":"Tokens.remove","scope":"route"},{"route":{"name":"/api/users/token/","type":"PUT"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"body":[{"name":"scope","type":"object","description":"a valid oauth scope","optional":false,"defaultvalue":null}],"code":[{"type":"409","description":"the otp is already enabled for the user, you can only delete it","optional":false},{"type":"200","description":"the otp can be registered for the account, return the full response","optional":false}],"response":[{"name":".","type":"object","description":"generated token","optional":false,"defaultvalue":null}],"name":"create","longname":"Tokens.create","scope":"route","params":[]}],"user":{"otp":[{"route":{"name":"/api/users/otp","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"code":[{"type":"409","description":"the otp is already enabled for the user, you can only delete it","optional":false},{"type":"200","description":"the otp can be registered for the account, return the full response","optional":false}],"response":[{"name":"user","type":"object","description":"user model","optional":false,"defaultvalue":null},{"name":"key","type":"string","description":"otp secret key","optional":false,"defaultvalue":null},{"name":"qrImage","type":"string","description":"url to the QrCode","optional":false,"defaultvalue":null}],"name":"retrieve","longname":"User.otp.retrieve","scope":"route","params":[]},{"route":{"name":"/api/users/otp","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"body":[{"name":"otpKey","type":"string","description":"secret key used to generate OTP code","optional":false,"defaultvalue":null},{"name":"otpToken","type":"string","description":"a currently valid OTP code generated with the otpKey","optional":false,"defaultvalue":null}],"code":[{"type":"400","description":"missing parameters","optional":false},{"type":"403","description":"the code asked to add the OTP from user account is invalid","optional":false},{"type":"500","description":"error from database","optional":false},{"type":"200","description":"the otp has been registered for the user","optional":false}],"name":"enable","longname":"User.otp.enable","scope":"route","params":[]},{"route":{"name":"/api/users/otp","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"query":[{"name":"otpToken","type":"string","description":"a currently valid OTP code","optional":false,"defaultvalue":null}],"code":[{"type":"400","description":"missing parameters","optional":false},{"type":"403","description":"the code asked to remove the OTP from user account is invalid","optional":false},{"type":"500","description":"error from database","optional":false},{"type":"200","description":"the otp has been deleted for the user","optional":false}],"name":"disable","longname":"User.otp.disable","scope":"route","params":[]}],"providers":[{"route":{"name":"/api/users/integrations","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"code":[{"type":"200","description":"succesfully retrieved providers","optional":false}],"response":[{"name":".","type":"array","description":"array of providers for user account","optional":false,"defaultvalue":null}],"name":"retrieve","longname":"User.providers.retrieve","scope":"route","params":[]},{"route":{"name":"/api/users/integrations","type":"POST"},"authentication":true,"body":[{"name":"name","type":"string","description":"the provider name","optional":false,"defaultvalue":null}],"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"code":[{"type":"400","description":"invalid parameters","optional":false},{"type":"403","description":"the user already have this provider","optional":false},{"type":"200","description":"succesfully added the provider","optional":false}],"name":"add","longname":"User.providers.add","scope":"route","params":[]},{"route":{"name":"/api/users/integrations/:name","type":"DELETE"},"authentication":true,"params":[{"name":":name","type":"string","description":"the provider name","optional":false}],"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"code":[{"type":"400","description":"invalid parameters or provider isn't implemented","optional":false},{"type":"403","description":"the provider isn't enabled","optional":false},{"type":"200","description":"succesfully removed the provider","optional":false}],"name":"remove","longname":"User.providers.remove","scope":"route"}],"default":[{"name":"retrieve","route":{"name":"/api/users/isLogged","type":"GET"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"code":[{"type":"200","description":"the user has been retrieved","optional":false}],"response":[{"name":"user","type":"object","description":"user model","optional":false,"defaultvalue":null}],"longname":"User.retrieve","scope":"route"},{"route":{"name":"/api/users/show/:id","type":"GET"},"params":[{"name":":id","type":"string","description":"user id","optional":false}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"invalid parameters (no id provided)","optional":false},{"type":"404","description":"no user account where found","optional":false},{"type":"200","description":"the mail has been sent to the provided email","optional":false}],"response":[{"name":"String","type":"","description":"email user email","optional":false,"defaultvalue":null},{"name":"String","type":"","description":"username user pseudo","optional":false,"defaultvalue":null}],"name":"show","longname":"User.show","scope":"route","authentication":false},{"route":{"name":"/api/users/update","type":"POST"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"body":[{"name":"username","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"email","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"old_password","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"new_password","type":"string","description":"","optional":true,"defaultvalue":null},{"name":"info","type":"object","description":"","optional":true,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"400","description":"missing parameters, no data to update","optional":false},{"type":"403","description":"when updating the password, it need a new one","optional":false},{"type":"406","description":"when updating the password, the old one is false","optional":false},{"type":"409","description":"when updating email or username\n another user already have one of those two","optional":false},{"type":"200","description":"succesfully updated the card","optional":false}],"response":[{"name":".","type":"object","description":"user object","optional":false,"defaultvalue":null}],"name":"update","longname":"User.update","scope":"route","params":[]},{"route":{"name":"/api/users/delete","type":"DELETE"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"database error","optional":false},{"type":"403","description":"permission denied (hold buckets)","optional":false},{"type":"200","description":"succesfully deleted the user","optional":false}],"response":[{"name":".","type":"object","description":"user object","optional":false,"defaultvalue":null}],"name":"delete","longname":"User.delete","scope":"route","params":[]}]},"auth":[{"name":"retrieveToken","route":{"name":"/api/oauth/token","type":"POST"},"service":{"name":"OAUTH"},"body":[{"name":"client_id","type":"string","description":"the public id of your oauth application","optional":false,"defaultvalue":null},{"name":"refresh_token","type":"string","description":"refresh token you retrieved via authorize endpoint","optional":false,"defaultvalue":null},{"name":"grant_type","type":"string","description":"","optional":false,"defaultvalue":"refresh_token"}],"code":[{"type":"400","description":"invalid parameters (missing or not correct)","optional":false}],"response":[{"name":"access_token","type":"string","description":"a fresh access_token","optional":false,"defaultvalue":null},{"name":"refresh_token","type":"string","description":"the refresh token you used","optional":false,"defaultvalue":null},{"name":"expire_at","type":"string","description":"UTC date at which the token will be considered\n as invalid","optional":false,"defaultvalue":null},{"name":"token_type","type":"string","description":"the type of token to use, for now its always Bearer","optional":false,"defaultvalue":null}],"longname":"Auth.retrieveToken","scope":"route","authentication":false},{"name":"requestNewPassword","route":{"name":"/api/oauth/reset_password","type":"POST"},"service":{"name":"OAUTH"},"body":[{"name":"email","type":"string","description":"email of the account that want a password reset","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"the database failed to register the token to reset the mail","optional":false},{"type":"400","description":"missing parameters","optional":false},{"type":"404","description":"no user account where found with the provided email","optional":false},{"type":"200","description":"the mail has been sent to the provided email","optional":false}],"longname":"Auth.requestNewPassword","scope":"route","authentication":false},{"name":"sendEmailLink","route":{"name":"/api/oauth/send_email_link","type":"POST"},"service":{"name":"OAUTH"},"code":[{"type":"500","description":"the database failed to register the token to reset the mail","optional":false},{"type":"401","description":"need to authenticated","optional":false},{"type":"200","description":"the mail has been sent to the provided email","optional":false}],"longname":"Auth.sendEmailLink","scope":"route","authentication":false},{"name":"validEmail","route":{"name":"/api/oauth/valid_email/:token","type":"GET"},"params":[{"description":"the token to validate the account","name":":token","optional":false,"type":null}],"service":{"name":"OAUTH"},"code":[{"type":"500","description":"the database failed to valid email","optional":false},{"type":"404","description":"need to authenticated","optional":false},{"type":"301","description":"the email has been valided","optional":false}],"longname":"Auth.validEmail","scope":"route","authentication":false},{"route":{"name":"/api/oauth/register","type":"GET"},"service":{"name":"OAUTH"},"body":[{"name":"username","type":"string","description":"","optional":false,"defaultvalue":null},{"name":"email","type":"string","description":"","optional":false,"defaultvalue":null},{"name":"password","type":"string","description":"","optional":false,"defaultvalue":null},{"name":"role","type":"string","description":"job title in user company","optional":true,"defaultvalue":null},{"name":"company","type":"string","description":"company name","optional":true,"defaultvalue":null},{"name":"accept_terms","type":"integer","description":"","optional":false,"defaultvalue":null}],"code":[{"type":"500","description":"either the registeration of new user is disabled or\nthe database failed to register the user","optional":false},{"type":"409","description":"the user field are already used by another user","optional":false},{"type":"200","description":"the user has been created","optional":false}],"response":[{"name":"user","type":"object","description":"user model","optional":false,"defaultvalue":null},{"name":"access_token","type":"object","description":"access token issued for the user","optional":false,"defaultvalue":null},{"name":"refreshToken","type":"object","description":"refresh token issued for the user","optional":false,"defaultvalue":null}],"name":"register","longname":"Auth.register","scope":"route","authentication":false},{"route":{"name":"/api/oauth/revoke","type":"POST"},"service":{"name":"OAUTH"},"authentication":true,"header":[{"name":"Authorization","type":"string","description":"bearer access token issued for the user","optional":false,"defaultvalue":null}],"code":[{"type":"404","description":"token not found","optional":false},{"type":"500","description":"database error","optional":false},{"type":"200","description":"the token has been succesfully deleted,\n if there was access token generated with this token, they\n have been deleted too","optional":false}],"name":"revoke","longname":"Auth.revoke","scope":"route"}]}
},{}],41:[function(require,module,exports){
/* global URLSearchParams, URL, localStorage */
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var AuthStrategy = require('./strategy');
module.exports = /*#__PURE__*/function (_AuthStrategy) {
  _inherits(BrowserFlow, _AuthStrategy);
  function BrowserFlow() {
    _classCallCheck(this, BrowserFlow);
    return _callSuper(this, BrowserFlow, arguments);
  }
  _createClass(BrowserFlow, [{
    key: "removeUrlToken",
    value: function removeUrlToken(refreshToken) {
      var url = window.location.href;
      var params = "?access_token=".concat(refreshToken, "&token_type=refresh_token");
      var newUrl = url.replace(params, '');
      window.history.pushState('', '', newUrl);
    }
  }, {
    key: "retrieveTokens",
    value: function retrieveTokens(km, cb) {
      var _this = this;
      var verifyToken = function verifyToken(refresh) {
        return km.auth.retrieveToken({
          client_id: _this.client_id,
          refresh_token: refresh
        });
      };

      // parse the url since it can contain tokens
      var url = new URL(window.location);
      this.response_mode = this.response_mode === 'query' ? 'search' : this.response_mode;
      var params = new URLSearchParams(url[this.response_mode]);
      if (params.get('access_token') !== null) {
        // verify that the access_token in parameters is valid
        verifyToken(params.get('access_token')).then(function (res) {
          _this.removeUrlToken(res.data.refresh_token);
          // Save refreshToken in localstorage
          localStorage.setItem('km_refresh_token', params.get('access_token'));
          var tokens = res.data;
          return cb(null, tokens);
        })["catch"](cb);
      } else if (typeof localStorage !== 'undefined' && localStorage.getItem('km_refresh_token') !== null) {
        // maybe in the local storage ?
        verifyToken(localStorage.getItem('km_refresh_token')).then(function (res) {
          _this.removeUrlToken(res.data.refresh_token);
          var tokens = res.data;
          return cb(null, tokens);
        })["catch"](cb);
      } else {
        // otherwise we need to get a refresh token
        window.location = "".concat(this.oauth_endpoint).concat(this.oauth_query, "&redirect_uri=").concat(window.location);
      }
    }
  }, {
    key: "deleteTokens",
    value: function deleteTokens(km) {
      var _this2 = this;
      return new Promise(function (resolve, reject) {
        // revoke the refreshToken
        km.auth.revoke().then(function (res) {
          return console.log('Token successfuly revoked!');
        })["catch"](function (err) {
          return console.error("Error when trying to revoke token: ".concat(err.message));
        });
        // We need to remove from storage and redirect user in every case (cf. https://github.com/keymetrics/pm2-io-js-api/issues/49)
        // remove the token from the localStorage
        localStorage.removeItem('km_refresh_token');
        setTimeout(function (_) {
          // redirect after few miliseconds so any user code will run
          window.location = "".concat(_this2.oauth_endpoint).concat(_this2.oauth_query);
        }, 500);
        return resolve();
      });
    }
  }]);
  return BrowserFlow;
}(AuthStrategy);

},{"./strategy":43}],42:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var AuthStrategy = require('./strategy');
module.exports = /*#__PURE__*/function (_AuthStrategy) {
  _inherits(StandaloneFlow, _AuthStrategy);
  function StandaloneFlow() {
    _classCallCheck(this, StandaloneFlow);
    return _callSuper(this, StandaloneFlow, arguments);
  }
  _createClass(StandaloneFlow, [{
    key: "retrieveTokens",
    value: function retrieveTokens(km, cb) {
      if (this._opts.refresh_token && this._opts.access_token) {
        // if both access and refresh tokens are provided, we are good
        return cb(null, {
          access_token: this._opts.access_token,
          refresh_token: this._opts.refresh_token
        });
      } else if (this._opts.refresh_token && this._opts.client_id) {
        // we can also make a request to get an access token
        km.auth.retrieveToken({
          client_id: this._opts.client_id,
          refresh_token: this._opts.refresh_token
        }).then(function (res) {
          var tokens = res.data;
          return cb(null, tokens);
        })["catch"](cb);
      } else {
        // otherwise the flow isn't used correctly
        throw new Error("If you want to use the standalone flow you need to provide either \n        a refresh and access token OR a refresh token and a client id");
      }
    }
  }, {
    key: "deleteTokens",
    value: function deleteTokens(km) {
      return km.auth.revoke;
    }
  }]);
  return StandaloneFlow;
}(AuthStrategy);

},{"./strategy":43}],43:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var constants = require('../../constants.js');
var AuthStrategy = /*#__PURE__*/function () {
  function AuthStrategy(opts) {
    _classCallCheck(this, AuthStrategy);
    this._opts = opts;
    this.client_id = opts.client_id || opts.OAUTH_CLIENT_ID;
    if (!this.client_id) {
      throw new Error('You must always provide a application id for any of the strategies');
    }
    this.scope = opts.scope || 'all';
    this.response_mode = opts.reponse_mode || 'query';
    var optsOauthEndpoint = null;
    if (opts && opts.services) {
      optsOauthEndpoint = opts.services.OAUTH || opts.services.API;
    }
    var oauthEndpoint = constants.services.OAUTH || constants.services.API;
    this.oauth_endpoint = "".concat(optsOauthEndpoint || oauthEndpoint);
    if (this.oauth_endpoint[this.oauth_endpoint.length - 1] === '/' && constants.OAUTH_AUTHORIZE_ENDPOINT[0] === '/') {
      this.oauth_endpoint = this.oauth_endpoint.substr(0, this.oauth_endpoint.length - 1);
    }
    this.oauth_endpoint += constants.OAUTH_AUTHORIZE_ENDPOINT;
    this.oauth_query = "?client_id=".concat(opts.client_id, "&response_mode=").concat(this.response_mode) + "&response_type=token&scope=".concat(this.scope);
  }
  _createClass(AuthStrategy, [{
    key: "retrieveTokens",
    value: function retrieveTokens() {
      throw new Error('You need to implement a retrieveTokens function inside your strategy');
    }
  }, {
    key: "deleteTokens",
    value: function deleteTokens() {
      throw new Error('You need to implement a deleteTokens function inside your strategy');
    }
  }], [{
    key: "implementations",
    value: function implementations(name) {
      var flows = {
        'embed': {
          nodule: require('./embed_strategy'),
          condition: 'node'
        },
        'browser': {
          nodule: require('./browser_strategy'),
          condition: 'browser'
        },
        'standalone': {
          nodule: require('./standalone_strategy'),
          condition: null
        }
      };
      return name ? flows[name] : null;
    }
  }]);
  return AuthStrategy;
}();
module.exports = AuthStrategy;

},{"../../constants.js":1,"./browser_strategy":41,"./embed_strategy":3,"./standalone_strategy":42}],44:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var RequestValidator = require('./utils/validator');
var debug = require('debug')('kmjs:endpoint');
module.exports = /*#__PURE__*/function () {
  function Endpoint(opts) {
    _classCallCheck(this, Endpoint);
    Object.assign(this, opts);
  }
  _createClass(Endpoint, [{
    key: "build",
    value: function build(http) {
      var endpoint = this;
      return function () {
        var _arguments = arguments;
        var callsite = new Error().stack.split('\n')[2];
        if (callsite && callsite.length > 0) {
          debug("Call to '".concat(endpoint.route.name, "' from ").concat(callsite.replace('    at ', '')));
        }
        return new Promise(function (resolve, reject) {
          RequestValidator.extract(endpoint, Array.prototype.slice.call(_arguments)).then(function (opts) {
            // Different service than default, setup base url in url
            if (endpoint.service && endpoint.service.baseURL) {
              var base = endpoint.service.baseURL;
              base = base[base.length - 1] === '/' ? base.substr(0, base.length - 1) : base;
              opts.url = base + opts.url;
            }
            http.request(opts).then(resolve, reject);
          })["catch"](reject);
        });
      };
    }
  }]);
  return Endpoint;
}();

},{"./utils/validator":48,"debug":4}],45:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Namespace = require('./namespace');
var constants = require('../constants');
var NetworkWrapper = require('./network');
var logger = require('debug')('kmjs');
var Keymetrics = /*#__PURE__*/function () {
  /**
  * @constructor
  * Keymetrics
  *
  * @param {Object} [opts]
  * @param {String} [opts.OAUTH_CLIENT_ID] the oauth client ID used to authenticate to KM
  * @param {Object} [opts.services] base url for differents services
  * @param {String} [opts.mappings] api mappings
  */
  function Keymetrics(opts) {
    _classCallCheck(this, Keymetrics);
    logger('init keymetrics instance');
    this.opts = Object.assign(constants, opts);
    logger('init network client (http/ws)');
    this._network = new NetworkWrapper(this, this.opts);
    var mapping = opts && opts.mappings ? opts.mappings : require('./api_mappings.json');
    logger("Using mappings provided in ".concat(opts && opts.mappings ? 'options' : 'package'));

    // build namespaces at startup
    logger('building namespaces');
    var root = new Namespace(mapping, {
      name: 'root',
      http: this._network,
      services: this.opts.services
    });
    logger('exposing namespaces');
    for (var key in root) {
      if (key === 'name' || key === 'opts') continue;
      this[key] = root[key];
    }
    logger("attached namespaces : ".concat(Object.keys(this)));
    this.realtime = this._network.realtime;
  }

  /**
   * Use a specific flow to retrieve an access token on behalf the user
   * @param {String|Function} flow either a flow name or a custom implementation
   * @param {Object} [opts]
   * @param {String} [opts.client_id] the OAuth client ID to use to identify the application
   *  default to the one defined when instancing Keymetrics and fallback to 795984050 (custom tokens)
   * @throws invalid use of this function, either the flow don't exist or isn't correctly implemented
   */
  _createClass(Keymetrics, [{
    key: "use",
    value: function use(flow, opts) {
      var _this = this;
      logger("using ".concat(flow, " authentication strategy"));
      this._network.useStrategy(flow, opts);
      // the logout is dependent of the auth flow so we need it to be initialize
      // but also we need to give the access of the instance, so we inject it here
      this.auth.logout = function () {
        return _this._network.oauth_flow.deleteTokens(_this);
      };
      return this;
    }

    /**
     * API date lag, in millisecond.  This is the difference between the current browser date and the
     * approximated API date.  This is useful to compute duration between dates returned by the API
     * and "now".
     * @example
     * const apiDate = moment().add(km.apiDateLag)
     * const timeSinceLastUpdate = apiDate.diff(server.updated_at)
     */
  }, {
    key: "apiDateLag",
    get: function get() {
      return this._network.apiDateLag;
    }
  }]);
  return Keymetrics;
}();
module.exports = Keymetrics;

},{"../constants":1,"./api_mappings.json":40,"./namespace":46,"./network":47,"debug":4}],46:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Endpoint = require('./endpoint');
var logger = require('debug')('kmjs:namespace');
module.exports = /*#__PURE__*/function () {
  function Namespace(mapping, opts) {
    _classCallCheck(this, Namespace);
    logger("initialization namespace ".concat(opts.name));
    this.name = opts.name;
    this.http = opts.http;
    this.endpoints = [];
    this.namespaces = [];
    logger("building namespace ".concat(opts.name));
    for (var name in mapping) {
      var child = mapping[name];
      if (_typeof(mapping) === 'object' && !child.route) {
        // ignore the 'default' namespace that should bind to the parent namespace
        if (name === 'default') {
          // create the namespace
          var defaultNamespace = new Namespace(child, {
            name: name,
            http: this.http,
            services: opts.services
          });
          this.namespaces.push(defaultNamespace);
          // bind property of the default namespace to this namespace
          for (var key in defaultNamespace) {
            if (key === 'name' || key === 'opts') continue;
            this[key] = defaultNamespace[key];
          }
          continue;
        }
        // if the parent namespace is a object, the child are namespace too
        this.addNamespace(new Namespace(child, {
          name: name,
          http: this.http,
          services: opts.services
        }));
      } else {
        // otherwise its an endpoint
        if (child.service && opts.services && opts.services[child.service.name]) {
          child.service.baseURL = opts.services[child.service.name];
        }
        this.addEndpoint(new Endpoint(child));
      }
    }

    // logging namespaces
    if (this.namespaces.length > 0) {
      logger("namespace ".concat(this.name, " contains namespaces : \n").concat(this.namespaces.map(function (namespace) {
        return namespace.name;
      }).join('\n'), "\n"));
    }

    // logging endpoints
    if (this.endpoints.length > 0) {
      logger("Namespace ".concat(this.name, " contains endpoints : \n").concat(this.endpoints.map(function (endpoint) {
        return endpoint.route.name;
      }).join('\n'), "\n"));
    }
  }
  _createClass(Namespace, [{
    key: "addNamespace",
    value: function addNamespace(namespace) {
      if (!namespace || namespace.name === this.name) {
        throw new Error("A namespace must not have the same name as the parent namespace");
      }
      if (!(namespace instanceof Namespace)) {
        throw new Error("addNamespace only accept Namespace instance");
      }
      this.namespaces.push(namespace);
      this[namespace.name] = namespace;
    }
  }, {
    key: "addEndpoint",
    value: function addEndpoint(endpoint) {
      if (!endpoint || endpoint.name === this.name) {
        throw new Error("A endpoint must not have the same name as a namespace");
      }
      if (!(endpoint instanceof Endpoint)) {
        throw new Error("addNamespace only accept Namespace instance");
      }
      this.endpoints.push(endpoint);
      this[endpoint.name] = endpoint.build(this.http);
    }
  }]);
  return Namespace;
}();

},{"./endpoint":44,"debug":4}],47:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var extrareqp2 = require('extrareqp2');
var AuthStrategy = require('./auth_strategies/strategy');
var constants = require('../constants');
var logger = require('debug')('kmjs:network');
var loggerHttp = require('debug')('kmjs:network:http');
var loggerWS = require('debug')('kmjs:network:ws');
var WS = require('./utils/websocket');
var EventEmitter = require('eventemitter2');
var async = require('async');
var BUFFERIZED = -1;
module.exports = /*#__PURE__*/function () {
  function NetworkWrapper(km, opts) {
    _classCallCheck(this, NetworkWrapper);
    logger('init network manager');
    opts.baseURL = opts.services.API;
    this.opts = opts;
    this.opts.maxRedirects = 0;
    this.tokens = {
      refresh_token: null,
      access_token: null
    };
    this.km = km;
    this._queue = [];
    this._extrareqp2 = extrareqp2.create(opts);
    this._websockets = [];
    this._endpoints = new Map();
    this._bucketFilters = new Map();
    this.apiDateLag = 0;
    this.realtime = new EventEmitter({
      wildcard: true,
      delimiter: ':',
      newListener: false,
      maxListeners: 100
    });
    // https://github.com/EventEmitter2/EventEmitter2/issues/214
    var self = this;
    var realtimeOn = this.realtime.on;
    this.realtime.on = function () {
      self.editSocketFilters('push', arguments[0]);
      return realtimeOn.apply(self.realtime, arguments);
    };
    var realtimeOff = this.realtime.off;
    this.realtime.off = function () {
      self.editSocketFilters('remove', arguments[0]);
      return realtimeOff.apply(self.realtime, arguments);
    };
    this.realtime.subscribe = this.subscribe.bind(this);
    this.realtime.unsubscribe = this.unsubscribe.bind(this);
    this.authenticated = false;
    this._setupDateLag();
  }
  _createClass(NetworkWrapper, [{
    key: "_setupDateLag",
    value: function _setupDateLag() {
      var _this = this;
      var updateApiDateLag = function updateApiDateLag(response) {
        if (response && response.headers && response.headers.date) {
          var headerDate = new Date(response.headers.date);
          var clientDate = new Date();

          // The header date is likely to be truncated to the second, so truncate the client date too
          headerDate.setMilliseconds(0);
          clientDate.setMilliseconds(0);
          _this.apiDateLag = headerDate - clientDate;
        }
      };
      this._extrareqp2.interceptors.response.use(function (response) {
        updateApiDateLag(response);
        return response;
      }, function (error) {
        updateApiDateLag(error.response);
        return Promise.reject(error);
      });
    }
  }, {
    key: "_queueUpdater",
    value: function _queueUpdater() {
      if (this.authenticated === false) return;
      if (this._queue.length > 0) {
        logger("Emptying requests queue (size: ".concat(this._queue.length, ")"));
      }

      // when we are authenticated we can clear the queue
      while (this._queue.length > 0) {
        var promise = this._queue.shift();
        // make the request
        this.request(promise.request).then(promise.resolve, promise.reject);
      }
    }

    /**
     * Resolve the endpoint of the node to make the request to
     * because each bucket might be on a different node
     * @param {String} bucketID the bucket id
     *
     * @return {Promise}
     */
  }, {
    key: "_resolveBucketEndpoint",
    value: function _resolveBucketEndpoint(bucketID) {
      var _this2 = this;
      if (!bucketID) return Promise.reject(new Error("Missing argument : bucketID"));
      if (!this._endpoints.has(bucketID)) {
        var promise = this._extrareqp2.request({
          url: "/api/bucket/".concat(bucketID),
          method: 'GET',
          headers: {
            Authorization: "Bearer ".concat(this.tokens.access_token)
          }
        }).then(function (res) {
          return res.data.node.endpoints.web;
        })["catch"](function (e) {
          _this2._endpoints["delete"](bucketID);
          throw e;
        });
        this._endpoints.set(bucketID, promise);
      }
      return this._endpoints.get(bucketID);
    }

    /**
     * Send a http request
     * @param {Object} opts
     * @param {String} [opts.method=GET] http method
     * @param {String} opts.url the full URL
     * @param {Object} [opts.data] body data
     * @param {Object} [opts.params] url params
     *
     * @return {Promise}
     */
  }, {
    key: "request",
    value: function request(httpOpts) {
      var _this3 = this;
      return new Promise(function (resolve, reject) {
        async.series([
        // verify that we don't need to buffer the request because authentication
        function (next) {
          if (_this3.authenticated === true || httpOpts.authentication === false) return next();
          loggerHttp("Queued request to ".concat(httpOpts.url));
          _this3._queue.push({
            resolve: resolve,
            reject: reject,
            request: httpOpts
          });
          // we need to stop the flow here
          return next(BUFFERIZED);
        },
        // we need to verify that the baseURL is correct
        function (next) {
          if (!httpOpts.url.match(/bucket\/[0-9a-fA-F]{24}/)) return next();
          // parse the bucket id from URL
          var bucketID = httpOpts.url.split('/')[3];
          // we need to retrieve where to send the request depending on the backend
          _this3._resolveBucketEndpoint(bucketID).then(function (endpoint) {
            httpOpts.baseURL = endpoint;
            // then continue the flow
            return next();
          })["catch"](next);
        },
        // if the request has not been bufferized, make the request
        function (next) {
          // super trick to transform a promise response to a callback
          var successNext = function successNext(res) {
            return next(null, res);
          };
          loggerHttp("Making request to ".concat(httpOpts.url));
          if (!httpOpts.headers) {
            httpOpts.headers = {};
          }
          httpOpts.headers.Authorization = "Bearer ".concat(_this3.tokens.access_token);
          _this3._extrareqp2.request(httpOpts).then(successNext)["catch"](function (error) {
            var response = error.response;
            // we only need to handle when code is 401 (which mean unauthenticated)
            if (response && response.status !== 401) return next(response);
            loggerHttp("Got unautenticated response, buffering request from now ...");

            // we tell the client to not send authenticated request anymore
            _this3.authenticated = false;
            loggerHttp("Asking to the oauth flow to retrieve new tokens");
            var q = function q() {
              _this3.oauth_flow.retrieveTokens(_this3.km, function (err, data) {
                // if it fail, we fail the whole request
                if (err) {
                  loggerHttp("Failed to retrieve new tokens : ".concat(err.message || err));
                  return next(response);
                }
                // if its good, we try to update the tokens
                loggerHttp("Succesfully retrieved new tokens");
                _this3._updateTokens(null, data, function (err, authenticated) {
                  // if it fail, we fail the whole request
                  if (err) return next(response);
                  // then we can rebuffer the request
                  loggerHttp("Re-buffering call to ".concat(httpOpts.url, " since authenticated now"));
                  httpOpts.headers.Authorization = "Bearer ".concat(_this3.tokens.access_token);
                  return _this3._extrareqp2.request(httpOpts).then(successNext)["catch"](next);
                });
              });
            };
            if (httpOpts.url == _this3.opts.services.OAUTH + '/api/oauth/token') {
              // Avoid infinite recursive loop to retrieveToken
              return setTimeout(q.bind(_this3), 500);
            }
            q();
          });
        }], function (err, results) {
          // if the flow is stoped because the request has been
          // buferred, we don't need to do anything
          if (err === BUFFERIZED) return;
          return err ? reject(err) : resolve(results[2]);
        });
      });
    }

    /**
     * Update the access token used by all the networking clients
     * @param {Error} err if any erro
     * @param {String} accessToken the token you want to use
     * @param {Function} [cb] invoked with <err, authenticated>
     * @private
     */
  }, {
    key: "_updateTokens",
    value: function _updateTokens(err, data, cb) {
      var _this4 = this;
      if (err) {
        console.error('Error while retrieving tokens:', err);
        // Try to logout/login user
        this.oauth_flow.deleteTokens(this.km);
        return console.error(err.response ? err.response.data : err.stack);
      }
      if (!data || !data.access_token || !data.refresh_token) throw new Error('Invalid tokens');
      this.tokens = data;
      loggerHttp("Registered new access_token : ".concat(data.access_token));
      this._websockets.forEach(function (websocket) {
        return websocket.updateAuthorization(data.access_token);
      });
      this._extrareqp2.defaults.headers.common['Authorization'] = "Bearer ".concat(data.access_token);
      this._extrareqp2.request({
        url: '/api/bucket',
        method: 'GET',
        headers: {
          Authorization: "Bearer ".concat(data.access_token)
        }
      }).then(function (res) {
        loggerHttp("Cached ".concat(res.data.length, " buckets for current user"));
        _this4.authenticated = true;
        _this4._queueUpdater();
        return typeof cb === 'function' ? cb(null, true) : null;
      })["catch"](function (err) {
        console.error('Error while retrieving buckets');
        console.error(err.response ? err.response.data : err);
        return typeof cb === 'function' ? cb(err) : null;
      });
    }

    /**
     * Specify a strategy to use when authenticating to server
     * @param {String|Function} flow the name of the flow to use or a custom implementation
     * @param {Object} [opts]
     * @param {String} [opts.client_id] the OAuth client ID to use to identify the application
     *  default to the one defined when instancing Keymetrics and fallback to 795984050 (custom tokens)
     * @throws invalid use of this function, either the flow don't exist or isn't correctly implemented
     */
  }, {
    key: "useStrategy",
    value: function useStrategy(flow, opts) {
      if (!opts) opts = {};
      // if client not provided here, use the one given in the instance
      if (!opts.client_id) {
        opts.client_id = this.opts.OAUTH_CLIENT_ID;
      }

      // in the case of flow being a custom implementation
      if (_typeof(flow) === 'object') {
        this.oauth_flow = flow;
        if (!this.oauth_flow.retrieveTokens || !this.oauth_flow.deleteTokens) {
          throw new Error('You must implement the Strategy interface to use it');
        }
        return this.oauth_flow.retrieveTokens(this.km, this._updateTokens.bind(this));
      }
      // otherwise fallback on the flow that are implemented
      if (typeof AuthStrategy.implementations(flow) === 'undefined') {
        throw new Error("The flow named ".concat(flow, " doesn't exist"));
      }
      var flowMeta = AuthStrategy.implementations(flow);

      // verify that the environnement condition is meet
      if (flowMeta.condition && constants.ENVIRONNEMENT !== flowMeta.condition) {
        throw new Error("The flow ".concat(flow, " is reserved for ").concat(flowMeta.condition, " environment"));
      }
      var FlowImpl = flowMeta.nodule;
      this.oauth_flow = new FlowImpl(opts);
      return this.oauth_flow.retrieveTokens(this.km, this._updateTokens.bind(this));
    }
  }, {
    key: "editSocketFilters",
    value: function editSocketFilters(type, event) {
      if (event.indexOf('**') === 0) throw new Error('You need to provide a bucket public id.');
      event = event.split(':');
      var bucketPublicId = event[0];
      var filter = event.slice(2).join(':');
      var socket = this._websockets.find(function (socket) {
        return socket.bucketPublic === bucketPublicId;
      });
      if (!this._bucketFilters.has(bucketPublicId)) this._bucketFilters.set(bucketPublicId, []);
      var filters = this._bucketFilters.get(bucketPublicId);
      if (type === 'push') {
        filters.push(filter);
      } else {
        filters.splice(filters.indexOf(filter), 1);
      }
      if (!socket) return;
      socket.send(JSON.stringify({
        action: 'sub',
        public_id: bucketPublicId,
        filters: Array.from(new Set(filters)) // avoid duplicates
      }));
    }

    /**
     * Subscribe to realtime from bucket
     * @param {String} bucketId bucket id
     * @param {Object} [opts]
     *
     * @return {Promise}
     */
  }, {
    key: "subscribe",
    value: function subscribe(bucketId, opts) {
      var _this5 = this;
      return new Promise(function (resolve, reject) {
        logger("Request endpoints for ".concat(bucketId));
        _this5.km.bucket.retrieve(bucketId).then(function (res) {
          var bucket = res.data;
          var connected = false;
          var endpoints = bucket.node.endpoints;
          var endpoint = endpoints.realtime || endpoints.web;
          endpoint = endpoint.replace('http', 'ws');
          if (_this5.opts.IS_DEBUG) {
            endpoint = endpoint.replace(':3000', ':4020');
          }
          loggerWS("Found endpoint for ".concat(bucketId, " : ").concat(endpoint));

          // connect websocket client to the realtime endpoint
          var socket = new WS("".concat(endpoint, "/primus"), _this5.tokens.access_token);
          socket.bucketPublic = bucket.public_id;
          socket.connected = false;
          socket.bucket = bucketId;
          var keepAliveHandler = function keepAliveHandler() {
            socket.ping();
          };
          var keepAliveInterval = null;
          var onConnect = function onConnect() {
            logger("Connected to ws endpoint : ".concat(endpoint, " (bucket: ").concat(bucketId, ")"));
            socket.connected = true;
            _this5.realtime.emit("".concat(bucket.public_id, ":connected"));
            socket.send(JSON.stringify({
              action: 'sub',
              public_id: bucket.public_id,
              filters: Array.from(new Set(_this5._bucketFilters.get(bucket.public_id))) // avoid duplicates
            }));
            if (keepAliveInterval !== null) {
              clearInterval(keepAliveInterval);
              keepAliveInterval = null;
            }
            keepAliveInterval = setInterval(keepAliveHandler.bind(_this5), 5000);
            if (!connected) {
              connected = true;
              return resolve(socket);
            }
          };
          socket.onmaxreconnect = function (_) {
            if (!connected) {
              connected = true;
              return reject(new Error('Connection timeout'));
            }
          };
          socket.onopen = onConnect;
          socket.onunexpectedresponse = function (req, res) {
            if (res.statusCode === 401) {
              return _this5.oauth_flow.retrieveTokens(_this5.km, function (err, data) {
                if (err) return logger("Failed to retrieve tokens for ws: ".concat(err.message));
                logger("Succesfully retrieved new tokens for ws");
                _this5._updateTokens(null, data, function (err, authenticated) {
                  if (err) return logger("Failed to update tokens for ws: ".concat(err.message));
                  return socket._tryReconnect();
                });
              });
            }
            return socket._tryReconnect();
          };
          socket.onerror = function (err) {
            loggerWS("Error on ".concat(endpoint, " (bucket: ").concat(bucketId, ")"));
            loggerWS(err);
            _this5.realtime.emit("".concat(bucket.public_id, ":error"), err);
          };
          socket.onclose = function () {
            logger("Closing ws connection ".concat(endpoint, " (bucket: ").concat(bucketId, ")"));
            socket.connected = false;
            _this5.realtime.emit("".concat(bucket.public_id, ":disconnected"));
            if (keepAliveInterval !== null) {
              clearInterval(keepAliveInterval);
              keepAliveInterval = null;
            }
          };

          // broadcast in the bus
          socket.onmessage = function (msg) {
            loggerWS("Received message for bucket ".concat(bucketId, " (").concat((msg.data.length / 1000).toFixed(1), " Kb)"));
            var data = null;
            try {
              data = JSON.parse(msg.data);
            } catch (e) {
              return loggerWS("Receive not json message for bucket ".concat(bucketId));
            }
            var packet = data.data[1];
            Object.keys(packet).forEach(function (event) {
              if (event === 'server_name') return;
              _this5.realtime.emit("".concat(bucket.public_id, ":").concat(packet.server_name || 'none', ":").concat(event), packet[event]);
            });
          };
          _this5._websockets.push(socket);
        })["catch"](reject);
      });
    }

    /**
     * Unsubscribe realtime from bucket
     * @param {String} bucketId bucket id
     * @param {Object} [opts]
     *
     * @return {Promise}
     */
  }, {
    key: "unsubscribe",
    value: function unsubscribe(bucketId, opts) {
      var _this6 = this;
      return new Promise(function (resolve, reject) {
        logger("Unsubscribe from realtime for ".concat(bucketId));
        var socket = _this6._websockets.find(function (socket) {
          return socket.bucket === bucketId;
        });
        if (!socket) {
          return reject(new Error("Realtime wasn't connected to ".concat(bucketId)));
        }
        socket.close(1000, 'Disconnecting');
        logger("Succesfully unsubscribed from realtime for ".concat(bucketId));
        return resolve();
      });
    }
  }]);
  return NetworkWrapper;
}();

},{"../constants":1,"./auth_strategies/strategy":43,"./utils/websocket":49,"async":2,"debug":4,"eventemitter2":6,"extrareqp2":7}],48:[function(require,module,exports){
'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
module.exports = /*#__PURE__*/function () {
  function RequestValidator() {
    _classCallCheck(this, RequestValidator);
  }
  _createClass(RequestValidator, null, [{
    key: "extract",
    value:
    /**
     * Extract httpOptions from the endpoint definition
     * and the data given by the user
     *
     * @param {Object} endpoint endpoint definition
     * @param {Array} args arguments given by the user
     * @return {Promise} resolve to the http options need to make the request
     */
    function extract(endpoint, args) {
      var isDefined = function isDefined(val) {
        return val !== null && typeof val !== 'undefined';
      };
      return new Promise(function (resolve, reject) {
        var httpOpts = {
          params: {},
          data: {},
          url: endpoint.route.name + '',
          method: endpoint.route.type,
          authentication: endpoint.authentication || false
        };
        switch (endpoint.route.type) {
          // GET request, we assume data will only be in the query or url params
          case 'GET':
            {
              var _iterator = _createForOfIteratorHelper(endpoint.params || []),
                _step;
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var param = _step.value;
                  var value = args.shift();
                  // params should always be a string since they will be replaced in the url
                  if (typeof value !== 'string' && param.optional === false) {
                    return reject(new Error("Expected to receive string argument for ".concat(param.name, " to match but got ").concat(value)));
                  }
                  if (value) {
                    // if value is given, use it
                    httpOpts.url = httpOpts.url.replace(param.name, value);
                  } else if (param.optional === false && param.defaultvalue !== null) {
                    // use default value if available
                    httpOpts.url = httpOpts.url.replace(param.name, param.defaultvalue);
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              var _iterator2 = _createForOfIteratorHelper(endpoint.query || []),
                _step2;
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var _param = _step2.value;
                  var _value = args.shift();
                  // query should always be a string since they will be replaced in the url
                  if (typeof _value !== 'string' && _param.optional === false) {
                    return reject(new Error("Expected to receive string argument for ".concat(_param.name, " query but got ").concat(_value)));
                  }
                  // set query value
                  if (_value) {
                    // if value is given, use it
                    httpOpts.params[_param.name] = _value;
                  } else if (_param.optional === false && _param.defaultvalue !== null) {
                    // use default value if available
                    httpOpts.params[_param.name] = _param.defaultvalue;
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              break;
            }
          // for PUT, POST and PATCH request, only params and body are authorized
          case 'PUT':
          case 'POST':
          case 'PATCH':
            {
              var _iterator3 = _createForOfIteratorHelper(endpoint.params || []),
                _step3;
              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  var _param2 = _step3.value;
                  var _value2 = args.shift();
                  // params should always be a string since they will be replaced in the url
                  if (typeof _value2 !== 'string' && _param2.optional === false) {
                    return reject(new Error("Expected to receive string argument for ".concat(_param2.name, " to match but got ").concat(_value2)));
                  }
                  // replace param in url
                  if (_value2) {
                    // if value is given, use it
                    httpOpts.url = httpOpts.url.replace(_param2.name, _value2);
                  } else if (_param2.optional === false && _param2.defaultvalue !== null) {
                    // use default value if available
                    httpOpts.url = httpOpts.url.replace(_param2.name, _param2.defaultvalue);
                  }
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }
              var _iterator4 = _createForOfIteratorHelper(endpoint.query || []),
                _step4;
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  var _param3 = _step4.value;
                  var _value3 = args.shift();
                  // query should always be a string since they will be replaced in the url
                  if (typeof _value3 !== 'string' && _param3.optional === false) {
                    return reject(new Error("Expected to receive string argument for ".concat(_param3.name, " query but got ").concat(_value3)));
                  }
                  // set query value
                  if (_value3) {
                    // if value is given, use it
                    httpOpts.params[_param3.name] = _value3;
                  } else if (_param3.optional === false && _param3.defaultvalue !== null) {
                    // use default value if available
                    httpOpts.params[_param3.name] = _param3.defaultvalue;
                  }
                }
                // if we don't have any arguments, break
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
              if (args.length === 0) break;
              var data = args[0];
              if (_typeof(data) !== 'object' && endpoint.body.length > 0) {
                return reject(new Error("Expected to receive an object for post data but received ".concat(_typeof(data))));
              }
              var _iterator5 = _createForOfIteratorHelper(endpoint.body || []),
                _step5;
              try {
                for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                  var field = _step5.value;
                  var isSubfield = field.name.includes('[]') === true;

                  // verify that the mandatory field are here
                  if (!isDefined(data[field.name]) && isSubfield === false && field.optional === false && field.defaultvalue === null) {
                    return reject(new Error("Missing mandatory field ".concat(field.name, " to make a POST request on ").concat(endpoint.route.name)));
                  }
                  // verify that the mandatory field are the good type
                  if (_typeof(data[field.name]) !== field.type && isSubfield === false && field.optional === false && field.defaultvalue === null) {
                    // eslint-disable-line
                    return reject(new Error("Invalid type for field ".concat(field.name, ", expected ").concat(field.type, " but got ").concat(_typeof(data[field.name]))));
                  }

                  // add it to the request only when its present
                  if (isDefined(data[field.name])) {
                    httpOpts.data[field.name] = data[field.name];
                  }

                  // or else its not optional and has a default value
                  if (field.optional === false && field.defaultvalue !== null) {
                    httpOpts.data[field.name] = field.defaultvalue;
                  }
                }
              } catch (err) {
                _iterator5.e(err);
              } finally {
                _iterator5.f();
              }
              break;
            }
          // DELETE can have params or query parameters
          case 'DELETE':
            {
              var _iterator6 = _createForOfIteratorHelper(endpoint.params || []),
                _step6;
              try {
                for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                  var _param4 = _step6.value;
                  var _value4 = args.shift();
                  // params should always be a string since they will be replaced in the url
                  if (typeof _value4 !== 'string' && _param4.optional === false) {
                    return reject(new Error("Expected to receive string argument for ".concat(_param4.name, " to match but got ").concat(_value4)));
                  }
                  // replace param in url
                  if (_value4) {
                    // if value is given, use it
                    httpOpts.url = httpOpts.url.replace(_param4.name, _value4);
                  } else if (_param4.optional === false && _param4.defaultvalue !== null) {
                    // use default value if available
                    httpOpts.url = httpOpts.url.replace(_param4.name, _param4.defaultvalue);
                  }
                }
              } catch (err) {
                _iterator6.e(err);
              } finally {
                _iterator6.f();
              }
              var _iterator7 = _createForOfIteratorHelper(endpoint.query || []),
                _step7;
              try {
                for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                  var _param5 = _step7.value;
                  var _value5 = args.shift();
                  // query should always be a string
                  if (typeof _value5 !== 'string' && _param5.optional === false) {
                    return reject(new Error("Expected to receive string argument for ".concat(_param5.name, " query but got ").concat(_value5)));
                  }
                  // replace param in url
                  if (_value5) {
                    // if value is given, use it
                    httpOpts.params[_param5.name] = _value5;
                  } else if (_param5.optional === false && _param5.defaultvalue !== null) {
                    // use default value if available
                    httpOpts.params[_param5.name] = _param5.defaultvalue;
                  }
                }
              } catch (err) {
                _iterator7.e(err);
              } finally {
                _iterator7.f();
              }
              break;
            }
          default:
            {
              return reject(new Error("Invalid endpoint declaration, invalid method ".concat(endpoint.route.type, " found")));
            }
        }
        return resolve(httpOpts);
      });
    }
  }]);
  return RequestValidator;
}();

},{}],49:[function(require,module,exports){
/* global WebSocket */

'use strict';

var ws = require('ws');
var debug = require('debug')('kmjs:network:_ws');
var _WebSocket = typeof ws !== 'function' ? WebSocket : ws;
var defaultOptions = {
  debug: false,
  automaticOpen: true,
  reconnectOnError: true,
  reconnectInterval: 1000,
  maxReconnectInterval: 10000,
  reconnectDecay: 1,
  timeoutInterval: 2000,
  maxReconnectAttempts: Infinity,
  randomRatio: 3,
  reconnectOnCleanClose: false
};
var ReconnectableWebSocket = function ReconnectableWebSocket(url, token, protocols, options) {
  if (!protocols) protocols = [];
  if (!options) options = [];
  this.CONNECTING = 0;
  this.OPEN = 1;
  this.CLOSING = 2;
  this.CLOSED = 3;
  this._url = url;
  this._token = token;
  this._protocols = protocols;
  this._options = Object.assign({}, defaultOptions, options);
  this._messageQueue = [];
  this._reconnectAttempts = 0;
  this.readyState = this.CONNECTING;
  if (typeof this._options.debug === 'function') {
    this._debug = this._options.debug;
  } else if (this._options.debug) {
    this._debug = console.log.bind(console);
  } else {
    this._debug = function () {};
  }
  if (this._options.automaticOpen) this.open();
};
ReconnectableWebSocket.prototype.updateAuthorization = function (authorization) {
  this._token = authorization;
};
ReconnectableWebSocket.prototype.open = function () {
  debug('open');
  var socket = this._socket = new _WebSocket("".concat(this._url, "?token=").concat(this._token), this._protocols);
  if (this._options.binaryType) {
    socket.binaryType = this._options.binaryType;
  }
  if (this._options.maxReconnectAttempts && this._options.maxReconnectAttempts < this._reconnectAttempts) {
    return this.onmaxreconnect();
  }
  this._syncState();
  if (socket.on) {
    socket.on('unexpected-response', this._onunexpectedresponse);
  }
  socket.onmessage = this._onmessage.bind(this);
  socket.onopen = this._onopen.bind(this);
  socket.onclose = this._onclose.bind(this);
  socket.onerror = this._onerror.bind(this);
};
ReconnectableWebSocket.prototype.send = function (data) {
  debug('send');
  if (this._socket && this._socket.readyState === _WebSocket.OPEN && this._messageQueue.length === 0) {
    this._socket.send(data);
  } else {
    this._messageQueue.push(data);
  }
};
ReconnectableWebSocket.prototype.ping = function () {
  debug('ping');
  if (this._socket.ping && this._socket && this._socket.readyState === _WebSocket.OPEN && this._messageQueue.length === 0) {
    this._socket.ping();
  }
};
ReconnectableWebSocket.prototype.close = function (code, reason) {
  debug('close');
  if (typeof code === 'undefined') code = 1000;
  if (this._socket) this._socket.close(code, reason);
};
ReconnectableWebSocket.prototype._onunexpectedresponse = function (req, res) {
  debug('unexpected-response');
  this.onunexpectedresponse && this.onunexpectedresponse(req, res);
};
ReconnectableWebSocket.prototype._onmessage = function (message) {
  debug('onmessage');
  this.onmessage && this.onmessage(message);
};
ReconnectableWebSocket.prototype._onopen = function (event) {
  debug('onopen');
  this._syncState();
  this._flushQueue();
  if (this._reconnectAttempts !== 0) {
    this.onreconnect && this.onreconnect();
  }
  this._reconnectAttempts = 0;
  this.onopen && this.onopen(event);
};
ReconnectableWebSocket.prototype._onclose = function (event) {
  debug('onclose', event);
  this._syncState();
  this._debug('WebSocket: connection is broken', event);
  this.onclose && this.onclose(event);
  this._tryReconnect(event);
};
ReconnectableWebSocket.prototype._onerror = function (event) {
  debug('onerror', event);
  // To avoid undetermined state, we close socket on error
  this._socket.close();
  this._syncState();
  this._debug('WebSocket: error', event);
  this.onerror && this.onerror(event);
  if (this._options.reconnectOnError) this._tryReconnect(event);
};
ReconnectableWebSocket.prototype._tryReconnect = function (event) {
  var self = this;
  debug('Trying to reconnect');
  if (event.wasClean && !this._options.reconnectOnCleanClose) {
    return;
  }
  setTimeout(function () {
    if (self.readyState === self.CLOSING || self.readyState === self.CLOSED) {
      self._reconnectAttempts++;
      self.open();
    }
  }, this._getTimeout());
};
ReconnectableWebSocket.prototype._flushQueue = function () {
  while (this._messageQueue.length !== 0) {
    var data = this._messageQueue.shift();
    this._socket.send(data);
  }
};
ReconnectableWebSocket.prototype._getTimeout = function () {
  var timeout = this._options.reconnectInterval * Math.pow(this._options.reconnectDecay, this._reconnectAttempts);
  timeout = timeout > this._options.maxReconnectInterval ? this._options.maxReconnectInterval : timeout;
  return this._options.randomRatio ? getRandom(timeout / this._options.randomRatio, timeout) : timeout;
};
ReconnectableWebSocket.prototype._syncState = function () {
  this.readyState = this._socket.readyState;
};
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
module.exports = ReconnectableWebSocket;

},{"debug":4,"ws":3}],"/":[function(require,module,exports){
"use strict";

module.exports = require('./src/keymetrics.js');

},{"./src/keymetrics.js":45}]},{},[])("/")
});
