import got from 'got';
import { TebakGambarSchema } from '../types/index.js';
export let tebakgambarjson;
export default async function tebakgambar() {
    if (!tebakgambarjson) {
        tebakgambarjson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json').json();
    }
    return TebakGambarSchema.parse(tebakgambarjson[Math.floor(Math.random() * tebakgambarjson.length)]);
}
