import got from 'got';
import cheerio from 'cheerio';
import { ChordArgsSchema, ChordSchema } from '../types/index.js';
export async function chord(query) {
    ChordArgsSchema.parse(arguments);
    const search = await got(`https://www.gitagram.com/?s=${encodeURIComponent(query).replace(/%20/g, '+')}`);
    const $ = cheerio.load(search.body);
    const $url = $('table.table > tbody > tr').eq(0).find('td').eq(0).find('a').eq(0);
    const url = $url.attr('href');
    if (!url) {
        throw new Error(`No results for ${query}\n\n${search.body}`);
    }
    const song = await got(url);
    const $song = cheerio.load(song.body);
    const $hcontent = $song('div.hcontent');
    const artist = $hcontent.find('div > a > span.subtitle').text().trim();
    const artistUrl = $hcontent.find('div > a').attr('href');
    const title = $hcontent.find('h1.title').text().trim();
    const chord = $song('div.content > pre').text().trim();
    const res = {
        url: song.url,
        artist,
        artistUrl,
        title,
        chord
    };
    return ChordSchema.parse(res);
}
