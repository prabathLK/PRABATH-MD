/// <reference types="node" />
/** https://stackoverflow.com/questions/52156713/fluent-ffmpeg-h264-to-gif-throwing-error-1 */
declare const videoToGif: (data: Buffer) => Promise<Buffer>;
export default videoToGif;
