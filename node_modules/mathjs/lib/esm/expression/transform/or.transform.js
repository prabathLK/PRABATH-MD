import { createOr } from '../../function/logical/or.js';
import { factory } from '../../utils/factory.js';
import { isCollection } from '../../utils/is.js';
var name = 'or';
var dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix', 'concat'];
export var createOrTransform = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed,
    matrix,
    equalScalar,
    DenseMatrix,
    concat
  } = _ref;
  var or = createOr({
    typed,
    matrix,
    equalScalar,
    DenseMatrix,
    concat
  });
  function orTransform(args, math, scope) {
    var condition1 = args[0].compile().evaluate(scope);
    if (!isCollection(condition1) && or(condition1, false)) {
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