import { YoutubeDownloader } from '../types/index.js';
/**
 * Scrape from https://www.y2mate.com/
 */
export declare function youtubedl(url: string, server?: string): Promise<YoutubeDownloader>;
export declare function youtubedlv2(url: string): Promise<YoutubeDownloader>;
export declare function convert(vid: string, k: string): Promise<string>;
export declare function convertv2(url: string, v_id: string, ftype: string, fquality: string, token: string, timeExpire: number, fname: string): Promise<string>;
//# sourceMappingURL=youtube.d.ts.map