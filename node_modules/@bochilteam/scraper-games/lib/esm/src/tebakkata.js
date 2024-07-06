import got from 'got';
import { TebakKataSchema } from '../types/index.js';
export let tebakkatajson;
export default async function tebakkata() {
    if (!tebakkatajson) {
        tebakkatajson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json').json();
    }
    return TebakKataSchema.parse(tebakkatajson[Math.floor(Math.random() * tebakkatajson.length)]);
}
