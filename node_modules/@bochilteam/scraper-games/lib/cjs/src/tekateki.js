"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tekatekijson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function tekateki() {
    if (!exports.tekatekijson) {
        exports.tekatekijson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/games/tekateki.json').json();
    }
    return index_js_1.TekaTekiSchema.parse(exports.tekatekijson[Math.floor(Math.random() * exports.tekatekijson.length)]);
}
exports.default = tekateki;
