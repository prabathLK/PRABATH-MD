export interface Image {
    blob(): Blob;
    buffer(): ArrayBuffer;
    asFile(filename: string): File;
    base64(): string;
    asImageSrc(): string;
}
export declare const toImage: (data: ArrayBuffer) => Image;
