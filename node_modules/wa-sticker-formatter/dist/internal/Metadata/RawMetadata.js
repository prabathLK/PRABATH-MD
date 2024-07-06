"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = __importDefault(require("../../Utils"));
class RawMetadata {
    constructor(options) {
        this['sticker-pack-id'] = options.id || Utils_1.default.generateStickerID();
        this['sticker-pack-name'] = options.pack || '';
        this['sticker-pack-publisher'] = options.author || '';
        this.emojis = options.categories || [];
    }
}
exports.default = RawMetadata;
