import cheerio from 'cheerio';
import got from 'got';
import Form from 'form-data';
import { InstagramDownloaderArgsSchema, InstagramDownloaderSchema, InstagramStoryArgsSchema, IinstagramStorySchema, } from '../types/index.js';
import { stringifyCookies } from '../utils/index.js';
// Inpired by https://github.com/xfar05/xfarr-api/blob/cc0b16819bdecb5351471f81c3de30673d7c657b/lib/downloader.js#L198
export async function instagramdl(url) {
    InstagramDownloaderArgsSchema.parse(arguments);
    const resTmp = await got('https://downvideo.quora-wiki.com/instagram-video-downloader');
    const $ = cheerio.load(resTmp.body);
    const token = $('#token').val();
    const cookie = resTmp.headers['set-cookie'] && stringifyCookies(resTmp.headers['set-cookie']);
    const form = new Form();
    form.append('url', url);
    form.append('token', token);
    const json = await got.post('https://downvideo.quora-wiki.com/system/action.php', {
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            origin: 'https://downvideo.quora-wiki.com',
            referer: 'https://downvideo.quora-wiki.com/instagram-video-downloader',
            cookie: cookie || '__gads=ID=1486982c1c054fed-22e9af1484d30013:T=1657169758:RT=1657169758:S=ALNI_MZmuLRHBE2CSCqpTePuuKgRkzZCYQ; __gpi=UID=0000076ec7622ead:T=1657169758:RT=1657169758:S=ALNI_MYrP2FgjawbEhlJWKhnBeMtgQptoQ; fpestid=5T9wUIsSvP8tUpvF-F1zV-Y5RtY0Z8zuAxoIPdJFTXD56TYw2lATC9l1robj4kb26G0AuQ; PHPSESSID=8ib0bnko459rarg31p8c6v5rpp',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
        }
    }).json();
    return InstagramDownloaderSchema.parse(json);
}
export async function instagramStory(name) {
    InstagramStoryArgsSchema.parse(arguments);
    const resKey = await got('https://storydownloader.app/en');
    const $$ = cheerio.load(resKey.body);
    const _token = $$('input[name="_token"]').attr('value');
    const cookie = stringifyCookies(resKey.headers['set-cookie'] || []);
    const headers = {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        cookie: cookie || 'locale=eyJpdiI6IjE5VUJqZm1DdXl3ODhoQnV2SHJaMFE9PSIsInZhbHVlIjoiUnBqZTMvbDFUTWZLWVkvQy9rVjVhOUdrbjRWTVRCYmp2aTVaUlVsUnZZY0RWN2ZoVkdjMVNhemM1MFl6eWt2dCIsIm1hYyI6IjdlMTc4ZDZkMTYyMDVmMTcwZTc5Nzg3YTBjM2ZkOWEyNjRlODZmZDIwOGY5OTgyYzQzZjE3YTY3MjQ2NGNlYzQiLCJ0YWciOiIifQ%3D%3D; _ga_ZXS0LB5VTY=GS1.1.1647856609.1.0.1647856609.0; _ga=GA1.1.1392191220.1647856609; XSRF-TOKEN=eyJpdiI6IkhjVVdRMmRSZ0tOaklvUHlncWxqeVE9PSIsInZhbHVlIjoiTkZLTnFmUnpjM0Y0KzF3NmpxNnMyMTJQWmNPRXFPVjlKQW9la3poN3kySEN4UUw0TUd3TGIzZ0plT2RUWXJGTEp1bzF1NkN2R3FrQkdLbmJpa0o4cUZUM2EzS2N4QTY2aGVKdFM0ZWNhclZBQVBhMDV1cm4vcEZFMVB5NXRLL1UiLCJtYWMiOiI4MjQ1ZDJhYWE2NjQ1MGUyMmY5ZmQ0OTlkMDFhNjZjOWE2MGVjMTRlNmFjN2VjMmNkYzA0OGY5OTRkMDY3MjI3IiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IjQ2RHJ3TUtRU1gxblhpbGtsNXRqamc9PSIsInZhbHVlIjoiTFl2bTg5QVhxcHBkZUN2THRPYkxhbnBmWEkyaWdBc0RFbDM0eUhhbGY0RCs2NFFmRXQ2NXBaNktUMkVpYk9wcDF2SE11SUQ0bW9zazJYaUdLQVZFbjJTaXZ3MmREUEJURnczb1c4ZE5uNDJzTVprNytjNzVCT3loS1ovKysyR1oiLCJtYWMiOiIzOTAyMDc5MDg1N2UxZjgwYmExODcwMjQ2ZWQzNGJjODM3YzkxOTI2MTkwMTEzMTFjNjExN2IzZjdkMmY0ODI4IiwidGFnIjoiIn0%3D',
        origin: 'https://storydownloader.app',
        referer: 'https://storydownloader.app/en',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
        'X-CSRF-TOKEN': _token
    };
    const formData = new Form();
    formData.append('username', name);
    formData.append('_token', _token);
    const res = await got('https://storydownloader.app/request', {
        method: 'POST',
        headers: {
            ...headers,
            ...formData.getHeaders()
        },
        body: formData.getBuffer()
    });
    const { html } = JSON.parse(res.body);
    if (!html)
        throw new Error(`Can't download!\n${res.body}`);
    const $ = cheerio.load(html);
    const username = $('h3.card-title').text();
    const profilePicUrl = $('img.card-avatar').attr('src');
    const results = [];
    $('div.row > div').each(function () {
        const $el = $(this);
        const thumbnail = $el.find('img').attr('src');
        const url = $el.find('a').attr('href');
        const type = /video_dashinit\.mp4/i.test(url) ? 'video' : 'image';
        const isVideo = type === 'video';
        if (thumbnail && url) {
            results.push({
                thumbnail,
                url,
                type,
                isVideo
            });
        }
    });
    const data = {
        user: {
            username,
            profilePicUrl
        },
        results
    };
    return IinstagramStorySchema.parse(data);
}
