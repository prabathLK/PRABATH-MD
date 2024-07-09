"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../types/index.js");
async function cnbcindonesia() {
    const html = await (0, got_1.default)('https://www.cnbcindonesia.com/news').text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('body > div.container > div > ul.list > li').each((_, el) => {
        const $el = $(el);
        const title = $el.find('.box_text > h2').text();
        const subtitle = $el.find('.box_text > .subjudul').text() || undefined;
        const link = $el.find('a').attr('href');
        const image = $el.find('span > img').attr('src');
        const label = $el.find('.date > .label').text();
        const date = $el.find('.date').text().replace(label, '').replace('-', '').trim();
        if (title && link) {
            results.push({
                title,
                subtitle,
                link,
                image,
                label,
                date
            });
        }
    });
    return results.map((value) => index_js_1.CNBCIndonesiaSchema.parse(value));
}
exports.default = cnbcindonesia;
