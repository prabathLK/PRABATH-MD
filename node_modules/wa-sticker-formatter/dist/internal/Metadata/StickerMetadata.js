"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = __importDefault(require("../../Utils"));
class StickerMetadata {
    constructor(pack = '', author = '', categories = [], id = Utils_1.default.generateStickerID()) {
        this.pack = pack;
        this.author = author;
        this.categories = categories;
        this.id = id;
        this.crop = false;
        this.full = false;
        this.setPack = (title) => {
            this.pack = title;
            return this;
        };
        this.setAuthor = (author) => {
            this.author = author;
            return this;
        };
        this.setId = (id) => {
            this.id = id;
            return this;
        };
        this.setCrop = (value) => {
            this.crop = value;
            this.full = !value;
            return this;
        };
        this.setFull = (value) => {
            this.crop = !value;
            this.full = value;
            return this;
        };
        this.setCategories = (categories) => {
            this.categories = (typeof categories === 'string' ? categories.split(',').map((emoji) => emoji.trim()) : categories);
            return this;
        };
        this.toJSON = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const obj = {};
            Object.keys(this)
                .filter((key) => typeof this[key] !== 'function')
                .forEach((key) => (obj[key] = this[key]));
            return obj;
        };
    }
}
exports.default = StickerMetadata;
StickerMetadata.from = (object) => {
    return new StickerMetadata(object.pack, object.author, object.categories, object.id);
};
