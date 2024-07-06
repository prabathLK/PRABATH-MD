import { IRawMetadata, Metadata } from '../../Types';
export default class RawMetadata implements IRawMetadata {
    emojis: string[];
    'sticker-pack-id': string;
    'sticker-pack-name': string;
    'sticker-pack-publisher': string;
    constructor(options: Metadata);
}
