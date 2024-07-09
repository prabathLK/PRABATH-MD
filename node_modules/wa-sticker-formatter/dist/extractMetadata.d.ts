/// <reference types="node" />
import { IRawMetadata } from '.';
/**
 * Extracts metadata from a WebP image.
 * @param {Buffer}image - The image buffer to extract metadata from
 */
export declare const extractMetadata: (image: Buffer) => Promise<Partial<IRawMetadata>>;
