"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("isomorphic-fetch");
var _default = (_ref, cb) => {
  let {
    url,
    ...options
  } = _ref;
  fetch(url, options).then(response => {
    if (response.ok) {
      return response.arrayBuffer().catch(error => {
        throw new Error(`Response is not a buffer for url ${url}. Error: ${error.message}`);
      });
    }
    throw new Error(`HTTP Status ${response.status} for url ${url}`);
  }).then(data => cb(null, data)).catch(error => cb(error));
};
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
//# sourceMappingURL=request.js.map