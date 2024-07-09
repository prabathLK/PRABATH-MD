import got from 'got';
import { YoutubeDownloaderArgsSchema, YoutubeDownloaderSchema, YoutubeDownloaderV2ArgsSchema, YoutubeConvertSchema } from '../types/index.js';
import { sizeFormatter } from 'human-readable';
import { parseFileSize } from '../utils/index.js';
const toFormat = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`
});
// https://github.com/BochilGaming/games-wabot/blob/main/lib/y2mate.js
const servers = ['en', 'id', 'es'];
/**
 * Scrape from https://www.y2mate.com/
 */
export async function youtubedl(url, server = servers[0]) {
    YoutubeDownloaderArgsSchema.parse(arguments);
    if (!servers.includes(server))
        server = servers[0];
    const json = await got
        .post(`https://www.y2mate.com/mates/analyzeV2/ajax`, {
        headers: {
            accept: '*/*',
            'accept-encoding': 'gzip, deflate, br',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            cookie: '_gid=GA1.2.2055666962.1683248123; _gat_gtag_UA_84863187_21=1; _ga_K8CD7CY0TZ=GS1.1.1683248122.1.1.1683249010.0.0.0; _ga=GA1.1.1570308475.1683248122',
            origin: 'https://www.y2mate.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        },
        form: {
            k_query: url,
            k_page: 'home',
            hl: server,
            q_auto: 0 // maybe in the future this will cause an error?
        }
    })
        .json();
    const vid = json.vid;
    const video = {};
    const audio = {};
    for (const videoKey in json.links['mp4']) {
        const _video = json.links['mp4'][videoKey];
        const quality = _video.q;
        if (_video.f !== 'mp4')
            continue;
        const fileSizeH = _video.size;
        const fileSize = parseFileSize(fileSizeH);
        video[quality] = {
            quality,
            fileSizeH,
            fileSize,
            download: convert.bind(convert, vid, _video.k)
        };
    }
    for (const audioKey in json.links['mp3']) {
        const _audio = json.links['mp3'][audioKey];
        const quality = _audio.q;
        if (_audio.f !== 'mp3')
            continue;
        const fileSizeH = _audio.size;
        const fileSize = parseFileSize(fileSizeH);
        audio[quality] = {
            quality,
            fileSizeH,
            fileSize,
            download: convert.bind(convert, vid, _audio.k)
        };
    }
    const res = {
        id: vid,
        thumbnail: `https://i.ytimg.com/vi/${vid}/0.jpg`,
        title: json.title,
        duration: json.t,
        video,
        audio
    };
    return YoutubeDownloaderSchema.parse(res);
}
export async function youtubedlv2(url) {
    YoutubeDownloaderV2ArgsSchema.parse(arguments);
    const html = await got('https://yt5s.com/en32').text();
    const urlAjax = (/k_url_search="(.*?)"/.exec(html) || ['', ''])[1];
    const urlConvert = (/k_url_convert="(.*?)"/.exec(html) || ['', ''])[1];
    const params = {
        q: url,
        vt: 'home'
    };
    const json = await got(urlAjax, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            cookie: '__cflb=04dToSoFRg9oqH9pYF2En9gKJK4fe8D9TcYtUD6tYu; _ga=GA1.2.1350132744.1641709803; _gid=GA1.2.1492233267.1641709803; _gat_gtag_UA_122831834_4=1',
            origin: 'https://yt5s.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        },
        searchParams: new URLSearchParams(Object.entries(params))
    }).json();
    const video = {};
    Object.values(json.links.mp4).forEach(({ k, size }) => {
        video[k] = {
            quality: k,
            fileSizeH: size,
            fileSize: parseFloat(size) * (/MB$/.test(size) ? 1000 : 1),
            // @ts-ignore
            download: convertv2.bind(null, urlConvert, json.vid, 'mp4', k, json.token, parseInt(json.timeExpires), json.fn)
        };
    });
    const audio = {};
    Object.values(json.links.mp3).forEach(({ key, size }) => {
        audio[key] = {
            quality: key,
            fileSizeH: size,
            fileSize: parseFloat(size) * (/MB$/.test(size) ? 1000 : 1),
            // @ts-ignore
            download: convertv2.bind(null, urlConvert, json.vid, 'mp3', key.replace(/kbps/i, ''), json.token, parseInt(json.timeExpires), json.fn)
        };
    });
    const res = {
        id: json.vid,
        title: json.title,
        thumbnail: `https://i.ytimg.com/vi/${json.vid}/0.jpg`,
        video,
        audio
    };
    return YoutubeDownloaderSchema.parse(res);
}
export async function convert(vid, k) {
    const json = await got('https://www.y2mate.com/mates/convertV2/index', {
        method: 'POST',
        headers: {
            accept: '*/*',
            'accept-encoding': 'gzip, deflate, br',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            cookie: '_gid=GA1.2.2055666962.1683248123; _ga=GA1.1.1570308475.1683248122; _ga_K8CD7CY0TZ=GS1.1.1683248122.1.1.1683248164.0.0.0; prefetchAd_3381349=true',
            origin: 'https://www.y2mate.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        },
        form: {
            vid,
            k
        }
    }).json();
    return YoutubeConvertSchema.parse(json.dlink);
}
export function convertv2(url, v_id, ftype, fquality, token, timeExpire, fname) {
    return new Promise(async (resolve, reject) => {
        const params = {
            v_id,
            ftype,
            fquality,
            token,
            timeExpire,
            client: 'yt5s.com'
        };
        const resServer = await got(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                origin: 'https://yt5s.com',
                referer: 'https://yt5s.com/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
                'X-Requested-Key': 'de0cfuirtgf67a'
            },
            form: params
        }).json();
        const server = resServer.c_server;
        if (!server && ftype === 'mp3')
            return resolve(server || resServer.d_url || '');
        const payload = {
            v_id,
            ftype,
            fquality,
            fname,
            token,
            timeExpire
        };
        const results = await got(`${server}/api/json/convert`, {
            method: 'POST',
            form: payload
        }).json();
        if (results.statusCode === 200)
            return resolve(results.result);
        else if (results.statusCode === 300) {
            try {
                // @ts-ignore
                const WebSocket = (await import('ws')).default;
                const Url = new URL(server);
                const WSUrl = `${/https/i.test(Url.protocol) ? 'wss:' : 'ws:'}//${Url.host}/sub/${results.jobId}?fname=yt5s.com`;
                const ws = new WebSocket(WSUrl, undefined, {
                    headers: {
                        'Accept-Encoding': 'gzip, deflate, br',
                        Host: Url.host,
                        Origin: 'https://yt5s.com',
                        'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
                    }
                });
                ws.on('message', function incoming(message) {
                    const msg = JSON.parse(message.toString());
                    if (msg.action === 'success') {
                        try {
                            ws.close();
                        }
                        catch (e) {
                            console.error(e);
                        }
                        ws.removeAllListeners('message');
                        return resolve(msg.url);
                    }
                    else if (msg.action === 'error')
                        return reject(msg);
                });
            }
            catch (e) {
                console.error(e);
                return reject(e);
            }
        }
        else
            return reject(results);
    });
}
