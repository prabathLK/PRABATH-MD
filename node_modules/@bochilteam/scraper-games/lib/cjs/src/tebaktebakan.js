"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tebaktebakanjson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function tebaktebakan() {
    if (!exports.tebaktebakanjson) {
        exports.tebaktebakanjson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaktebakan.json').json();
    }
    return index_js_1.TebakTebakanSchema.parse(exports.tebaktebakanjson[Math.floor(Math.random() * exports.tebaktebakanjson.length)]);
}
exports.default = tebaktebakan;
