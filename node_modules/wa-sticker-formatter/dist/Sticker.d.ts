/// <reference types="node" />
import { IStickerOptions } from './Types';
import { StickerTypes } from './internal/Metadata/StickerTypes';
import { Categories } from '.';
import { Color } from 'sharp';
/**
 * Sticker class
 */
export declare class Sticker {
    private data;
    metadata: Partial<IStickerOptions>;
    /**
     * Sticker Constructor
     * @param {string|Buffer} [data] - File path, url or Buffer of the image/video to be converted
     * @param {IStickerOptions} [options] - Sticker options
     */
    constructor(data: string | Buffer, metadata?: Partial<IStickerOptions>);
    private _parse;
    private _getMimeType;
    /**
     * Builds the sticker
     * @returns {Promise<Buffer>} A promise that resolves to the sticker buffer
     * @example
     * const sticker = new Sticker('./image.png')
     * const buffer = sticker.build()
     */
    build: () => Promise<Buffer>;
    /**
     * Alias for `.build()`
     * @param {string} [type] - How you want your sticker to look like
     * @returns {Promise<Buffer>} A promise that resolves to the sticker buffer
     * @example
     * const sticker = new Sticker('./image.png')
     * const buffer = sticker.build()
     */
    toBuffer: () => Promise<Buffer>;
    get defaultFilename(): string;
    /**
     * Saves the sticker to a file
     * @param [filename] - Filename to save the sticker to
     * @returns filename
     * @example
     * const sticker = new Sticker('./image.png')
     * sticker.toFile('./image.webp')
     */
    toFile: (filename?: string) => Promise<string>;
    /**
     * Set the sticker pack title
     * @param pack - Sticker Pack Title
     * @returns {this}
     * @example
     * const sticker = new Sticker('./image.png')
     * sticker.setPack('My Sticker Pack')
     * sticker.build()
     */
    setPack: (pack: string) => this;
    /**
     * Set the sticker pack author
     * @param author - Sticker Pack Author
     * @returns
     */
    setAuthor: (author: string) => this;
    /**
     * Set the sticker pack ID
     * @param id - Sticker Pack ID
     * @returns {this}
     * @example
     * const sticker = new Sticker('./image.png')
     * sticker.setID('my-sticker-pack')
     * sticker.build()
     */
    setID: (id: string) => this;
    /**
     * Set the sticker category
     * @param categories - Sticker Category
     * @returns {this}
     * @example
     * const sticker = new Sticker('./image.png')
     * sticker.setCategories(['🌹'])
     */
    setCategories: (categories: Categories[]) => this;
    /**
     * Set the sticker type
     * @param {StickerTypes|string}[type] - Sticker Type
     * @returns {this}
     */
    setType: (type: StickerTypes | string) => this;
    /**
     * Set the sticker quality
     * @param {number}[quality] - Sticker Quality
     * @returns {this}
     */
    setQuality: (quality: number) => this;
    /**
     * Set the background color for `full` images
     * @param {Color}[background] - Background color
     * @returns {this}
     */
    setBackground: (background: Color) => this;
    /**
     * @deprecated
     * Use the `Sticker.build()` method instead
     */
    get: () => Promise<Buffer>;
    /**
     * Get BaileysMD-compatible message object
     * @returns {{ sticker: Buffer }}
     * @example
     * import { create } from '@adiwajshing/baileys-md'
     * const conn = create()
     * ...
     * const sticker = new Sticker('./image.png', { pack: 'My Sticker Pack', author: 'Me' })
     * const message = await sticker.toMessage()
     * conn.sendMessage(jid, message)
     */
    toMessage: () => Promise<{
        sticker: Buffer;
    }>;
    /**
     * Extracts metadata from a WebP image.
     * @param {Buffer}image - The image buffer to extract metadata from
     */
    static extractMetadata: (image: Buffer) => Promise<Partial<import("./Types").IRawMetadata>>;
}
/**
 *
 * @param {string|Buffer} data - File path, url or Buffer of the image/video to be converted
 * @param {IStickerOptions} [options] - Sticker options
 * @returns {Promise<Buffer>} A promise that resolves to the sticker buffer
 */
export declare const createSticker: (data: string | Buffer, metadata?: Partial<IStickerOptions> | undefined) => Promise<Buffer>;
