import got from 'got';
import { TebakKimiaSchema } from '../types/index.js';
export let tebakkimiajson;
export default async function tebakkimia() {
    if (!tebakkimiajson) {
        tebakkimiajson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkimia.json').json();
    }
    return TebakKimiaSchema.parse(tebakkimiajson[Math.floor(Math.random() * tebakkimiajson.length)]);
}
