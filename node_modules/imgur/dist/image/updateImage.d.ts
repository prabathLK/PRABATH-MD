import { ImgurClient } from '../client';
import { Payload, ImgurApiResponse } from '../common/types';
export interface UpdateImagePayload extends Pick<Payload, 'title' | 'description'> {
    imageHash: string;
}
export declare function updateImage(client: ImgurClient, payload: UpdateImagePayload): Promise<ImgurApiResponse<boolean>>;
