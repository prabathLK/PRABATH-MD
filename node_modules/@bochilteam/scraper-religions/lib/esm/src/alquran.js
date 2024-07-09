import got from 'got';
import { AlQuranSchema } from '../types/index.js';
export async function alquran() {
    const data = await got('https://raw.githubusercontent.com/rzkytmgr/quran-api/master/data/quran.json').json();
    return data.map(item => AlQuranSchema.parse(item));
}
