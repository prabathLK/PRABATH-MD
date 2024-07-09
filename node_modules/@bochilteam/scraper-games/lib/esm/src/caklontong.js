import got from 'got';
import { CakLontongSchema } from '../types/index.js';
export let caklontongjson;
export default async function caklontong() {
    if (!caklontongjson) {
        caklontongjson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/caklontong.json').json();
    }
    return CakLontongSchema.parse(caklontongjson[Math.floor(Math.random() * caklontongjson.length)]);
}
