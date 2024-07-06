import { createBitAnd } from '../../function/bitwise/bitAnd.js';
import { factory } from '../../utils/factory.js';
import { isCollection } from '../../utils/is.js';
var name = 'bitAnd';
var dependencies = ['typed', 'matrix', 'zeros', 'add', 'equalScalar', 'not', 'concat'];
export var createBitAndTransform = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed,
    matrix,
    equalScalar,
    zeros,
    not,
    concat
  } = _ref;
  var bitAnd = createBitAnd({
    typed,
    matrix,
    equalScalar,
    zeros,
    not,
    concat
  });
  function bitAndTransform(args, math, scope) {
    var condition1 = args[0].compile().evaluate(scope);
    if (!isCollection(condition1)) {
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