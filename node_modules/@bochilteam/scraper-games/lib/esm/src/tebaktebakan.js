import got from 'got';
import { TebakTebakanSchema } from '../types/index.js';
export let tebaktebakanjson;
export default async function tebaktebakan() {
    if (!tebaktebakanjson) {
        tebaktebakanjson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaktebakan.json').json();
    }
    return TebakTebakanSchema.parse(tebaktebakanjson[Math.floor(Math.random() * tebaktebakanjson.length)]);
}
