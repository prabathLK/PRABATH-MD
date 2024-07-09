"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.darejson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
exports.darejson = [];
async function dare() {
    if (!exports.darejson.length) {
        exports.darejson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/kata-kata/dare.json').json();
    }
    return index_js_1.DareSchema.parse(exports.darejson[Math.round(exports.darejson.length * Math.random())]);
}
exports.default = dare;
