"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../types/index.js");
/**
 * p = Partikel: kelas kata yang meliputi kata depan, kata sambung, kata seru, kata sandang, ucapan salam
 *
 * n = Nomina: kata benda
 */
async function kbbi(words) {
    index_js_1.KbbiArgsSchema.parse(arguments);
    const html = await (0, got_1.default)(`https://kbbi.kemdikbud.go.id/entri/${encodeURIComponent(words)}`).text();
    const $ = cheerio_1.default.load(html);
    const isExist = !/tidak ditemukan/i.test($('body > div.container.body-content > h4[style="color:red"]').text());
    if (!isExist)
        throw new Error(`${words} does not exist!`);
    const results = [];
    let isContent = false;
    let lastTitle;
    $('body > div.container.body-content').children().each((_, el) => {
        const tag = el.tagName;
        const elem = $(el);
        if (tag === 'hr')
            isContent = !isContent && !Object.keys(results).length;
        if (tag === 'h2' && isContent) {
            const index = elem.find('sup').text().trim();
            const title = elem.text().trim();
            results.push({
                index: parseInt(index),
                title,
                means: []
            });
            lastTitle = title;
        }
        if ((tag === 'ol' || tag === 'ul') && isContent && lastTitle) {
            elem.find('li').each((_, el) => {
                const li = $(el).text().trim();
                const index = results.findIndex(({ title }) => title === lastTitle);
                if (index !== -1)
                    results[index].means.push(li);
                else
                    console.log(li, lastTitle);
            });
            lastTitle = '';
        }
    });
    if (results.length === 0)
        throw new Error(`${words} does not exist!\n\n${html}`);
    return results.map(res => index_js_1.KbbiSchema.parse(res));
}
exports.default = kbbi;
