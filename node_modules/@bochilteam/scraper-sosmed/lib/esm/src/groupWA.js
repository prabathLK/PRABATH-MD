import got from 'got';
import cheerio from 'cheerio';
import { GroupWAArgsSchema, GroupWASchema } from '../types/index.js';
export async function groupWA(query) {
    GroupWAArgsSchema.parse(arguments);
    const html = await got(`http://ngarang.com/link-grup-wa/daftar-link-grup-wa.php?search=${encodeURIComponent(query).replace(/%20/g, '+')}&searchby=name`).text();
    const $ = cheerio.load(html);
    const results = [];
    $('div.entry > div.wa-chat').each((_, el) => {
        const $el = $(el);
        const $a = $el.find('a');
        const url = $a.find('div.wa-chat-title-container > a').attr('href') ||
            $el.find('div.wa-chat-message > a.URLMessage').attr('href');
        const subject = $el.find('div.wa-chat-title-text').text().trim();
        if (url) {
            results.push({
                url,
                subject
            });
        }
    });
    if (results.length === 0) {
        throw new Error(`No results for ${query}\n\n${html}`);
    }
    return results.map(res => GroupWASchema.parse(res));
}
