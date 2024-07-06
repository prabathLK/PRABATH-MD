import got from 'got';
import { AsahOtakSchema } from '../types/index.js';
export let asahotakjson;
export default async function asahotak() {
    if (!asahotakjson) {
        asahotakjson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/games/asahotak.json').json();
    }
    return AsahOtakSchema.parse(asahotakjson[Math.floor(Math.random() * asahotakjson.length)]);
}
