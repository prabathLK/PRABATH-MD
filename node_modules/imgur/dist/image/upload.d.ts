import { ImgurClient } from '../client';
import { Payload, ImgurApiResponse, ImageData } from '../common/types';
export declare function upload(client: ImgurClient, payload: Payload): Promise<ImgurApiResponse<ImageData>>;
