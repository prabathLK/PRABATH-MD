"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.truthjson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
exports.truthjson = [];
async function truth() {
    if (!exports.truthjson.length) {
        exports.truthjson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/kata-kata/truth.json').json();
    }
    return index_js_1.TruthSchema.parse(exports.truthjson[Math.floor(exports.truthjson.length * Math.random())]);
}
exports.default = truth;
