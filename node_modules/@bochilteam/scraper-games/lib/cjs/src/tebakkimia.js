"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tebakkimiajson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function tebakkimia() {
    if (!exports.tebakkimiajson) {
        exports.tebakkimiajson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkimia.json').json();
    }
    return index_js_1.TebakKimiaSchema.parse(exports.tebakkimiajson[Math.floor(Math.random() * exports.tebakkimiajson.length)]);
}
exports.default = tebakkimia;
