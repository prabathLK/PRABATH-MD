"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNodePattern = isNodePattern;
exports.scan = scan;
exports.scanIterator = scanIterator;
exports.throwError = throwError;
function isNodePattern(cb) {
  if (typeof cb === "undefined") {
    return false;
  }
  if (typeof cb !== "function") {
    throw new TypeError("Callback must be a function");
  }
  return true;
}
function throwError(error, cb) {
  if (typeof error === "string") {
    error = new Error(error);
  }
  if (typeof cb === "function") {
    return cb.call(this, error);
  }
  throw error;
}
function scan(image, x, y, w, h, f) {
  // round input
  x = Math.round(x);
  y = Math.round(y);
  w = Math.round(w);
  h = Math.round(h);
  for (let _y = y; _y < y + h; _y++) {
    for (let _x = x; _x < x + w; _x++) {
      const idx = image.bitmap.width * _y + _x << 2;
      f.call(image, _x, _y, idx);
    }
  }
  return image;
}
function* scanIterator(image, x, y, w, h) {
  // round input
  x = Math.round(x);
  y = Math.round(y);
  w = Math.round(w);
  h = Math.round(h);
  for (let _y = y; _y < y + h; _y++) {
    for (let _x = x; _x < x + w; _x++) {
      const idx = image.bitmap.width * _y + _x << 2;
      yield {
        x: _x,
        y: _y,
        idx,
        image
      };
    }
  }
}
//# sourceMappingURL=index.js.map