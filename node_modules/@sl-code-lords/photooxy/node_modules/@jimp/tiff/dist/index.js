"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utif = _interopRequireDefault(require("utif2"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MIME_TYPE = "image/tiff";
var _default = () => ({
  mime: {
    [MIME_TYPE]: ["tiff", "tif"]
  },
  constants: {
    MIME_TIFF: MIME_TYPE
  },
  decoders: {
    [MIME_TYPE]: data => {
      const ifds = _utif.default.decode(data);
      const page = ifds[0];
      ifds.forEach(ifd => {
        _utif.default.decodeImage(data, ifd);
      });
      const rgba = _utif.default.toRGBA8(page);
      return {
        data: Buffer.from(rgba),
        width: page.t256[0],
        height: page.t257[0]
      };
    }
  },
  encoders: {
    [MIME_TYPE]: image => {
      const tiff = _utif.default.encodeImage(image.bitmap.data, image.bitmap.width, image.bitmap.height);
      return Buffer.from(tiff);
    }
  }
});
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
//# sourceMappingURL=index.js.map