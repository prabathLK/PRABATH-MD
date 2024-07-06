import got from 'got';
import { TiktokDownloaderArgsSchema, TiktokDownloaderSchema, } from '../types/index.js';
export async function tiktokdl(url) {
    TiktokDownloaderArgsSchema.parse(arguments);
    const data = await got
        .post('https://api.tikmate.app/api/lookup', {
        headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            origin: 'https://tikmate.app',
            referer: 'https://tikmate.app/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        },
        form: { url }
    })
        .json();
    const res = {
        author: {
            unique_id: data.author_id,
            nickname: data.author_name,
            avatar: data.author_avatar
        },
        video: {
            no_watermark: `https://tikmate.app/download/${data.token}/${data.id}.mp4`,
            no_watermark_hd: `https://tikmate.app/download/${data.token}/${data.id}.mp4?hd=1`
        }
    };
    return TiktokDownloaderSchema.parse(res);
}
