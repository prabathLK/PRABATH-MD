import cheerio from 'cheerio';
import got from 'got';
import { TwitterDownloaderArgsSchema, TwitterDownloaderSchema, } from '../types/index.js';
export async function twitterdl(url) {
    TwitterDownloaderArgsSchema.parse(arguments);
    if (!/https:\/\/twitter\.com\//i.test(url))
        throw new Error('URL invalid!');
    const payload = { url };
    const res = await got('https://www.expertsphp.com/instagram-reels-downloader.php', {
        method: 'POST',
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/x-www-form-urlencoded',
            cookie: '_gid=GA1.2.1209552833.1682995186; _gat_gtag_UA_120752274_1=1; __gads=ID=e2d27851a97b70ac-222d68fe87e000b0:T=1682995185:RT=1682995185:S=ALNI_MYaXoBa8KWleDZ97JpSaXGyI7nu3g; __gpi=UID=00000be71a67625d:T=1682995185:RT=1682995185:S=ALNI_MYyedH9xuRqL2hx4rg7YyeBDzK36w; _ga_D1XX1R246W=GS1.1.1682995185.1.1.1682995205.0.0.0; _ga=GA1.1.363250370.1682995185',
            origin: 'https://www.expertsphp.com',
            referer: 'https://www.expertsphp.com/instagram-reels-downloader.php',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        },
        form: payload
    }).text();
    const $ = cheerio.load(res);
    const results = [];
    $('table.table > tbody > tr').each(function () {
        const quality = $(this).find('td').eq(2).find('strong').text();
        const type = $(this).find('td').eq(1).find('strong').text();
        const url = $(this).find('td').eq(0).find('a[href]').attr('href');
        const isVideo = /video/i.test(type);
        if (url) {
            results.push({
                quality,
                type,
                url,
                isVideo
            });
        }
    });
    if (results.length === 0)
        throw new Error(`No results found!\n\n${res}`);
    return results.map(res => TwitterDownloaderSchema.parse(res));
}
