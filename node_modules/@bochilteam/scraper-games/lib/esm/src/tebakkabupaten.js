import got from 'got';
import { TebakKabupatenSchema } from '../types/index.js';
export let tebakkabupatenjson;
export default async function tebakkabupaten() {
    if (!tebakkabupatenjson) {
        tebakkabupatenjson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkabupaten.json').json();
    }
    return TebakKabupatenSchema.parse(tebakkabupatenjson[Math.floor(Math.random() * tebakkabupatenjson.length)]);
}
