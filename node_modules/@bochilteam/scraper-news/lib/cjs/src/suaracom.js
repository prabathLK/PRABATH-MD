"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../types/index.js");
async function suaracom() {
    const html = await (0, got_1.default)('https://www.suara.com/news').text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('div.widget-content > ul.list-unstyled > li.item-outer').each((_, el) => {
        const $el = $(el);
        const title = $el.find('h4.post-title > a.ellipsis2').text();
        const link = $el.find('h4.post-title > a.ellipsis2').attr('href');
        const description = $el.find('div.item-content > p.ellipsis2').text();
        const image = $el.find('div.post-thumb > a > img').attr('src');
        const date = $el.find('.suara-date-box > span').map((i, el) => $(el).text()).get().join(' ');
        if (title && link) {
            results.push({
                title,
                link,
                image,
                description,
                date
            });
        }
    });
    return results.map((value) => index_js_1.SuaracomSchema.parse(value));
}
exports.default = suaracom;
