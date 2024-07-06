"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../types/index.js");
async function tsunami() {
    const html = await (0, got_1.default)('https://www.bmkg.go.id/tsunami/').text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('table.table > tbody > tr').each(function () {
        const el = $(this).find('td');
        const when = el.eq(1).text().split(' ');
        const date = when[0];
        const time = when[1];
        const latitude = el.eq(2).text().trim();
        const longitude = el.eq(3).text().trim();
        const magnitude = el.eq(4).text().trim();
        const depth = el.eq(3).text().trim();
        const location = el.eq(5).find('a').text().trim();
        const info = el.eq(5).text().replace(location, '').trim();
        results.push({
            date,
            time,
            latitude,
            longitude,
            magnitude,
            depth,
            location,
            info
        });
    });
    return results.map((v) => index_js_1.TsunamiSchema.parse(v));
}
exports.default = tsunami;
