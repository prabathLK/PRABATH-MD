"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tebakkabupatenjson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function tebakkabupaten() {
    if (!exports.tebakkabupatenjson) {
        exports.tebakkabupatenjson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkabupaten.json').json();
    }
    return index_js_1.TebakKabupatenSchema.parse(exports.tebakkabupatenjson[Math.floor(Math.random() * exports.tebakkabupatenjson.length)]);
}
exports.default = tebakkabupaten;
