"use strict";
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
const node_webpmux_1 = require("node-webpmux");
const util_1 = require("util");
const RawMetadata_1 = __importDefault(require("./RawMetadata"));
class Exif {
    constructor(options) {
        this.exif = null;
        this.build = () => {
            const data = JSON.stringify(this.data);
            const exif = Buffer.concat([
                Buffer.from([
                    0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x16, 0x00, 0x00, 0x00
                ]),
                Buffer.from(data, 'utf-8')
            ]);
            exif.writeUIntLE(new util_1.TextEncoder().encode(data).length, 14, 4);
            return exif;
        };
        this.add = (image) => __awaiter(this, void 0, void 0, function* () {
            const exif = this.exif || this.build();
            image =
                image instanceof node_webpmux_1.Image
                    ? image
                    : yield (() => __awaiter(this, void 0, void 0, function* () {
                        const img = new node_webpmux_1.Image();
                        yield img.load(image);
                        return img;
                    }))();
            image.exif = exif;
            return yield image.save(null);
        });
        this.data = new RawMetadata_1.default(options);
    }
}
exports.default = Exif;
