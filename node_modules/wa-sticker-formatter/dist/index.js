"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exif = exports.StickerMetadata = void 0;
const Sticker_1 = require("./Sticker");
__exportStar(require("./Sticker"), exports);
__exportStar(require("./extractMetadata"), exports);
__exportStar(require("./Types"), exports);
var StickerMetadata_1 = require("./internal/Metadata/StickerMetadata");
Object.defineProperty(exports, "StickerMetadata", { enumerable: true, get: function () { return __importDefault(StickerMetadata_1).default; } });
var Exif_1 = require("./internal/Metadata/Exif");
Object.defineProperty(exports, "Exif", { enumerable: true, get: function () { return __importDefault(Exif_1).default; } });
__exportStar(require("./internal/Metadata/StickerTypes"), exports);
exports.default = Sticker_1.Sticker;
