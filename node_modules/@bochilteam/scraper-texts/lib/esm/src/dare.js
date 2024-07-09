import got from 'got';
import { DareSchema } from '../types/index.js';
export let darejson = [];
export default async function dare() {
    if (!darejson.length) {
        darejson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/kata-kata/dare.json').json();
    }
    return DareSchema.parse(darejson[Math.round(darejson.length * Math.random())]);
}
