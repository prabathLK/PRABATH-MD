/// <reference types="node" />
/**
 * Function to download the give `YTURL`
 * @param {string} url The youtube URL to download
 * @returns `Buffer`
 * @throws Error if the URL is invalid
 */
export declare const downloadYT: (url: string) => Promise<Buffer>;
/**
 * Function to download and save audio from youtube
 * @param url URL to download
 * @param filename the file to save to
 * @returns filename
 */
export declare const downloadYTAndSave: (url: string, filename?: string) => Promise<string>;
/**
 * Function to get buffer of files with their URLs
 * @param url URL to get Buffer of
 * @returns Buffer
 */
export declare const getBufferFromUrl: (url: string) => Promise<Buffer>;
