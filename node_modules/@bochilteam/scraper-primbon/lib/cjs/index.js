"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZodiac = exports.nomorhoki = exports.artimimpi = exports.artinama = void 0;
const artimimpi_js_1 = __importDefault(require("./src/artimimpi.js"));
exports.artimimpi = artimimpi_js_1.default;
const artinama_js_1 = __importDefault(require("./src/artinama.js"));
exports.artinama = artinama_js_1.default;
const nomorhoki_js_1 = __importDefault(require("./src/nomorhoki.js"));
exports.nomorhoki = nomorhoki_js_1.default;
const zodiac_js_1 = __importDefault(require("./src/zodiac.js"));
exports.getZodiac = zodiac_js_1.default;
