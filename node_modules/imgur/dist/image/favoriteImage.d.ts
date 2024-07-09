import { ImgurClient } from '../client';
import { ImgurApiResponse } from '../common/types';
export declare function favoriteImage(client: ImgurClient, imageHash: string): Promise<ImgurApiResponse<'favorited'>>;
