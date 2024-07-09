"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = composite;
var _utils = require("@jimp/utils");
var constants = _interopRequireWildcard(require("../constants"));
var compositeModes = _interopRequireWildcard(require("./composite-modes"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * Composites a source image over to this image respecting alpha channels
 * @param {Jimp} src the source Jimp instance
 * @param {number} x the x position to blit the image
 * @param {number} y the y position to blit the image
 * @param {object} options determine what mode to use
 * @param {function(Error, Jimp)} cb (optional) a callback for when complete
 * @returns {Jimp} this for chaining of methods
 */
function composite(src, x, y) {
  let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  let cb = arguments.length > 4 ? arguments[4] : undefined;
  if (typeof options === "function") {
    cb = options;
    options = {};
  }
  if (!(src instanceof this.constructor)) {
    return _utils.throwError.call(this, "The source must be a Jimp image", cb);
  }
  if (typeof x !== "number" || typeof y !== "number") {
    return _utils.throwError.call(this, "x and y must be numbers", cb);
  }
  let {
    mode,
    opacitySource,
    opacityDest
  } = options;
  if (!mode) {
    mode = constants.BLEND_SOURCE_OVER;
  }
  if (typeof opacitySource !== "number" || opacitySource < 0 || opacitySource > 1) {
    opacitySource = 1.0;
  }
  if (typeof opacityDest !== "number" || opacityDest < 0 || opacityDest > 1) {
    opacityDest = 1.0;
  }

  // eslint-disable-next-line import/namespace
  const blendmode = compositeModes[mode];

  // round input
  x = Math.round(x);
  y = Math.round(y);
  const baseImage = this;
  if (opacityDest !== 1.0) {
    baseImage.opacity(opacityDest);
  }
  src.scanQuiet(0, 0, src.bitmap.width, src.bitmap.height, function (sx, sy, idx) {
    const dstIdx = baseImage.getPixelIndex(x + sx, y + sy, constants.EDGE_CROP);
    if (dstIdx === -1) {
      // Skip target pixels outside of dst
      return;
    }
    const blended = blendmode({
      r: this.bitmap.data[idx + 0] / 255,
      g: this.bitmap.data[idx + 1] / 255,
      b: this.bitmap.data[idx + 2] / 255,
      a: this.bitmap.data[idx + 3] / 255
    }, {
      r: baseImage.bitmap.data[dstIdx + 0] / 255,
      g: baseImage.bitmap.data[dstIdx + 1] / 255,
      b: baseImage.bitmap.data[dstIdx + 2] / 255,
      a: baseImage.bitmap.data[dstIdx + 3] / 255
    }, opacitySource);
    baseImage.bitmap.data[dstIdx + 0] = this.constructor.limit255(blended.r * 255);
    baseImage.bitmap.data[dstIdx + 1] = this.constructor.limit255(blended.g * 255);
    baseImage.bitmap.data[dstIdx + 2] = this.constructor.limit255(blended.b * 255);
    baseImage.bitmap.data[dstIdx + 3] = this.constructor.limit255(blended.a * 255);
  });
  if ((0, _utils.isNodePattern)(cb)) {
    cb.call(this, null, this);
  }
  return this;
}
module.exports = exports.default;
module.exports.default = exports.default;
//# sourceMappingURL=index.js.map