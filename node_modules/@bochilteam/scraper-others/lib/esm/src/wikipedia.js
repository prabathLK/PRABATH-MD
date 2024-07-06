import cheerio from 'cheerio';
import got from 'got';
import { WikipediaArgsSchema, WikipediaSchema } from '../types/index.js';
export default async function wikipedia(query, lang = 'id') {
    WikipediaArgsSchema.parse(arguments);
    const html = await getHtml(lang, query);
    const $ = cheerio.load(html);
    const title = $('#firstHeading > i').text().trim();
    const img = getImgLink($('td.infobox-image > a.image > img[src]').attr('src'));
    const articles = [];
    let end = false;
    let start = false;
    $('#mw-content-text > div.mw-parser-output')
        .children()
        .map(function () {
        if (/p|h[2-4]|div/.test(this.name) && !end) {
            let text = '';
            const h = /h[2-4]/.test(this.name);
            const div = /div/.test(this.name);
            const el = $(this);
            if (h &&
                /referen|Примечания|Notes_et_références/i.test(el.find('span.mw-headline').attr('id'))) {
                return (end = true);
            }
            const math = $(this).find('span.mwe-math-element');
            if (math.length) {
                math.replaceWith($(`<span>${math
                    .text()
                    .trim()
                    .replace(/(.*displaystyle.*|\\n)/, '')}</span>`));
            }
            if (div &&
                el.hasClass('thumb') &&
                el.find('div.thumbinner > a > img[src]').length) {
                text = getImgLink(el.find('div.thumbinner > a > img[src]').attr('src'));
            }
            else if (div && el.find('div > ol > li[id]').length) {
                el.find('div > ol > li[id]').each(function () {
                    text += $(this).text().trim() + '\n';
                });
            }
            else
                text = el.text().trim();
            if (!start && this.name === 'p' && !end && text)
                start = true;
            if (text && start && !el.find('div > ul > li').length) {
                articles.push((h ? '\n' : '') + text);
            }
        }
        return true;
    });
    const res = {
        title,
        img,
        articles: articles.join('\n\n')
    };
    return WikipediaSchema.parse(res);
}
function isSupportLang(lang) {
    return ['en', 'id'].includes(lang);
}
async function getHtml(lang, query) {
    query = encodeURIComponent(query.trim());
    const defaultLink = `https://${isSupportLang(lang) ? lang : 'id'}.wikipedia.org`;
    let res = await got(defaultLink + '/wiki/' + query);
    if (!(res.statusCode === 404))
        return res.body;
    const link = `${defaultLink}/w/index.php?${lang === 'id'
        ? `title=Istimewa:Pencarian&search=${query}&fulltext=1&ns0=1`
        : `search=${query}&title=Special:Search&profile=advanced&fulltext=1&ns0=1`}`;
    res = await got(link);
    const html = res.body;
    const $ = cheerio.load(html);
    const results = [];
    $('ul.mw-search-results > li.mw-search-result').each(function () {
        var _a;
        const link = (_a = $(this)
            .find('div.mw-search-result-heading > a[href]')
            .attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
        if (link)
            results.push(encodeURI(link));
    });
    if (results[0])
        return (await got(defaultLink + results[0])).body;
    throw new Error('404 Not Found!!');
}
function getImgLink(link = '') {
    if (!/https:/i.test(link))
        link = encodeURI('https:' + link);
    return link;
}
