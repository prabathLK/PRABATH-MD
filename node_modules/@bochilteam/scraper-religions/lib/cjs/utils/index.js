"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.didyoumean = void 0;
const similarity_1 = __importDefault(require("similarity"));
const index_js_1 = require("../types/index.js");
function didyoumean(query, list, opts = { threshold: 0.7 }) {
    index_js_1.DidYouMeanArgsSchema.parse(arguments);
    const results = [];
    for (const index in list) {
        const item = list[index];
        const score = (0, similarity_1.default)(query, item);
        if ((0, similarity_1.default)(query, item, opts.opts) >= opts.threshold) {
            results.push({ index: parseInt(index), query: item, score });
        }
    }
    const sortByHigest = results.sort((a, b) => b.score - a.score);
    return sortByHigest.map(item => index_js_1.DidYouMeanSchema.parse(item));
}
exports.didyoumean = didyoumean;
