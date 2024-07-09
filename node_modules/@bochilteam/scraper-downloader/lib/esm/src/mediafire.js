import got from 'got';
import cheerio from 'cheerio';
import { MediafireArgsSchema, MediafireSchema } from '../types/index.js';
import { parseFileSize } from '../utils/index.js';
export async function mediafiredl(url) {
    var _a, _b;
    MediafireArgsSchema.parse(arguments);
    // if (!/https?:\/\/(www\.)?mediafire\.com/.test(url)) throw new Error('Invalid URL: ' + url)
    const data = await got(url).text();
    const $ = cheerio.load(data);
    const Url = ($('#downloadButton').attr('href') || '').trim();
    const url2 = ($('#download_link > a.retry').attr('href') || '').trim();
    const $intro = $('div.dl-info > div.intro');
    const filename = $intro.find('div.filename').text().trim();
    const filetype = $intro.find('div.filetype > span').eq(0).text().trim();
    const ext = ((_b = (_a = /\(\.(.*?)\)/.exec($intro.find('div.filetype > span').eq(1).text())) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim()) || 'bin';
    const $li = $('div.dl-info > ul.details > li');
    const aploud = $li.eq(1).find('span').text().trim();
    const filesizeH = $li.eq(0).find('span').text().trim();
    const filesize = parseFileSize(filesizeH);
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
    return MediafireSchema.parse(result);
}
