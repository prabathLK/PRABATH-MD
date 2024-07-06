import got from 'got';
import cheerio from 'cheerio';
import { BioskopArgsSchema, BioskopSchema, BioskopNowSchema } from '../types/index.js';
export async function bioskopNow() {
    const url = 'https://jadwalnonton.com/now-playing/';
    const response = await got(url, {
        headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            Host: 'jadwalnonton.com',
            Referer: 'https://jadwalnonton.com/now-playing/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
        }
    }).text();
    const results = [];
    const $ = cheerio.load(response);
    $('div.row > div.item.movie').each((_, el) => {
        const $el = $(el);
        const title = $el.find('h2 > a').text();
        const img = $el.find('img.poster').attr('src');
        const url = $el.find('a.mojadwal').attr('href');
        const $span = $el.find('div > span.moket');
        const genre = $span.eq(0).text();
        const duration = $span.eq(1).text();
        const playingAt = ($el.find('div > i.icon').attr('class') || '').replace(/icon/, '').trim();
        if (title && url) {
            results.push({
                title,
                img,
                url,
                genre,
                duration,
                playingAt
            });
        }
    });
    if (results.length === 0)
        throw new Error(`No results for ${url}\n\n${response}`);
    return results.map(res => BioskopNowSchema.parse(res));
}
export async function bioskop(page = 1) {
    BioskopArgsSchema.parse(arguments);
    page = Math.min(4, Math.max(1, parseInt(page)));
    const response = await got(`https://jadwalnonton.com/comingsoon/?page=${page}`, {
        headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            Host: 'jadwalnonton.com',
            Referer: 'https://jadwalnonton.com/comingsoon/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
        }
    }).text();
    const results = [];
    const $ = cheerio.load(response);
    $('div.row > div.item.movie').each((_, el) => {
        const $el = $(el);
        const title = $el.find('h2 > a').text();
        const img = $el.find('img.poster').attr('src');
        const url = $el.find('a.mojadwal').attr('href');
        const $span = $el.find('div.rowl > div > span');
        const genre = $span.eq(0).text();
        const duration = $span.eq(1).text();
        const release = $span.eq(2).text();
        const director = $span.eq(4).text();
        const cast = $span.eq(6).text();
        if (title && url) {
            results.push({
                title,
                img,
                url,
                genre,
                duration,
                release,
                director,
                cast
            });
        }
    });
    if (results.length === 0)
        throw new Error(`No results for page ${page}\n\n${response}`);
    return results.map(res => BioskopSchema.parse(res));
}
