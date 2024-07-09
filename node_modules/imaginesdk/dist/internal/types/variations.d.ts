import { VariationStyle } from "../enums/styles";
/**
 * Configuration options for applying variations to an image.
 *
 * @property {VariationStyle} [style] - The style for applying variations (model: VariationStyle).
 * @property {number} [seed] - The random seed for reproducible variation application.
 * @property {number} [steps] - The number of steps for applying variations to the image.
 * @property {number} [strength] - The strength of the variation application process.
 * @property {number} [cfg] - The CFG (Controlled Feature Generation) parameter for applying variations.
 * @property {string} [negativePrompt] - The negative prompt for contrasting images.
 */
export declare type VariationConfig = {
    style?: VariationStyle;
    seed?: number;
    steps?: number;
    strength?: number;
    cfg?: number;
    negativePrompt?: string;
};
