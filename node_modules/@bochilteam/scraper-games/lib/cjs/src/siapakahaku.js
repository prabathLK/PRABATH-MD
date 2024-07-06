"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.siapakahakujson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function siapakahaku() {
    if (!exports.siapakahakujson) {
        exports.siapakahakujson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json').json();
    }
    return index_js_1.SiapakahAkuSchema.parse(exports.siapakahakujson[Math.floor(Math.random() * exports.siapakahakujson.length)]);
}
exports.default = siapakahaku;
