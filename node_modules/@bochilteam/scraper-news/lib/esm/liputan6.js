import got from 'got';
import cheerio from 'cheerio';
import { Liputan6Schema } from './types/index.js';
export default async function liputan6() {
    const html = await got('https://www.liputan6.com/').text();
    const $ = cheerio.load(html);
    const results = [];
    $('div.articles > div.articles--iridescent-list').each((i, el) => {
        $(el).find('article.articles--iridescent-list--item').each((i, el) => {
            const $el = $(el);
            const title = $el.find('span.articles--iridescent-list--text-item__title-link-text').text();
            const link = $el.find('a.ui--a[data-template-var="url"]').attr('href');
            const description = $el.find('div.articles--iridescent-list--text-item__summary').text();
            const $image = $el.find('picture.articles--iridescent-list--text-item__figure-image > img');
            const image = ($image.attr('src') || $image.attr('data-src') || $image.attr('data-high-dpi'));
            const label = $el.find('a.articles--iridescent-list--text-item__category').text();
            const $date = $el.find('time.articles--iridescent-list--text-item__time');
            const date = $date.attr('datetime') || $date.attr('title') || $date.text();
            if (title && link) {
                results.push({
                    title,
                    link,
                    image,
                    description,
                    label,
                    date
                });
            }
        });
    });
    return results.map((value) => Liputan6Schema.parse(value));
}
