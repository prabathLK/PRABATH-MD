import { ImgurClient } from '../client';
import { ImgurApiResponse } from '../common/types';
export declare function deleteImage(client: ImgurClient, imageHash: string): Promise<ImgurApiResponse<boolean>>;
