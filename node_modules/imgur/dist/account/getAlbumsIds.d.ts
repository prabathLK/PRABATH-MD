import { ImgurClient } from '../client';
import { ImgurApiResponse } from '../common/types';
export declare function getAlbumsIds(client: ImgurClient, account: string, page?: number): Promise<ImgurApiResponse<string[]>>;
