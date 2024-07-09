"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrTransform = void 0;
var _or = require("../../function/logical/or.js");
var _factory = require("../../utils/factory.js");
var _is = require("../../utils/is.js");
var name = 'or';
var dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix', 'concat'];
var createOrTransform = exports.createOrTransform = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
    matrix = _ref.matrix,
    equalScalar = _ref.equalScalar,
    DenseMatrix = _ref.DenseMatrix,
    concat = _ref.concat;
  var or = (0, _or.createOr)({
    typed: typed,
    matrix: matrix,
    equalScalar: equalScalar,
    DenseMatrix: DenseMatrix,
    concat: concat
  });
  function orTransform(args, math, scope) {
    var condition1 = args[0].compile().evaluate(scope);
    if (!(0, _is.isCollection)(condition1) && or(condition1, false)) {
      return true;
    }
    var condition2 = args[1].compile().evaluate(scope);
    return or(condition1, condition2);
  }
  orTransform.rawArgs = true;
  return orTransform;
}, {
  isTransformFunction: true
});