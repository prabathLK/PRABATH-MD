"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _omggif = _interopRequireDefault(require("omggif"));
var _gifwrap = require("gifwrap");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MIME_TYPE = "image/gif";
var _default = () => ({
  mime: {
    [MIME_TYPE]: ["gif"]
  },
  constants: {
    MIME_GIF: MIME_TYPE
  },
  decoders: {
    [MIME_TYPE]: data => {
      const gifObj = new _omggif.default.GifReader(data);
      const gifData = Buffer.alloc(gifObj.width * gifObj.height * 4);
      gifObj.decodeAndBlitFrameRGBA(0, gifData);
      return {
        data: gifData,
        width: gifObj.width,
        height: gifObj.height
      };
    }
  },
  encoders: {
    [MIME_TYPE]: data => {
      const bitmap = new _gifwrap.BitmapImage(data.bitmap);
      _gifwrap.GifUtil.quantizeDekker(bitmap, 256);
      const newFrame = new _gifwrap.GifFrame(bitmap);
      const gifCodec = new _gifwrap.GifCodec();
      return gifCodec.encodeGif([newFrame], {}).then(newGif => {
        return newGif.buffer;
      });
    }
  }
});
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
//# sourceMappingURL=index.js.map