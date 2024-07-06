import { ImgurClient } from '../client';
import { ImgurApiResponse, AccountData } from '../common/types';
export declare function getAccount(client: ImgurClient, account: string): Promise<ImgurApiResponse<AccountData>>;
