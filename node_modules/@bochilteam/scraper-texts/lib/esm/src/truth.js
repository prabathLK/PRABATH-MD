import got from 'got';
import { TruthSchema } from '../types/index.js';
export let truthjson = [];
export default async function truth() {
    if (!truthjson.length) {
        truthjson = await got('https://raw.githubusercontent.com/BochilTeam/database/master/kata-kata/truth.json').json();
    }
    return TruthSchema.parse(truthjson[Math.floor(truthjson.length * Math.random())]);
}
