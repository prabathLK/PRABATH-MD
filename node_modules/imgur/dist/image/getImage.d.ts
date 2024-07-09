import { ImgurClient } from '../client';
import { ImgurApiResponse, ImageData } from '../common/types';
export declare function getImage(client: ImgurClient, imageHash: string): Promise<ImgurApiResponse<ImageData>>;
