import got from 'got';
import { NameFreeFireArgsSchema, NameFreeFireSchema } from '../types/index.js';
export default async function nameFreeFire(id) {
    NameFreeFireArgsSchema.parse(arguments);
    id = id.toString();
    const json = await got('https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store', {
        headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            origin: 'https://duniagames.co.id',
            referer: 'https://duniagames.co.id/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
        },
        body: JSON.stringify({
            catalogId: 66,
            gameId: id,
            itemId: 11,
            paymentId: 750,
            productId: 3,
            product_ref: 'AE',
            product_ref_denom: 'AE'
        }),
        method: 'POST'
    }).json();
    if (json.status.message !== 'success')
        throw new Error(`Can't get nameFreeFire for id ${id}\n${JSON.stringify(json, null, 2)}`);
    const result = {
        id: json.data.gameId,
        username: json.data.userNameGame
    };
    return NameFreeFireSchema.parse(result);
}
