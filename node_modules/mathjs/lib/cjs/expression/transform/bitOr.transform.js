"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBitOrTransform = void 0;
var _bitOr = require("../../function/bitwise/bitOr.js");
var _factory = require("../../utils/factory.js");
var _is = require("../../utils/is.js");
var name = 'bitOr';
var dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix', 'concat'];
var createBitOrTransform = exports.createBitOrTransform = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
    matrix = _ref.matrix,
    equalScalar = _ref.equalScalar,
    DenseMatrix = _ref.DenseMatrix,
    concat = _ref.concat;
  var bitOr = (0, _bitOr.createBitOr)({
    typed: typed,
    matrix: matrix,
    equalScalar: equalScalar,
    DenseMatrix: DenseMatrix,
    concat: concat
  });
  function bitOrTransform(args, math, scope) {
    var condition1 = args[0].compile().evaluate(scope);
    if (!(0, _is.isCollection)(condition1)) {
      if (isNaN(condition1)) {
        return NaN;
      }
      if (condition1 === -1) {
        return -1;
      }
      if (condition1 === true) {
        return 1;
      }
    }
    var condition2 = args[1].compile().evaluate(scope);
    return bitOr(condition1, condition2);
  }
  bitOrTransform.rawArgs = true;
  return bitOrTransform;
}, {
  isTransformFunction: true
});