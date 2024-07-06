"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../types/index.js");
async function merdeka() {
    const html = await (0, got_1.default)('https://www.merdeka.com/berita-hari-ini/').text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('div.main_photo_center > div.mdk-tag-contg').each((_, el) => {
        const $el = $(el);
        const title = $el.find('div.mdk-tag-contln-l > a[title]').attr('title');
        const link = $el.find('div.mdk-tag-contln-l > a[title]').attr('href');
        const image = $el.find('div.mdk-tag-contln-l > a[title] > img').attr('src');
        const label = $el.find('div.mdk-tag-contln-date > span').text();
        const date = $el.find('div.mdk-tag-contln-date').text();
        if (title) {
            results.push({
                title,
                link: 'https://www.merdeka.com' + link,
                image,
                label,
                date: date.replace(label, '').replace('Sekitar', '').trim()
            });
        }
    });
    return results.map((value) => index_js_1.MerdekaSchema.parse(value));
}
exports.default = merdeka;
