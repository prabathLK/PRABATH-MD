"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("./types/index.js");
async function kompas() {
    const html = await (0, got_1.default)('https://www.kompas.com/').text();
    const $ = cheerio_1.default.load(html);
    const result = [];
    $('div.latest.ga--latest').each((_, el) => {
        $(el).find('div.article__list').each((_, el) => {
            const $el = $(el);
            const title = $el.find('h3 > a.article__link').text();
            const link = $el.find('h3 > a.article__link').attr('href');
            const $image = $el.find('.article__asset > a > img');
            const image = ($image.attr('src') || $image.attr('data-src'));
            const label = $el.find('.article__list__info > .article__subtitle').text();
            const date = $el.find('.article__list__info > .article__date').text();
            if (title && link) {
                result.push({
                    title,
                    link,
                    image,
                    label,
                    date
                });
            }
        });
    });
    return result.map((value) => index_js_1.KompasSchema.parse(value));
}
exports.default = kompas;
