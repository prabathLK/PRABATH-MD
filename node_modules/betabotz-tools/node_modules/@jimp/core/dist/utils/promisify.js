"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const promisify = function (fun, ctx) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  return new Promise((resolve, reject) => {
    args.push((err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
    fun.bind(ctx)(...args);
  });
};
var _default = promisify;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
//# sourceMappingURL=promisify.js.map