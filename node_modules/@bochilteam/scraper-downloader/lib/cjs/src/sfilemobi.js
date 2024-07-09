"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sfilemobi = exports.sfilemobiSearch = void 0;
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../utils/index.js");
const index_js_2 = require("../types/index.js");
async function sfilemobiSearch(query, page = 1) {
    index_js_2.SfileMobiSearchArgsSchema.parse(arguments);
    const html = await (0, got_1.default)(`https://sfile.mobi/search.php?q=${query}&page=${page}`).text();
    const $ = cheerio_1.default.load(html);
    const results = [];
    $('div > div > div > div.list').each((_, el) => {
        var _a, _b;
        const $el = $(el);
        const url = $el.find('a').attr('href');
        const filename = $el.find('a').text();
        const icon = $el.find('img').attr('src');
        const type = (_a = /\/smallicon\/(.*?)\.svg/.exec(icon)) === null || _a === void 0 ? void 0 : _a[1];
        const filesizeH = (_b = /\((.*?)\)/.exec($el.text())) === null || _b === void 0 ? void 0 : _b[1];
        const filesize = filesizeH && (0, index_js_1.parseFileSize)(filesizeH);
        if (filename && url) {
            results.push({
                url,
                filename,
                icon: icon,
                type: type,
                filesizeH: filesizeH,
                filesize: filesize
            });
        }
    });
    if (!results.length) {
        throw new Error(`No results for ${query}`);
    }
    return results.map(res => index_js_2.SfileMobiSearchSchema.parse(res));
}
exports.sfilemobiSearch = sfilemobiSearch;
async function sfilemobi(url) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    index_js_2.SfileMobiArgsSchema.parse(arguments);
    if (!/sfile\.mobi/i.test(url))
        throw new Error(`Invalid URL: ${url}`);
    const html = await (0, got_1.default)(url).text();
    const $ = cheerio_1.default.load(html);
    const $k = (_a = /var z = (.*?);/i.exec($.html())) === null || _a === void 0 ? void 0 : _a[1];
    const dlUrl = (((_d = (((_b = /var db = "(.*?)"/i.exec($.html())) === null || _b === void 0 ? void 0 : _b[1]) || ((_c = /var sf = "(.*?)"/i.exec($.html())) === null || _c === void 0 ? void 0 : _c[1]))) === null || _d === void 0 ? void 0 : _d.replace(/\\(\\)?/gi, '')) ||
        $('#download').attr('href')) + `&k=${$k}`;
    const filename = $('div.intro-container > img').attr('alt') || $('div.intro-container > h1').text();
    const icon = $('div.intro-container > img').attr('src');
    const type = (_e = /\/smallicon\/(.*?)\.svg/.exec(icon)) === null || _e === void 0 ? void 0 : _e[1];
    const $list = $('div.list');
    const mimetype = (_f = $list.eq(0).text().split('-')[1]) === null || _f === void 0 ? void 0 : _f.trim();
    const aploud = (_g = $list.eq(2).text().split('Uploaded:')[1]) === null || _g === void 0 ? void 0 : _g.trim();
    const $aploud = $list.eq(1).find('a');
    const aploudby = $aploud.eq(0).text();
    const aploudbyUrl = $aploud.eq(0).attr('href');
    const aploudon = $aploud.eq(1).text();
    const aploudonUrl = $aploud.eq(1).attr('href');
    const downloads = parseInt((_h = $list.eq(3).text().split('Downloads:')[1]) === null || _h === void 0 ? void 0 : _h.trim());
    const filesizeH = (_j = /\((.*?)\)/i.exec($('#download').text())) === null || _j === void 0 ? void 0 : _j[1];
    const filesize = filesizeH && (0, index_js_1.parseFileSize)(filesizeH);
    const results = {
        url: dlUrl,
        filename,
        icon,
        type,
        mimetype,
        aploud,
        aploudby,
        aploudbyUrl,
        aploudon,
        aploudonUrl,
        downloads,
        filesizeH,
        filesize
    };
    return index_js_2.SfileMobiSchema.parse(results);
}
exports.sfilemobi = sfilemobi;
