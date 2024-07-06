"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBg = void 0;
const crypto_1 = require("crypto");
class Utils {
}
exports.default = Utils;
Utils.generateStickerID = () => (0, crypto_1.randomBytes)(32).toString('hex');
exports.defaultBg = {
    r: 0,
    g: 0,
    b: 0,
    alpha: 0
};
