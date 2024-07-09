"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = require("@jimp/utils");
/**
 * Applies a minimum color threshold to a greyscale image.  Converts image to greyscale by default
 * @param {number} options object
 *  max: A number auto limited between 0 - 255
 *  replace: (optional) A number auto limited between 0 - 255 (default 255)
 *  autoGreyscale: (optional) A boolean whether to apply greyscale beforehand (default true)
 * @param {number} cb (optional) a callback for when complete
 * @return {this} this for chaining of methods
 */
var _default = () => ({
  threshold(_ref, cb) {
    let {
      max,
      replace = 255,
      autoGreyscale = true
    } = _ref;
    if (typeof max !== "number") {
      return _utils.throwError.call(this, "max must be a number", cb);
    }
    if (typeof replace !== "number") {
      return _utils.throwError.call(this, "replace must be a number", cb);
    }
    if (typeof autoGreyscale !== "boolean") {
      return _utils.throwError.call(this, "autoGreyscale must be a boolean", cb);
    }
    max = this.constructor.limit255(max);
    replace = this.constructor.limit255(replace);
    if (autoGreyscale) {
      this.greyscale();
    }
    this.scanQuiet(0, 0, this.bitmap.width, this.bitmap.height, (x, y, idx) => {
      const grey = this.bitmap.data[idx] < max ? this.bitmap.data[idx] : replace;
      this.bitmap.data[idx] = grey;
      this.bitmap.data[idx + 1] = grey;
      this.bitmap.data[idx + 2] = grey;
    });
    if ((0, _utils.isNodePattern)(cb)) {
      cb.call(this, null, this);
    }
    return this;
  }
});
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
//# sourceMappingURL=index.js.map