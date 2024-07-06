import got from 'got';
import cheerio from 'cheerio';
import { TsunamiSchema } from '../types/index.js';
export default async function tsunami() {
    const html = await got('https://www.bmkg.go.id/tsunami/').text();
    const $ = cheerio.load(html);
    const results = [];
    $('table.table > tbody > tr').each(function () {
        const el = $(this).find('td');
        const when = el.eq(1).text().split(' ');
        const date = when[0];
        const time = when[1];
        const latitude = el.eq(2).text().trim();
        const longitude = el.eq(3).text().trim();
        const magnitude = el.eq(4).text().trim();
        const depth = el.eq(3).text().trim();
        const location = el.eq(5).find('a').text().trim();
        const info = el.eq(5).text().replace(location, '').trim();
        results.push({
            date,
            time,
            latitude,
            longitude,
            magnitude,
            depth,
            location,
            info
        });
    });
    return results.map((v) => TsunamiSchema.parse(v));
}
