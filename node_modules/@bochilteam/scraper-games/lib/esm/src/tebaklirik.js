import got from 'got';
import { TebakLirikSchema } from '../types/index.js';
export let tebaklirikjson;
export default async function tebaklirik() {
    if (!tebaklirikjson) {
        tebaklirikjson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaklirik.json').json();
    }
    return TebakLirikSchema.parse(tebaklirikjson[Math.floor(Math.random() * tebaklirikjson.length)]);
}
