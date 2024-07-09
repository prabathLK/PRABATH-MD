"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBitAndTransform = void 0;
var _bitAnd = require("../../function/bitwise/bitAnd.js");
var _factory = require("../../utils/factory.js");
var _is = require("../../utils/is.js");
var name = 'bitAnd';
var dependencies = ['typed', 'matrix', 'zeros', 'add', 'equalScalar', 'not', 'concat'];
var createBitAndTransform = exports.createBitAndTransform = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
    matrix = _ref.matrix,
    equalScalar = _ref.equalScalar,
    zeros = _ref.zeros,
    not = _ref.not,
    concat = _ref.concat;
  var bitAnd = (0, _bitAnd.createBitAnd)({
    typed: typed,
    matrix: matrix,
    equalScalar: equalScalar,
    zeros: zeros,
    not: not,
    concat: concat
  });
  function bitAndTransform(args, math, scope) {
    var condition1 = args[0].compile().evaluate(scope);
    if (!(0, _is.isCollection)(condition1)) {
      if (isNaN(condition1)) {
        return NaN;
      }
      if (condition1 === 0 || condition1 === false) {
        return 0;
      }
    }
    var condition2 = args[1].compile().evaluate(scope);
    return bitAnd(condition1, condition2);
  }
  bitAndTransform.rawArgs = true;
  return bitAndTransform;
}, {
  isTransformFunction: true
});