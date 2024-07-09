"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.caklontongjson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function caklontong() {
    if (!exports.caklontongjson) {
        exports.caklontongjson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/games/caklontong.json').json();
    }
    return index_js_1.CakLontongSchema.parse(exports.caklontongjson[Math.floor(Math.random() * exports.caklontongjson.length)]);
}
exports.default = caklontong;
