import got from 'got';
import cheerio from 'cheerio';
import { CNBCIndonesiaSchema } from './types/index.js';
export default async function cnbcindonesia() {
    const html = await got('https://www.cnbcindonesia.com/news').text();
    const $ = cheerio.load(html);
    const results = [];
    $('body > div.container > div > ul.list > li').each((_, el) => {
        const $el = $(el);
        const title = $el.find('.box_text > h2').text();
        const subtitle = $el.find('.box_text > .subjudul').text() || undefined;
        const link = $el.find('a').attr('href');
        const image = $el.find('span > img').attr('src');
        const label = $el.find('.date > .label').text();
        const date = $el.find('.date').text().replace(label, '').replace('-', '').trim();
        if (title && link) {
            results.push({
                title,
                subtitle,
                link,
                image,
                label,
                date
            });
        }
    });
    return results.map((value) => CNBCIndonesiaSchema.parse(value));
}
