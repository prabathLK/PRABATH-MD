import got from 'got';
import { SiapakahAkuSchema } from '../types/index.js';
export let siapakahakujson;
export default async function siapakahaku() {
    if (!siapakahakujson) {
        siapakahakujson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json').json();
    }
    return SiapakahAkuSchema.parse(siapakahakujson[Math.floor(Math.random() * siapakahakujson.length)]);
}
