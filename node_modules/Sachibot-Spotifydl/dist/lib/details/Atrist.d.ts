import { IArtist } from '../../typings';
export default class Artist implements IArtist {
    id: string;
    name: string;
    herf: string;
    constructor(id?: string, name?: string, herf?: string);
}
