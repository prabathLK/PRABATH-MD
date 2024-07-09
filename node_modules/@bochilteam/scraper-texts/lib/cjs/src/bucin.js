"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucinjson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
exports.bucinjson = [];
async function bucin() {
    if (!exports.bucinjson.length) {
        exports.bucinjson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/kata-kata/bucin.json').json();
    }
    return index_js_1.BucinSchema.parse(exports.bucinjson[Math.floor(exports.bucinjson.length * Math.random())]);
}
exports.default = bucin;
