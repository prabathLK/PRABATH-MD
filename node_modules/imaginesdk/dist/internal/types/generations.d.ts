import { GenerationAspectRatio } from "../enums/ratios";
import { GenerationStyle } from "../enums/styles";
/**
 * Configuration options for image generation.
 *
 * @property {GenerationAspectRatio} [aspectRatio] - The aspect ratio of the generated image (model: GenerationAspectRatio).
 * @property {GenerationStyle} [style] - The style for image generation (model: GenerationStyle).
 * @property {number} [cfg] - The CFG (Controlled Feature Generation) parameter for image generation.
 * @property {string} [negativePrompt] - The negative prompt for contrasting images.
 * @property {number} [seed] - The random seed for reproducible generation.
 * @property {number} [steps] - The number of steps for generating the image.
 * @property {boolean} [highResolution=false] - The flag indicating high-resolution results.
 */
export declare type GenerationConfig = {
    aspectRatio?: GenerationAspectRatio;
    style?: GenerationStyle;
    cfg?: number;
    negativePrompt?: string;
    seed?: number;
    steps?: number;
    highResolution?: boolean;
};
