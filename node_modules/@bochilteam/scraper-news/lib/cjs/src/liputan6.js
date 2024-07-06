"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../types/index.js");
async function liputan6() {
    const html = await (0, got_1.default)('https://www.liputan6.com/').text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('div.articles > div.articles--iridescent-list').each((i, el) => {
        $(el).find('article.articles--iridescent-list--item').each((i, el) => {
            const $el = $(el);
            const title = $el.find('span.articles--iridescent-list--text-item__title-link-text').text();
            const link = $el.find('a.ui--a[data-template-var="url"]').attr('href');
            const description = $el.find('div.articles--iridescent-list--text-item__summary').text();
            const $image = $el.find('picture.articles--iridescent-list--text-item__figure-image > img');
            const image = ($image.attr('src') || $image.attr('data-src') || $image.attr('data-high-dpi'));
            const label = $el.find('a.articles--iridescent-list--text-item__category').text();
            const $date = $el.find('time.articles--iridescent-list--text-item__time');
            const date = $date.attr('datetime') || $date.attr('title') || $date.text();
            if (title && link) {
                results.push({
                    title,
                    link,
                    image,
                    description,
                    label,
                    date
                });
            }
        });
    });
    return results.map((value) => index_js_1.Liputan6Schema.parse(value));
}
exports.default = liputan6;
