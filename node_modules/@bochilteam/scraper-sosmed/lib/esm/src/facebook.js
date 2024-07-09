import cheerio from 'cheerio';
import got from 'got';
import { decodeSnapApp, getDecodedSnapSave, getEncodedSnapApp, generateTokenYoutube4kdownloader } from '../utils/index.js';
import { FacebookDownloaderArgsSchema, FacebookDownloaderSchema, FacebookDownloaderV2Schema, } from '../types/index.js';
// only support download video yet
export async function facebookdl(url) {
    FacebookDownloaderArgsSchema.parse(arguments);
    const { data: { id, thumbnail, duration, title, a, av, v } } = await got('https://s4.youtube4kdownloader.com/ajax/getLinks.php', {
        headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Content-type': 'application/x-www-form-urlencoded',
            Host: 's4.youtube4kdownloader.com',
            Origin: 'https://youtube4kdownloader.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        },
        searchParams: {
            video: url,
            rand: generateTokenYoutube4kdownloader(url)
        }
    }).json();
    const result = [...a, ...av, ...v]
        .map(({ size, ext, url, quality, vcodec, fid }) => {
        const isVideo = ext === 'mp4';
        const isWebm = ext === 'webm';
        const isAudio = ext === 'mp3';
        return {
            size,
            ext,
            url,
            quality,
            vcodec,
            fid,
            isVideo: isVideo || isWebm,
            isAudio: isAudio
        };
        // ext webm video without audio
    });
    if (!result.length)
        throw new Error(`Can't download!\n${JSON.stringify({ id, thumbnail, duration, a, av, v }, null, 2)}`);
    const res = {
        id,
        thumbnail,
        duration,
        result
    };
    return FacebookDownloaderSchema.parse(res);
}
export async function facebookdlv2(url) {
    var _a, _b, _c;
    FacebookDownloaderArgsSchema.parse(arguments);
    const params = {
        url: encodeURI(url)
    };
    const res = await got
        .post('https://snapsave.app/action.php', {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/x-www-form-urlencoded',
            origin: 'https://snapsave.app',
            referer: 'https://snapsave.app/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        },
        form: params
    }).text();
    const decodeParams = getEncodedSnapApp(res);
    let html;
    if (!Array.isArray(decodeParams) || decodeParams.length !== 6)
        html = (_a = (typeof res === 'string' ? JSON.parse(res) : res)) === null || _a === void 0 ? void 0 : _a.data;
    else {
        html = getDecodedSnapSave(decodeSnapApp(...decodeParams));
    }
    if (!html)
        throw new Error(`Can't parse encode params!\n${res}`);
    const result = [];
    const $ = cheerio.load(html);
    $('table.table > tbody > tr').each(function () {
        var _a, _b;
        const el = $(this).find('td');
        if (/tidak|no/i.test(el.eq(1).text())) {
            const quality = (_b = (_a = el.eq(0).text().split('(')) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.trim();
            const url = el.eq(2).find('a[href]').attr('href');
            if (url)
                result.push({ quality, url });
        }
    });
    if (!result.length)
        throw new Error(`Can't download!\n${$.html()}`);
    const data = {
        id: ((_c = (_b = $('div.media-content > div.content > p > strong')
            .text()
            .split('#')) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.trim()) || '',
        title: $('div.media-content > div.content > p > strong').text(),
        description: $('div.media-content > div.content > p > span.video-des').text(),
        thumbnail: $('figure > p.image > img[src]').attr('src'),
        result
    };
    return FacebookDownloaderV2Schema.parse(data);
}
