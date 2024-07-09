"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gempaRealtime = exports.gempaNow = exports.gempa = void 0;
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../types/index.js");
async function gempa() {
    const html = await (0, got_1.default)('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg').text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('div.table-responsive > table.table > tbody > tr').each(function () {
        const el = $(this).find('td');
        const when = el.eq(1).text().split(' ');
        const date = when[0];
        const time = when[1];
        const locate = el.eq(2).text().split(' ');
        const latitude = locate[0];
        const longitude = locate[1];
        const magnitude = el.eq(3).text();
        const depth = el.eq(4).text();
        const location = el.eq(5).find('a').text().trim();
        const warning = el.eq(5).find('span.label').map(function () {
            return $(this).text().replace(/\\t/g, ' ').trim();
        }).toArray();
        results.push({
            date,
            time,
            latitude,
            longitude,
            magnitude,
            depth,
            location,
            warning
        });
    });
    return results.map((v) => index_js_1.GempaSchema.parse(v));
}
exports.gempa = gempa;
async function gempaNow() {
    const html = await (0, got_1.default)('https://www.bmkg.go.id/gempabumi/gempabumi-terkini.bmkg').text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('div.table-responsive > table.table > tbody > tr').each(function () {
        const el = $(this).find('td');
        const when = el.eq(1).text().split(' ');
        const date = when[0];
        const time = when[1];
        const latitude = el.eq(2).text().trim();
        const longitude = el.eq(3).text().trim();
        const magnitude = el.eq(4).text().trim();
        const depth = el.eq(5).text().trim();
        const location = el.eq(6).text().trim();
        results.push({
            date,
            time,
            latitude,
            longitude,
            magnitude,
            depth,
            location
        });
    });
    return results.map((v) => index_js_1.GempaNowSchema.parse(v));
}
exports.gempaNow = gempaNow;
async function gempaRealtime() {
    const html = await (0, got_1.default)('https://www.bmkg.go.id/gempabumi/gempabumi-realtime.bmkg').text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('table.table tbody tr').each(function () {
        const $td = $(this).find('td');
        const when = $td.eq(1).text().split(' ');
        const date = when[0];
        const time = when[1];
        const latitude = $td.eq(2).text();
        const longitude = $td.eq(3).text();
        const magnitude = $td.eq(4).text();
        const depth = $td.eq(5).text();
        const _location = $td.eq(6);
        const location = _location.find('a').text().split(',').map((v) => v.trim());
        const isConfirmed = /\(Confirmed\)/i.test(_location.text());
        results.push({
            date,
            time,
            latitude,
            longitude,
            magnitude,
            depth,
            location,
            isConfirmed
        });
    });
    return results.map((v) => index_js_1.GempaRealtimeSchema.parse(v));
}
exports.gempaRealtime = gempaRealtime;
