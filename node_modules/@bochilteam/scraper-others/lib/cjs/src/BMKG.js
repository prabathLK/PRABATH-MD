"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsunami = exports.gempaNow = exports.gempa = void 0;
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../types/index.js");
async function gempa() {
    const html = await (0, got_1.default)('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg').text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('div.table-responsive > table.table > tbody > tr').each(function () {
        const el = $(this).find('td');
        const date = el.eq(1).text().trim();
        const locate = el.eq(2).text().trim();
        const magnitude = el.eq(3).text().trim();
        const depth = el.eq(4).text().trim();
        const location = el.eq(5).find('a').text().trim();
        const warning = el.eq(5).find('span.label').map(function () {
            return $(this).text().trim();
        }).toArray();
        results.push({
            date,
            locate,
            magnitude,
            depth,
            location,
            warning
        });
    });
    if (results.length === 0)
        throw new Error(`Gempa not found\n\n${html}`);
    return results.map(res => index_js_1.GempaSchema.parse(res));
}
exports.gempa = gempa;
async function gempaNow() {
    const html = await (0, got_1.default)('https://www.bmkg.go.id/gempabumi/gempabumi-terkini.bmkg').text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('div.table-responsive > table.table > tbody > tr').each(function () {
        const el = $(this).find('td');
        const date = el.eq(1).text().trim();
        const latitude = el.eq(2).text().trim();
        const longitude = el.eq(3).text().trim();
        const magnitude = el.eq(4).text().trim();
        const depth = el.eq(5).text().trim();
        const location = el.eq(6).text().trim();
        results.push({
            date,
            latitude,
            longitude,
            magnitude,
            depth,
            location
        });
    });
    if (results.length === 0)
        throw new Error(`Gempa Now not found\n\n${html}`);
    return results.map(res => index_js_1.GempaNowSchema.parse(res));
}
exports.gempaNow = gempaNow;
async function tsunami() {
    const html = await (0, got_1.default)('https://www.bmkg.go.id/tsunami/').text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('div.row > div > table.table > tbody > tr').each(function () {
        const el = $(this).find('td');
        const date = el.eq(0).text().trim();
        const locate = el.eq(1).text().trim();
        const magnitude = el.eq(2).text().trim();
        const depth = el.eq(3).text().trim();
        const location = el.eq(4).text().trim();
        results.push({
            date,
            locate,
            magnitude,
            depth,
            location
        });
    });
    if (results.length === 0)
        throw new Error(`Tsunami not found\n\n${html}`);
    return results.map(res => index_js_1.TsunamiSchema.parse(res));
}
exports.tsunami = tsunami;
