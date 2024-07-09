"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiktokdl = void 0;
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function tiktokdl(url) {
    index_js_1.TiktokDownloaderArgsSchema.parse(arguments);
    const data = await got_1.default
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
    return index_js_1.TiktokDownloaderSchema.parse(res);
}
exports.tiktokdl = tiktokdl;
