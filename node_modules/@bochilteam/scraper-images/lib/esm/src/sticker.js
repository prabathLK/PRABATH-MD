import cheerio from 'cheerio';
import got from 'got';
import { StickerLineSchema, StickerTelegramSchema } from '../types/index.js';
export async function stickerTelegram(query, page) {
    const data = await got(`https://combot.org/telegram/stickers?q=${encodeURI(query)}&page=${page || 1}`).text();
    const $ = cheerio.load(data);
    const results = [];
    $('body > div > main > div.page > div > div.stickers-catalogue > div.tab-content > div > div').each(function () {
        var _a;
        const title = (_a = $(this).find('.sticker-pack__title').text()) === null || _a === void 0 ? void 0 : _a.trim();
        const icon = $(this)
            .find('.sticker-pack__sticker > div.sticker-pack__sticker-inner > div.sticker-pack__sticker-img')
            .attr('data-src');
        const link = $(this)
            .find('.sticker-pack__header > a.sticker-pack__btn')
            .attr('href');
        const stickers = [];
        $(this)
            .find('.sticker-pack__list > div.sticker-pack__sticker')
            .each(function () {
            const sticker = $(this)
                .find('.sticker-pack__sticker-inner > div.sticker-pack__sticker-img')
                .attr('data-src');
            if (sticker)
                stickers.push(sticker);
        });
        results.push({
            title,
            icon,
            link,
            stickers
        });
    });
    return results.map((value) => StickerTelegramSchema.parse(value));
}
export async function stickerLine(query) {
    const data = await got(`https://store.line.me/api/search/sticker?query=${query}&offset=0&limit=36&type=ALL&includeFacets=true`).json();
    return data.items.map(({ title, productUrl, id, description, payloadForProduct: { staticUrl, animationUrl, soundUrl }, authorId, authorName }) => {
        return StickerLineSchema.parse({
            id,
            title,
            description,
            url: encodeURI('https://store.line.me' + productUrl),
            sticker: staticUrl,
            stickerAnimated: animationUrl,
            stickerSound: soundUrl,
            authorId,
            authorName
        });
    });
}
