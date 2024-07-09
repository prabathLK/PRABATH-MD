import got from 'got';
import { TebakBenderaSchema } from '../types/index.js';
export let tebakbenderajson;
export default async function tebakbendera() {
    if (!tebakbenderajson) {
        tebakbenderajson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakbendera.json').json();
    }
    return TebakBenderaSchema.parse(tebakbenderajson[Math.floor(Math.random() * tebakbenderajson.length)]);
}
