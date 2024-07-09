import got from 'got';
import { TekaTekiSchema } from '../types/index.js';
export let tekatekijson;
export default async function tekateki() {
    if (!tekatekijson) {
        tekatekijson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/tekateki.json').json();
    }
    return TekaTekiSchema.parse(tekatekijson[Math.floor(Math.random() * tekatekijson.length)]);
}
