import got from 'got';
import { SusunKataSchema } from '../types/index.js';
export let susunkatajson;
export default async function susunkata() {
    if (!susunkatajson) {
        susunkatajson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json').json();
    }
    return SusunKataSchema.parse(susunkatajson[Math.floor(Math.random() * susunkatajson.length)]);
}
