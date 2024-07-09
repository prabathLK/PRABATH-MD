import got from 'got';
import { load } from 'cheerio';
import { AiovideodlArgsSchema, AiovideodlSchema } from '../types/index.js';
import { stringifyCookies } from '../utils/index.js';
export default async function aiovideodl(url) {
    AiovideodlArgsSchema.parse(arguments);
    const resToken = await got('https://aiovideodl.ml/');
    const $$ = load(resToken.body);
    const token = $$('#token').val();
    const cookie = stringifyCookies(resToken.headers['set-cookie'] || []);
    const json = await got('https://aiovideodl.ml/wp-json/aio-dl/video-data/', {
        method: 'post',
        headers: {
            accept: '*/*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/x-www-form-urlencoded',
            cookie: cookie || 'pll_language=en; PHPSESSID=ac96b5726bb9e5a313f677ceb853128f; _gid=GA1.2.1576881453.1683265881; _ga_YPH9WYCMSV=GS1.1.1683265881.2.0.1683265881.0.0.0; _ga=GA1.1.820896926.1682995715',
            origin: 'https://aiovideodl.ml',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
        },
        form: {
            url,
            token
        }
    }).json();
    return AiovideodlSchema.parse(json);
}
