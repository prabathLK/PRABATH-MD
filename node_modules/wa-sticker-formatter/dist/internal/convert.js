"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importStar(require("sharp"));
const videoToGif_1 = __importDefault(require("./videoToGif"));
const fs_extra_1 = require("fs-extra");
const os_1 = require("os");
const crop_1 = __importDefault(require("./crop"));
const StickerTypes_1 = require("./Metadata/StickerTypes");
const Utils_1 = require("../Utils");
const convert = (data, mime, { quality = 100, background = Utils_1.defaultBg, type = StickerTypes_1.StickerTypes.DEFAULT }) => __awaiter(void 0, void 0, void 0, function* () {
    const isVideo = mime.startsWith('video');
    let image = isVideo ? yield (0, videoToGif_1.default)(data) : data;
    const isAnimated = isVideo || mime.includes('gif') || mime.includes('webp');
    if (isAnimated && ['crop', 'circle', 'rouded'].includes(type)) {
        const filename = `${(0, os_1.tmpdir)()}/${Math.random().toString(36)}.webp`;
        yield (0, fs_extra_1.writeFile)(filename, image);
        [image, type] = [
            yield (0, crop_1.default)(filename),
            type === StickerTypes_1.StickerTypes.CIRCLE
                ? StickerTypes_1.StickerTypes.CIRCLE
                : type === StickerTypes_1.StickerTypes.ROUNDED
                    ? StickerTypes_1.StickerTypes.ROUNDED
                    : StickerTypes_1.StickerTypes.DEFAULT
        ];
    }
    const img = (0, sharp_1.default)(image, { animated: isAnimated }).toFormat('webp');
    switch (type) {
        case StickerTypes_1.StickerTypes.CROPPED:
            img.resize(512, 512, {
                fit: sharp_1.fit.cover
            });
            break;
        case StickerTypes_1.StickerTypes.FULL:
            img.resize(512, 512, {
                fit: sharp_1.fit.contain,
                background
            });
            break;
        case StickerTypes_1.StickerTypes.CIRCLE:
            img.resize(512, 512, {
                fit: sharp_1.fit.cover
            }).composite([
                {
                    input: Buffer.from(`<svg width="512" height="512"><circle cx="256" cy="256" r="256" fill="${background}"/></svg>`),
                    blend: 'dest-in',
                    gravity: 'northeast',
                    tile: true
                }
            ]);
            break;
        case StickerTypes_1.StickerTypes.ROUNDED:
            img.resize(512, 512, {
                fit: sharp_1.fit.cover
            }).composite([
                {
                    input: Buffer.from(`<svg width="512" height="512"><rect rx="50" ry="50" width="512" height="512" fill="${background}"/></svg>`),
                    blend: 'dest-in',
                    gravity: 'northeast',
                    tile: true
                }
            ]);
            break;
    }
    return yield img
        .webp({
        quality,
        lossless: false
    })
        .toBuffer();
});
exports.default = convert;
