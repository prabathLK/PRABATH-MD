import got from 'got';
import cheerio from 'cheerio';
import { SuaracomSchema } from '../types/index.js';
export default async function suaracom() {
    const html = await got('https://www.suara.com/news').text();
    const $ = cheerio.load(html);
    const results = [];
    $('div.widget-content > ul.list-unstyled > li.item-outer').each((_, el) => {
        const $el = $(el);
        const title = $el.find('h4.post-title > a.ellipsis2').text();
        const link = $el.find('h4.post-title > a.ellipsis2').attr('href');
        const description = $el.find('div.item-content > p.ellipsis2').text();
        const image = $el.find('div.post-thumb > a > img').attr('src');
        const date = $el.find('.suara-date-box > span').map((i, el) => $(el).text()).get().join(' ');
        if (title && link) {
            results.push({
                title,
                link,
                image,
                description,
                date
            });
        }
    });
    return results.map((value) => SuaracomSchema.parse(value));
}
