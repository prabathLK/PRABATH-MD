import cheerio from 'cheerio';
import got from 'got';
import { WallpaperSchema } from '../types/index.js';
export async function wallpaper(query) {
    const data = await got(`https://www.shutterstock.com/search/${query}`, {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,id;q=0.8',
            // cookie: '_csrf=DLixL776iH1Yv7Ck9wHekk24; _ga=GA1.2.1481444664.1639216586; _gid=GA1.2.348540858.1639216586; _gat=1; _hjFirstSeen=1; _hjSession_2571802=eyJpZCI6ImVkZDUzMWJhLWNjYTgtNDgyMy1hZmUyLWVjNmFhNWMxZjg3ZCIsImNyZWF0ZWQiOjE2MzkyMTY1ODY0Nzl9; _hjAbsoluteSessionInProgress=0; _hjSessionUser_2571802=eyJpZCI6IjIxZGNhYTc5LWRlMTgtNWE5Ni05ZWE2LTdkYjg4NGZhNjIxMSIsImNyZWF0ZWQiOjE2MzkyMTY1ODYyNDMsImV4aXN0aW5nIjp0cnVlfQ==',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
        }
    }).text();
    const $ = cheerio.load(data);
    const results = [
        ...new Set([
            ...$.html().matchAll(/https?:\/\/(image|www)\.shutterstock\.com\/([^"]+)/gim)
        ]
            .map((v) => v[0])
            .filter((v) => /.*\.jpe?g|png$/gi.test(v)))
    ];
    return results.map((value) => WallpaperSchema.parse(value));
}
