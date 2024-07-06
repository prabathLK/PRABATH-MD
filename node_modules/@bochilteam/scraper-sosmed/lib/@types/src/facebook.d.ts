import { FacebookDownloader, FacebookDownloaderV2 } from '../types/index.js';
export interface Video {
    ext: string;
    url: string;
    quality: string;
    size: string;
    fid: string;
    vcodec?: string;
    fps?: string;
    hdr?: string;
}
export interface Audio {
    size: any;
    ext: string;
    url: string;
    quality: string;
    vcodec: string;
    fps: string;
    hdr: string;
    fid: string;
    audioTrack: AudioTrack;
    acodec: string;
    asr: number;
    abr?: string;
}
export interface AudioTrack {
    id: string;
    displayName: string;
}
export interface Webm {
    size: number;
    ext: string;
    url: string;
    quality: string;
    vcodec: string;
    fps: string;
    hdr: string;
    fid: string;
}
export declare function facebookdl(url: string): Promise<FacebookDownloader>;
export declare function facebookdlv2(url: string): Promise<FacebookDownloaderV2>;
//# sourceMappingURL=facebook.d.ts.map