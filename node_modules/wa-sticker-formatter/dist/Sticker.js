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
exports.createSticker = exports.Sticker = void 0;
const fs_extra_1 = require("fs-extra");
const axios_1 = __importDefault(require("axios"));
const Utils_1 = __importStar(require("./Utils"));
const file_type_1 = require("file-type");
const convert_1 = __importDefault(require("./internal/convert"));
const Exif_1 = __importDefault(require("./internal/Metadata/Exif"));
const StickerTypes_1 = require("./internal/Metadata/StickerTypes");
const _1 = require(".");
/**
 * Sticker class
 */
class Sticker {
    /**
     * Sticker Constructor
     * @param {string|Buffer} [data] - File path, url or Buffer of the image/video to be converted
     * @param {IStickerOptions} [options] - Sticker options
     */
    constructor(data, metadata = {}) {
        var _a, _b, _c, _d, _e;
        this.data = data;
        this.metadata = metadata;
        this._parse = () => __awaiter(this, void 0, void 0, function* () {
            return Buffer.isBuffer(this.data)
                ? this.data
                : this.data.trim().startsWith('<svg')
                    ? Buffer.from(this.data)
                    : (() => __awaiter(this, void 0, void 0, function* () {
                        return (0, fs_extra_1.existsSync)(this.data)
                            ? (0, fs_extra_1.readFile)(this.data)
                            : axios_1.default.get(this.data, { responseType: 'arraybuffer' }).then(({ data }) => data);
                    }))();
        });
        this._getMimeType = (data) => __awaiter(this, void 0, void 0, function* () {
            const type = yield (0, file_type_1.fromBuffer)(data);
            if (!type) {
                if (typeof this.data === 'string')
                    return 'image/svg+xml';
                throw new Error('Invalid file type');
            }
            return type.mime;
        });
        /**
         * Builds the sticker
         * @returns {Promise<Buffer>} A promise that resolves to the sticker buffer
         * @example
         * const sticker = new Sticker('./image.png')
         * const buffer = sticker.build()
         */
        this.build = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield this._parse();
            const mime = yield this._getMimeType(data);
            return new Exif_1.default(this.metadata).add(yield (0, convert_1.default)(data, mime, this.metadata));
        });
        /**
         * Alias for `.build()`
         * @param {string} [type] - How you want your sticker to look like
         * @returns {Promise<Buffer>} A promise that resolves to the sticker buffer
         * @example
         * const sticker = new Sticker('./image.png')
         * const buffer = sticker.build()
         */
        this.toBuffer = this.build;
        /**
         * Saves the sticker to a file
         * @param [filename] - Filename to save the sticker to
         * @returns filename
         * @example
         * const sticker = new Sticker('./image.png')
         * sticker.toFile('./image.webp')
         */
        this.toFile = (filename = this.defaultFilename) => __awaiter(this, void 0, void 0, function* () {
            yield (0, fs_extra_1.writeFile)(filename, yield this.build());
            return filename;
        });
        /**
         * Set the sticker pack title
         * @param pack - Sticker Pack Title
         * @returns {this}
         * @example
         * const sticker = new Sticker('./image.png')
         * sticker.setPack('My Sticker Pack')
         * sticker.build()
         */
        this.setPack = (pack) => {
            this.metadata.pack = pack;
            return this;
        };
        /**
         * Set the sticker pack author
         * @param author - Sticker Pack Author
         * @returns
         */
        this.setAuthor = (author) => {
            this.metadata.author = author;
            return this;
        };
        /**
         * Set the sticker pack ID
         * @param id - Sticker Pack ID
         * @returns {this}
         * @example
         * const sticker = new Sticker('./image.png')
         * sticker.setID('my-sticker-pack')
         * sticker.build()
         */
        this.setID = (id) => {
            this.metadata.id = id;
            return this;
        };
        /**
         * Set the sticker category
         * @param categories - Sticker Category
         * @returns {this}
         * @example
         * const sticker = new Sticker('./image.png')
         * sticker.setCategories(['🌹'])
         */
        this.setCategories = (categories) => {
            this.metadata.categories = categories;
            return this;
        };
        /**
         * Set the sticker type
         * @param {StickerTypes|string}[type] - Sticker Type
         * @returns {this}
         */
        this.setType = (type) => {
            this.metadata.type = type;
            return this;
        };
        /**
         * Set the sticker quality
         * @param {number}[quality] - Sticker Quality
         * @returns {this}
         */
        this.setQuality = (quality) => {
            this.metadata.quality = quality;
            return this;
        };
        /**
         * Set the background color for `full` images
         * @param {Color}[background] - Background color
         * @returns {this}
         */
        this.setBackground = (background) => {
            this.metadata.background = background;
            return this;
        };
        /**
         * @deprecated
         * Use the `Sticker.build()` method instead
         */
        this.get = this.build;
        /**
         * Get BaileysMD-compatible message object
         * @returns {{ sticker: Buffer }}
         * @example
         * import { create } from '@adiwajshing/baileys-md'
         * const conn = create()
         * ...
         * const sticker = new Sticker('./image.png', { pack: 'My Sticker Pack', author: 'Me' })
         * const message = await sticker.toMessage()
         * conn.sendMessage(jid, message)
         */
        this.toMessage = () => __awaiter(this, void 0, void 0, function* () { return ({ sticker: yield this.build() }); });
        this.metadata.author = (_a = this.metadata.author) !== null && _a !== void 0 ? _a : '';
        this.metadata.pack = (_b = this.metadata.pack) !== null && _b !== void 0 ? _b : '';
        this.metadata.id = (_c = this.metadata.id) !== null && _c !== void 0 ? _c : Utils_1.default.generateStickerID();
        this.metadata.quality = (_d = this.metadata.quality) !== null && _d !== void 0 ? _d : 100;
        this.metadata.type = Object.values(StickerTypes_1.StickerTypes).includes(this.metadata.type)
            ? this.metadata.type
            : StickerTypes_1.StickerTypes.DEFAULT;
        this.metadata.background = (_e = this.metadata.background) !== null && _e !== void 0 ? _e : Utils_1.defaultBg;
    }
    get defaultFilename() {
        return `./${this.metadata.pack}-${this.metadata.author}.webp`;
    }
}
exports.Sticker = Sticker;
/**
 * Extracts metadata from a WebP image.
 * @param {Buffer}image - The image buffer to extract metadata from
 */
Sticker.extractMetadata = _1.extractMetadata;
/**
 *
 * @param {string|Buffer} data - File path, url or Buffer of the image/video to be converted
 * @param {IStickerOptions} [options] - Sticker options
 * @returns {Promise<Buffer>} A promise that resolves to the sticker buffer
 */
const createSticker = (...args) => __awaiter(void 0, void 0, void 0, function* () {
    return new Sticker(...args).build();
});
exports.createSticker = createSticker;
