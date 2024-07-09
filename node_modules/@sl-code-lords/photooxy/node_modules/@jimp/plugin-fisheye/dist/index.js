"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = require("@jimp/utils");
/**
 * Creates a circle out of an image.
 * @param {object} options (optional) r: radius of effect
 * @param {function(Error, Jimp)} cb (optional) a callback for when complete
 * @returns {Jimp} this for chaining of methods
 */
var _default = () => ({
  fisheye() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      r: 2.5
    };
    let cb = arguments.length > 1 ? arguments[1] : undefined;
    if (typeof options === "function") {
      cb = options;
      options = {
        r: 2.5
      };
    }
    const source = this.cloneQuiet();
    const {
      width,
      height
    } = source.bitmap;
    source.scanQuiet(0, 0, width, height, (x, y) => {
      const hx = x / width;
      const hy = y / height;
      const r = Math.sqrt(Math.pow(hx - 0.5, 2) + Math.pow(hy - 0.5, 2));
      const rn = 2 * Math.pow(r, options.r);
      const cosA = (hx - 0.5) / r;
      const sinA = (hy - 0.5) / r;
      const newX = Math.round((rn * cosA + 0.5) * width);
      const newY = Math.round((rn * sinA + 0.5) * height);
      const color = source.getPixelColor(newX, newY);
      this.setPixelColor(color, x, y);
    });

    /* Set center pixel color, otherwise it will be transparent */
    this.setPixelColor(source.getPixelColor(width / 2, height / 2), width / 2, height / 2);
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