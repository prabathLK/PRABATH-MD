import got from 'got';
import cheerio from 'cheerio';
import { ZippyShareArgsSchema, ZippyShareSchema } from '../types/index.js';
import { parseFileSize } from '../utils/index.js';
export default async function zippyshare(url) {
    var _a, _b, _c;
    ZippyShareArgsSchema.parse(arguments);
    if (!/zippyshare\.com/.test(url))
        throw new Error('Invalid URL: ' + url);
    const res = await got(url);
    // eslint-disable-next-line no-unused-vars
    const [_, __, host, ___, id] = res.url.split('/');
    const $ = cheerio.load(res.body);
    const $lrbox = $('#lrbox > div.left');
    const filename = $lrbox.find('font').eq(2).text().trim();
    const $div = $lrbox.find('div').eq(0).find('div').eq(0);
    const filesizeH = $div.find('font').eq(1).text().trim();
    const filesize = parseFileSize(filesizeH);
    const aploud = $div.find('font').eq(3).text().trim();
    const lastDownload = $div.find('font').eq(5).text().trim();
    const urlId = (_c = (_b = /\((.*?)\)/i.exec((_a = $.html().split('document.getElementById(\'dlbutton\').href =')[1]) === null || _a === void 0 ? void 0 : _a.split(';')[0])) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.trim();
    if (!urlId) {
        throw new Error(`Can't get urlId for download url from ${url}`);
    }
    // eslint-disable-next-line no-eval
    const urlIdRes = eval(urlId);
    const _url = `https://${host}/d/${id}/${urlIdRes}/${filename}`;
    // const url2 = `https://${host}/i/${id}/${urlIdRes}/${filename}`
    const result = {
        url: _url,
        // url2,
        filename,
        filesizeH,
        filesize,
        aploud,
        lastDownload
    };
    return ZippyShareSchema.parse(result);
}
