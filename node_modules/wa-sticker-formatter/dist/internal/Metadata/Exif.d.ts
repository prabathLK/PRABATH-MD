/// <reference types="node" />
import { Image } from 'node-webpmux';
import { Metadata } from '../../Types';
export default class Exif {
    private data;
    private exif;
    constructor(options: Metadata);
    build: () => Buffer;
    add: (image: string | Buffer | Image) => Promise<Buffer>;
}
