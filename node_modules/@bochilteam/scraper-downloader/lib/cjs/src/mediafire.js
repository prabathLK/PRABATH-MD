"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediafiredl = void 0;
const got_1 = __importDefault(require("got"));
const cheerio_1 = __importDefault(require("cheerio"));
const index_js_1 = require("../types/index.js");
const index_js_2 = require("../utils/index.js");
async function mediafiredl(url) {
    var _a, _b;
    index_js_1.MediafireArgsSchema.parse(arguments);
    // if (!/https?:\/\/(www\.)?mediafire\.com/.test(url)) throw new Error('Invalid URL: ' + url)
    const data = await (0, got_1.default)(url).text();
    const $ = cheerio_1.default.load(data);
    const Url = ($('#downloadButton').attr('href') || '').trim();
    const url2 = ($('#download_link > a.retry').attr('href') || '').trim();
    const $intro = $('div.dl-info > div.intro');
    const filename = $intro.find('div.filename').text().trim();
    const filetype = $intro.find('div.filetype > span').eq(0).text().trim();
    const ext = ((_b = (_a = /\(\.(.*?)\)/.exec($intro.find('div.filetype > span').eq(1).text())) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim()) || 'bin';
    const $li = $('div.dl-info > ul.details > li');
    const aploud = $li.eq(1).find('span').text().trim();
    const filesizeH = $li.eq(0).find('span').text().trim();
    const filesize = (0, index_js_2.parseFileSize)(filesizeH);
    const result = {
        url: Url || url2,
        url2,
        filename,
        filetype,
        ext,
        aploud,
        filesizeH,
        filesize
    };
    return index_js_1.MediafireSchema.parse(result);
}
exports.mediafiredl = mediafiredl;
