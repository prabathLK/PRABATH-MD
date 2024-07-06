import { ImgurClient } from '../client';
import { ImgurApiResponse, AlbumData } from '../common/types';
export declare function getAlbum(client: ImgurClient, albumHash: string): Promise<ImgurApiResponse<AlbumData>>;
