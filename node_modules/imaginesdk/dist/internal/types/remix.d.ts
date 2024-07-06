import { RemixStyle } from "../enums/styles";
/**
 * Configuration options for remixing an image.
 *
 * @property {RemixStyle} [style] - The style for remixing (model: RemixStyle).
 * @property {number} [seed] - The random seed for reproducible remixing.
 * @property {number} [steps] - The number of steps for remixing the image.
 * @property {number} [strength] - The strength of the remixing process.
 * @property {string} [control] - The control parameter for remixing.
 * @property {number} [cfg] - The CFG (Controlled Feature Generation) parameter for remixing.
 * @property {string} [negativePrompt] - The negative prompt for contrasting images.
 */
export declare type RemixConfig = {
    style?: RemixStyle;
    seed?: number;
    steps?: number;
    strength?: number;
    control?: string;
    cfg?: number;
    negativePrompt?: string;
};
