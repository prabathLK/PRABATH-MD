import { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { ImgurApiResponse, Payload } from './types';
export declare function createForm(payload: string | Payload): FormData;
export declare function getImgurApiResponseFromResponse(response: AxiosResponse): ImgurApiResponse;
