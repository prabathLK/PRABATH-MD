"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.susunkatajson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function susunkata() {
    if (!exports.susunkatajson) {
        exports.susunkatajson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json').json();
    }
    return index_js_1.SusunKataSchema.parse(exports.susunkatajson[Math.floor(Math.random() * exports.susunkatajson.length)]);
}
exports.default = susunkata;
