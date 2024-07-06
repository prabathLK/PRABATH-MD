"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jadwalTVNow = exports.listJadwalTV = void 0;
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../types/index.js");
exports.listJadwalTV = (async () => await (0, got_1.default)('https://raw.githubusercontent.com/BochilTeam/scraper/master/data/jadwal-tv.json').json())();
async function jadwalTV(channel) {
    index_js_1.JadwalTVArgsSchema.parse(arguments);
    const list = await exports.listJadwalTV;
    const data = list.find(({ channel: name }) => (new RegExp(channel, 'ig')).test(name));
    if (!data)
        throw new Error(`List not found!!\n${JSON.stringify(exports.listJadwalTV, null, 2)}`);
    const text = await (0, got_1.default)(`https://www.jadwaltv.net/${data.isPay ? 'jadwal-pay-tv/' : ''}${data.value}`).text();
    const result = [];
    const $ = cheerio_1.default.load(text);
    $('div > table.table').each(function () {
        $(this).find('tbody > tr')
            .slice(1).each(function () {
            const el = $(this).find('td');
            const date = el.eq(0).text();
            const event = el.eq(1).text();
            if (!/Jadwal TV selengkapnya di/ig.test(event)) {
                result.push({
                    date, event
                });
            }
        });
    });
    const res = {
        channel: data.channel,
        result
    };
    return index_js_1.JadwalTVSchema.parse(res);
}
exports.default = jadwalTV;
async function jadwalTVNow() {
    const text = await (0, got_1.default)('https://www.jadwaltv.net/channel/acara-tv-nasional-saat-ini').text();
    const result = {};
    const $ = cheerio_1.default.load(text);
    $('div > table.table').each(function () {
        let prevChannel;
        $(this).find('tbody > tr')
            .slice(1).each(function () {
            const el = $(this).find('td');
            const channel = el.eq(0).find('strong > a[href]')
                .text().trim().toLowerCase();
            if (channel) {
                prevChannel = channel;
                result[channel] = [];
            }
            else if (prevChannel) {
                const date = el.eq(0).text();
                const event = el.eq(1).text();
                result[prevChannel].push({
                    date,
                    event
                });
            }
        });
    });
    return index_js_1.JadwalTVNOWSchema.parse(result);
}
exports.jadwalTVNow = jadwalTVNow;
