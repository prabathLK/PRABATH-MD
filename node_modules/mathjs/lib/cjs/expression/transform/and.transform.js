"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAndTransform = void 0;
var _and = require("../../function/logical/and.js");
var _factory = require("../../utils/factory.js");
var _is = require("../../utils/is.js");
var name = 'and';
var dependencies = ['typed', 'matrix', 'zeros', 'add', 'equalScalar', 'not', 'concat'];
var createAndTransform = exports.createAndTransform = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
    matrix = _ref.matrix,
    equalScalar = _ref.equalScalar,
    zeros = _ref.zeros,
    not = _ref.not,
    concat = _ref.concat;
  var and = (0, _and.createAnd)({
    typed: typed,
    matrix: matrix,
    equalScalar: equalScalar,
    zeros: zeros,
    not: not,
    concat: concat
  });
  function andTransform(args, math, scope) {
    var condition1 = args[0].compile().evaluate(scope);
    if (!(0, _is.isCollection)(condition1) && !and(condition1, true)) {
      return false;
    }
    var condition2 = args[1].compile().evaluate(scope);
    return and(condition1, condition2);
  }
  andTransform.rawArgs = true;
  return andTransform;
}, {
  isTransformFunction: true
});