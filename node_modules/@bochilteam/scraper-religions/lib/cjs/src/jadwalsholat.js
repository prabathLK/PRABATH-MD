"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listJadwalSholat = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../utils/index.js");
const index_js_2 = require("../types/index.js");
exports.listJadwalSholat = (async () => (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/scraper/master/data/jadwal-sholat.json').json())();
async function jadwalsholat(kota) {
    index_js_2.JadwalSholatArgsSchema.parse(arguments);
    const listJadwal = await exports.listJadwalSholat;
    const cities = listJadwal.map(item => item.kota);
    const prediction = (0, index_js_1.didyoumean)(kota, cities);
    const precisionPredection = (0, index_js_1.didyoumean)(kota, cities, { threshold: 0.85 })[0];
    if (!precisionPredection) {
        throw new Error(`Did you mean ${prediction.map(item => item.query).join(', ')}?\n\nList of cities: ${cities.map((city) => `- ${city}`).join('\n')}`);
    }
    const jadwal = listJadwal[precisionPredection.index];
    index_js_2.JadwalSholatItemSchema.parse(jadwal);
    const today = await (0, got_1.default)(`https://www.jadwalsholat.org/adzan/ajax/ajax.daily1.php?id=${jadwal.value}`).text();
    const sholatToday = {};
    const $ = cheerio_1.default.load(today);
    $('table > tbody > tr')
        .filter('.table_light, .table_dark')
        .each(function () {
        const el = $(this).find('td');
        const sholat = el.eq(0).text();
        const time = el.eq(1).text();
        sholatToday[sholat] = time;
    });
    const data = await (0, got_1.default)(`https://jadwalsholat.org/jadwal-sholat/monthly.php?id=${jadwal.value}`).text();
    const list = [];
    const $$ = cheerio_1.default.load(data);
    $$('table.table_adzan > tbody > tr')
        .filter('.table_light, .table_dark')
        .each(function () {
        const el = $$(this).find('td');
        const date = el.eq(0).text().trim();
        const imsyak = el.eq(1).text().trim();
        const shubuh = el.eq(2).text().trim();
        const terbit = el.eq(3).text().trim();
        const dhuha = el.eq(4).text().trim();
        const dzuhur = el.eq(5).text().trim();
        const ashr = el.eq(6).text().trim();
        const magrib = el.eq(7).text().trim();
        const isyak = el.eq(8).text().trim();
        list.push({
            date,
            imsyak,
            shubuh,
            terbit,
            dhuha,
            dzuhur,
            ashr,
            magrib,
            isyak
        });
    });
    const result = {
        date: $$('tr.table_title > td > h2.h2_edit').text().trim(),
        today: sholatToday,
        list
    };
    return index_js_2.JadwalSholatSchema.parse(result);
}
exports.default = jadwalsholat;
