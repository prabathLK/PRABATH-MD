import { ITrack } from '../../typings';
export default class TrackDetails implements ITrack {
    name: string;
    artists: string[];
    album_name: string;
    release_date: string;
    cover_url: string;
    constructor(name?: string, artists?: string[], album_name?: string, release_date?: string, cover_url?: string);
}
