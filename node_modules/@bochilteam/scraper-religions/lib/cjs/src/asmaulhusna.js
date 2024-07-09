"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asmaulhusnajson = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
/**
 * index is the index of the asmaul husna in the list, starting from 1.
 * if the index is not found, it will throw error.
 * if the index is not provided, it will return random index asmaul husna.
 */
async function asmaulhusna(index) {
    index_js_1.AsmaulHusnaArgsSchema.parse(arguments);
    if (!exports.asmaulhusnajson) {
        exports.asmaulhusnajson = await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/database/master/religi/asmaulhusna.json').json();
    }
    if (!index)
        index = Math.floor(Math.random() * exports.asmaulhusnajson.length);
    const asmaulhusna = exports.asmaulhusnajson[index];
    if (!asmaulhusna) {
        throw new Error(`Asmaul Husna with index ${index} not found`);
    }
    return index_js_1.AsmaulHusnaSchema.parse(asmaulhusna);
}
exports.default = asmaulhusna;
