"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../types/index.js");
async function antaranews() {
    const html = await (0, got_1.default)('https://www.antaranews.com/').text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('div.terkini > article.simple-post').each((_, el) => {
        const $el = $(el);
        const title = $el.find('.latest-news > a').text();
        const link = $el.find('.latest-news > a').attr('href');
        const $image = $el.find('picture');
        const image = $image.find('img').attr('src') ||
            $image.find('img').attr('data-src') ||
            $image.find('source').attr('srcset') ||
            $image.find('source').attr('data-srcset');
        const label = $el.find('.simple-share').text();
        const date = $el.find('.simple-share > span').text();
        if (title && image) {
            results.push({
                title,
                link,
                image,
                label: label.replace(date, '').replace('/', '').trim(),
                date: date.trim()
            });
        }
    });
    return results.map((value) => index_js_1.AntaraNewsSchema.parse(value));
}
exports.default = antaranews;
