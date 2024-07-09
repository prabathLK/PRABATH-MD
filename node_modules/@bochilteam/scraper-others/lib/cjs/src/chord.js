"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chord = void 0;
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../types/index.js");
async function chord(query) {
    index_js_1.ChordArgsSchema.parse(arguments);
    const search = await (0, got_1.default)(`https://www.gitagram.com/?s=${encodeURIComponent(query).replace(/%20/g, '+')}`);
    const $ = cheerio_1.default.load(search.body);
    const $url = $('table.table > tbody > tr').eq(0).find('td').eq(0).find('a').eq(0);
    const url = $url.attr('href');
    if (!url) {
        throw new Error(`No results for ${query}\n\n${search.body}`);
    }
    const song = await (0, got_1.default)(url);
    const $song = cheerio_1.default.load(song.body);
    const $hcontent = $song('div.hcontent');
    const artist = $hcontent.find('div > a > span.subtitle').text().trim();
    const artistUrl = $hcontent.find('div > a').attr('href');
    const title = $hcontent.find('h1.title').text().trim();
    const chord = $song('div.content > pre').text().trim();
    const res = {
        url: song.url,
        artist,
        artistUrl,
        title,
        chord
    };
    return index_js_1.ChordSchema.parse(res);
}
exports.chord = chord;
