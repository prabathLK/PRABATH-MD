import got from 'got';
import { Family100Schema } from '../types/index.js';
export let family100json;
export default async function family100() {
    if (!family100json) {
        family100json = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json').json();
    }
    return Family100Schema.parse(family100json[Math.floor(Math.random() * family100json.length)]);
}
