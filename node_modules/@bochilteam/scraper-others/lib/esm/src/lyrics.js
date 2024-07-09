import got from 'got';
import cheerio from 'cheerio';
import { LyricsArgsSchema, LyricsSchema } from '../types/index.js';
export async function lyrics(query) {
    LyricsArgsSchema.parse(arguments);
    const data = await got(`https://www.musixmatch.com/search/${encodeURIComponent(query)}`).text();
    const $ = cheerio.load(data);
    const results = [];
    $('#search-all-results > div.main-panel > div:nth-child(2) > div.box-content > div > ul.tracks.list > li.showArtist.showCoverart').each(function () {
        var _a;
        const el = (_a = $(this).find('meta[itemprop="url"]').attr('content')) === null || _a === void 0 ? void 0 : _a.trim();
        if (el) {
            results.push({
                link: 'https://www.musixmatch.com' + el,
                title: $(this).find('.media-card-title > a > span').text().trim(),
                author: $(this).find('.artist-field > span > a.artist').text().trim()
            });
        }
    });
    if (!results.length)
        throw new Error(`Can't get lyrics!\n${$.html()}`);
    const { link, title, author } = results[0];
    const html = await got(link).text();
    const $$ = cheerio.load(html);
    const result = {
        title,
        author,
        lyrics: $$('p.mxm-lyrics__content > span.lyrics__content__ok').map((_, el) => $$(el).text().trim()).toArray().filter(v => v).join('\n'),
        link
    };
    return LyricsSchema.parse(result);
}
export async function lyricsv2(query) {
    var _a, _b;
    LyricsArgsSchema.parse(arguments);
    const data = await got(`https://genius.com/api/search/multi?per_page=5&q=${encodeURIComponent(query)}`, {
        headers: {
            accept: 'application/json, text/plain, */*',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
        }
    }).json();
    // @ts-ignore
    const result = (_b = (_a = data.response.sections.find((section) => {
        var _a;
        return ['song', 'lyric'].includes(section.type) &&
            ((_a = section.hits) === null || _a === void 0 ? void 0 : _a.find((hit) => ['song', 'lyric'].includes(hit.type)));
    }).hits) === null || _a === void 0 ? void 0 : _a.find((hit) => ['song', 'lyric'].includes(hit.type))) === null || _b === void 0 ? void 0 : _b.result;
    if (!result)
        throw new Error(`Can't get json!\n${JSON.stringify(data)}`);
    const { artist_names, title, url } = result;
    if (!url)
        throw new Error(`Can't get lyrics!\n${JSON.stringify(data, null, 2)}`);
    const html = await got(url).text();
    const $ = cheerio.load(html);
    let results = '';
    $('#lyrics-root > div[data-lyrics-container="true"]').each((_, el) => {
        const element = $(($(el).html() || '').replace(/<br>/g, '\n')).text().trim();
        if (element)
            results += element;
    });
    const res = {
        title,
        author: artist_names,
        lyrics: results.trim(),
        link: url
    };
    return LyricsSchema.parse(res);
}
