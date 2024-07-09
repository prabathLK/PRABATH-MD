"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = require("@jimp/utils");
/**
 * Displaces the image based on the provided displacement map
 * @param {object} map the source Jimp instance
 * @param {number} offset the maximum displacement value
 * @param {function(Error, Jimp)} cb (optional) a callback for when complete
 * @returns {Jimp} this for chaining of methods
 */
var _default = () => ({
  displace(map, offset, cb) {
    if (typeof map !== "object" || map.constructor !== this.constructor) {
      return _utils.throwError.call(this, "The source must be a Jimp image", cb);
    }
    if (typeof offset !== "number") {
      return _utils.throwError.call(this, "factor must be a number", cb);
    }
    const source = this.cloneQuiet();
    this.scanQuiet(0, 0, this.bitmap.width, this.bitmap.height, function (x, y, idx) {
      let displacement = map.bitmap.data[idx] / 256 * offset;
      displacement = Math.round(displacement);
      const ids = this.getPixelIndex(x + displacement, y);
      this.bitmap.data[ids] = source.bitmap.data[idx];
      this.bitmap.data[ids + 1] = source.bitmap.data[idx + 1];
      this.bitmap.data[ids + 2] = source.bitmap.data[idx + 2];
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