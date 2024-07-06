/// <reference types="node" />
import { IStickerOptions } from '..';
declare const convert: (data: Buffer, mime: string, { quality, background, type }: IStickerOptions) => Promise<Buffer>;
export default convert;
