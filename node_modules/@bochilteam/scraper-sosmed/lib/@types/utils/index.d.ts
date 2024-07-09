export declare function getEncodedSnapApp(data: string): string[];
export declare function getDecodedSnapSave(data: string): string;
export declare function decryptSnapSave(data: string): string;
export declare function stringifyCookies(cookies: string[]): string;
export declare function parseCookies(cookieString: string): {
    [key: string]: string;
};
type JsonRenderedSnapSave = {
    status: number;
    data: {
        identifier: string;
        progress: number;
        file_size: number;
        file_path: string;
    };
};
type RenderedSnapSave = Omit<JsonRenderedSnapSave['data'], 'identifier' | 'progress'>;
export declare function getRenderedSnapSaveUrl(url: string): Promise<RenderedSnapSave>;
export declare function decodeSnapApp(...args: string[]): string;
export declare function generateTokenYoutube4kdownloader(url: string): string;
/**
 * @returns is a kilobit
 */
export declare function parseFileSize(size: string): number;
export {};
//# sourceMappingURL=index.d.ts.map