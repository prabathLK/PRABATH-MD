"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tebakbenderajson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function tebakbendera() {
    if (!exports.tebakbenderajson) {
        exports.tebakbenderajson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakbendera.json').json();
    }
    return index_js_1.TebakBenderaSchema.parse(exports.tebakbenderajson[Math.floor(Math.random() * exports.tebakbenderajson.length)]);
}
exports.default = tebakbendera;
