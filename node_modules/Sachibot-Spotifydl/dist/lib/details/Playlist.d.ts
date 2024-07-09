import { IPlaylist } from '../../typings';
export default class Playlist implements IPlaylist {
    name: string;
    total_tracks: number;
    tracks: string[];
    constructor(name?: string, total_tracks?: number, tracks?: string[]);
}
