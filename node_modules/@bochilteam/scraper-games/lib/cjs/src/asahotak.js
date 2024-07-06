"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asahotakjson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function asahotak() {
    if (!exports.asahotakjson) {
        exports.asahotakjson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/games/asahotak.json').json();
    }
    return index_js_1.AsahOtakSchema.parse(exports.asahotakjson[Math.floor(Math.random() * exports.asahotakjson.length)]);
}
exports.default = asahotak;
