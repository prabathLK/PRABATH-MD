"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tebakgambarjson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function tebakgambar() {
    if (!exports.tebakgambarjson) {
        exports.tebakgambarjson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json').json();
    }
    return index_js_1.TebakGambarSchema.parse(exports.tebakgambarjson[Math.floor(Math.random() * exports.tebakgambarjson.length)]);
}
exports.default = tebakgambar;
