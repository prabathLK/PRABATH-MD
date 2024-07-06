import { createAnd } from '../../function/logical/and.js';
import { factory } from '../../utils/factory.js';
import { isCollection } from '../../utils/is.js';
var name = 'and';
var dependencies = ['typed', 'matrix', 'zeros', 'add', 'equalScalar', 'not', 'concat'];
export var createAndTransform = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed,
    matrix,
    equalScalar,
    zeros,
    not,
    concat
  } = _ref;
  var and = createAnd({
    typed,
    matrix,
    equalScalar,
    zeros,
    not,
    concat
  });
  function andTransform(args, math, scope) {
    var condition1 = args[0].compile().evaluate(scope);
    if (!isCollection(condition1) && !and(condition1, true)) {
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