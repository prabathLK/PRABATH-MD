"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.family100json = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function family100() {
    if (!exports.family100json) {
        exports.family100json = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json').json();
    }
    return index_js_1.Family100Schema.parse(exports.family100json[Math.floor(Math.random() * exports.family100json.length)]);
}
exports.default = family100;
