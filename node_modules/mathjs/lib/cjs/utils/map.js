"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PartitionedMap = exports.ObjectWrappingMap = void 0;
exports.assign = assign;
exports.createEmptyMap = createEmptyMap;
exports.createMap = createMap;
exports.isMap = isMap;
exports.toObject = toObject;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _customs = require("./customs.js");
var _is = require("./is.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * A map facade on a bare object.
 *
 * The small number of methods needed to implement a scope,
 * forwarding on to the SafeProperty functions. Over time, the codebase
 * will stop using this method, as all objects will be Maps, rather than
 * more security prone objects.
 */
var ObjectWrappingMap = exports.ObjectWrappingMap = /*#__PURE__*/function () {
  function ObjectWrappingMap(object) {
    (0, _classCallCheck2["default"])(this, ObjectWrappingMap);
    this.wrappedObject = object;
    this[Symbol.iterator] = this.entries;
  }
  return (0, _createClass2["default"])(ObjectWrappingMap, [{
    key: "keys",
    value: function keys() {
      return Object.keys(this.wrappedObject).values();
    }
  }, {
    key: "get",
    value: function get(key) {
      return (0, _customs.getSafeProperty)(this.wrappedObject, key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      (0, _customs.setSafeProperty)(this.wrappedObject, key, value);
      return this;
    }
  }, {
    key: "has",
    value: function has(key) {
      return (0, _customs.hasSafeProperty)(this.wrappedObject, key);
    }
  }, {
    key: "entries",
    value: function entries() {
      var _this = this;
      return mapIterator(this.keys(), function (key) {
        return [key, _this.get(key)];
      });
    }
  }, {
    key: "forEach",
    value: function forEach(callback) {
      var _iterator = _createForOfIteratorHelper(this.keys()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;
          callback(this.get(key), key, this);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      delete this.wrappedObject[key];
    }
  }, {
    key: "clear",
    value: function clear() {
      var _iterator2 = _createForOfIteratorHelper(this.keys()),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var key = _step2.value;
          this["delete"](key);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "size",
    get: function get() {
      return Object.keys(this.wrappedObject).length;
    }
  }]);
}();
/**
 * Create a map with two partitions: a and b.
 * The set with bKeys determines which keys/values are read/written to map b,
 * all other values are read/written to map a
 *
 * For example:
 *
 *   const a = new Map()
 *   const b = new Map()
 *   const p = new PartitionedMap(a, b, new Set(['x', 'y']))
 *
 * In this case, values `x` and `y` are read/written to map `b`,
 * all other values are read/written to map `a`.
 */
var PartitionedMap = exports.PartitionedMap = /*#__PURE__*/function () {
  /**
   * @param {Map} a
   * @param {Map} b
   * @param {Set} bKeys
   */
  function PartitionedMap(a, b, bKeys) {
    (0, _classCallCheck2["default"])(this, PartitionedMap);
    this.a = a;
    this.b = b;
    this.bKeys = bKeys;
    this[Symbol.iterator] = this.entries;
  }
  return (0, _createClass2["default"])(PartitionedMap, [{
    key: "get",
    value: function get(key) {
      return this.bKeys.has(key) ? this.b.get(key) : this.a.get(key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      if (this.bKeys.has(key)) {
        this.b.set(key, value);
      } else {
        this.a.set(key, value);
      }
      return this;
    }
  }, {
    key: "has",
    value: function has(key) {
      return this.b.has(key) || this.a.has(key);
    }
  }, {
    key: "keys",
    value: function keys() {
      return new Set([].concat((0, _toConsumableArray2["default"])(this.a.keys()), (0, _toConsumableArray2["default"])(this.b.keys())))[Symbol.iterator]();
    }
  }, {
    key: "entries",
    value: function entries() {
      var _this2 = this;
      return mapIterator(this.keys(), function (key) {
        return [key, _this2.get(key)];
      });
    }
  }, {
    key: "forEach",
    value: function forEach(callback) {
      var _iterator3 = _createForOfIteratorHelper(this.keys()),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var key = _step3.value;
          callback(this.get(key), key, this);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      return this.bKeys.has(key) ? this.b["delete"](key) : this.a["delete"](key);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.a.clear();
      this.b.clear();
    }
  }, {
    key: "size",
    get: function get() {
      return (0, _toConsumableArray2["default"])(this.keys()).length;
    }
  }]);
}();
/**
 * Create a new iterator that maps over the provided iterator, applying a mapping function to each item
 */
function mapIterator(it, callback) {
  return {
    next: function next() {
      var n = it.next();
      return n.done ? n : {
        value: callback(n.value),
        done: false
      };
    }
  };
}

/**
 * Creates an empty map, or whatever your platform's polyfill is.
 *
 * @returns an empty Map or Map like object.
 */
function createEmptyMap() {
  return new Map();
}

/**
 * Creates a Map from the given object.
 *
 * @param { Map | { [key: string]: unknown } | undefined } mapOrObject
 * @returns
 */
function createMap(mapOrObject) {
  if (!mapOrObject) {
    return createEmptyMap();
  }
  if (isMap(mapOrObject)) {
    return mapOrObject;
  }
  if ((0, _is.isObject)(mapOrObject)) {
    return new ObjectWrappingMap(mapOrObject);
  }
  throw new Error('createMap can create maps from objects or Maps');
}

/**
 * Unwraps a map into an object.
 *
 * @param {Map} map
 * @returns { [key: string]: unknown }
 */
function toObject(map) {
  if (map instanceof ObjectWrappingMap) {
    return map.wrappedObject;
  }
  var object = {};
  var _iterator4 = _createForOfIteratorHelper(map.keys()),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var key = _step4.value;
      var value = map.get(key);
      (0, _customs.setSafeProperty)(object, key, value);
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return object;
}

/**
 * Returns `true` if the passed object appears to be a Map (i.e. duck typing).
 *
 * Methods looked for are `get`, `set`, `keys` and `has`.
 *
 * @param {Map | object} object
 * @returns
 */
function isMap(object) {
  // We can use the fast instanceof, or a slower duck typing check.
  // The duck typing method needs to cover enough methods to not be confused with DenseMatrix.
  if (!object) {
    return false;
  }
  return object instanceof Map || object instanceof ObjectWrappingMap || typeof object.set === 'function' && typeof object.get === 'function' && typeof object.keys === 'function' && typeof object.has === 'function';
}

/**
 * Copies the contents of key-value pairs from each `objects` in to `map`.
 *
 * Object is `objects` can be a `Map` or object.
 *
 * This is the `Map` analog to `Object.assign`.
 */
function assign(map) {
  for (var _len = arguments.length, objects = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    objects[_key - 1] = arguments[_key];
  }
  for (var _i = 0, _objects = objects; _i < _objects.length; _i++) {
    var args = _objects[_i];
    if (!args) {
      continue;
    }
    if (isMap(args)) {
      var _iterator5 = _createForOfIteratorHelper(args.keys()),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var key = _step5.value;
          map.set(key, args.get(key));
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    } else if ((0, _is.isObject)(args)) {
      for (var _i2 = 0, _Object$keys = Object.keys(args); _i2 < _Object$keys.length; _i2++) {
        var _key2 = _Object$keys[_i2];
        map.set(_key2, args[_key2]);
      }
    }
  }
  return map;
}