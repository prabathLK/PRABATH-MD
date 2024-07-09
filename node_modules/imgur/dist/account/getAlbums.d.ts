import { ImgurClient } from '../client';
import { AlbumData, ImgurApiResponse } from '../common/types';
export declare function getAlbums(client: ImgurClient, account: string, page?: number): Promise<ImgurApiResponse<AlbumData[]>>;
