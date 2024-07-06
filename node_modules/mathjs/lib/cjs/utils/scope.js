"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubScope = createSubScope;
var _map = require("./map.js");
/**
 * Create a new scope which can access the parent scope,
 * but does not affect it when written. This is suitable for variable definitions
 * within a block node, or function definition.
 *
 * If parent scope has a createSubScope method, it delegates to that. Otherwise,
 * creates an empty map, and copies the parent scope to it, adding in
 * the remaining `args`.
 *
 * @param {Map} parentScope
 * @param  {Object} args
 * @returns {PartitionedMap}
 */
function createSubScope(parentScope, args) {
  return new _map.PartitionedMap(parentScope, new _map.ObjectWrappingMap(args), new Set(Object.keys(args)));
}