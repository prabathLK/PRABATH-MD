"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileInlineExpression = compileInlineExpression;
var _is = require("../../../utils/is.js");
var _map = require("../../../utils/map.js");
/**
 * Compile an inline expression like "x > 0"
 * @param {Node} expression
 * @param {Object} math
 * @param {Map} scope
 * @return {function} Returns a function with one argument which fills in the
 *                    undefined variable (like "x") and evaluates the expression
 */
function compileInlineExpression(expression, math, scope) {
  // find an undefined symbol
  var symbol = expression.filter(function (node) {
    return (0, _is.isSymbolNode)(node) && !(node.name in math) && !scope.has(node.name);
  })[0];
  if (!symbol) {
    throw new Error('No undefined variable found in inline expression "' + expression + '"');
  }

  // create a test function for this equation
  var name = symbol.name; // variable name
  var argsScope = new Map();
  var subScope = new _map.PartitionedMap(scope, argsScope, new Set([name]));
  var eq = expression.compile();
  return function inlineExpression(x) {
    argsScope.set(name, x);
    return eq.evaluate(subScope);
  };
}