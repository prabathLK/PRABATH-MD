import got from 'got';
import cheerio from 'cheerio';
import { MerdekaSchema } from '../types/index.js';
export default async function merdeka() {
    const html = await got('https://www.merdeka.com/berita-hari-ini/').text();
    const $ = cheerio.load(html);
    const results = [];
    $('div.main_photo_center > div.mdk-tag-contg').each((_, el) => {
        const $el = $(el);
        const title = $el.find('div.mdk-tag-contln-l > a[title]').attr('title');
        const link = $el.find('div.mdk-tag-contln-l > a[title]').attr('href');
        const image = $el.find('div.mdk-tag-contln-l > a[title] > img').attr('src');
        const label = $el.find('div.mdk-tag-contln-date > span').text();
        const date = $el.find('div.mdk-tag-contln-date').text();
        if (title) {
            results.push({
                title,
                link: 'https://www.merdeka.com' + link,
                image,
                label,
                date: date.replace(label, '').replace('Sekitar', '').trim()
            });
        }
    });
    return results.map((value) => MerdekaSchema.parse(value));
}
