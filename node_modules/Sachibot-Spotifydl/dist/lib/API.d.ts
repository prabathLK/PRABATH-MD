import Artist from './details/Atrist';
import Playlist from './details/Playlist';
import TrackDetails from './details/Track';
export default class SpotifyApi {
    private auth;
    private spotifyAPI;
    nextTokenRefreshTime: Date;
    constructor(auth: IAuth);
    verifyCredentials: () => Promise<void>;
    checkCredentials: () => Promise<void>;
    requestTokens: () => Promise<void>;
    refreshToken: () => Promise<void>;
    extractTrack: (trackId: string) => Promise<TrackDetails>;
    extractPlaylist: (playlistId: string) => Promise<Playlist>;
    extractAlbum: (albumId: string) => Promise<Playlist>;
    extractArtist: (artistId: string) => Promise<Artist>;
    extractArtistAlbums: (artistId: string) => Promise<SpotifyApi.AlbumObjectSimplified[]>;
    getUser: (id: string) => Promise<UserObjectPublic>;
}
export interface IAuth {
    clientId: string;
    clientSecret: string;
}
export interface UserObjectPublic {
    display_name?: string;
    external_urls?: {
        spotify: string;
    };
    followers?: {
        href?: null;
        total: string;
    };
    href?: string;
    id?: string;
    images?: ImageObject[];
    type?: 'user';
    uri?: string;
}
export interface ImageObject {
    height?: number;
    url: string;
    width?: number;
}
