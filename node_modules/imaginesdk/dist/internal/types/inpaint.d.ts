import { InpaintStyle } from "../enums/styles";
/**
 * Configuration options for inpainting an image.
 *
 * @property {InpaintStyle} [style] - The style for inpainting (model: InpaintStyle).
 * @property {number} [cfg] - The CFG (Controlled Feature Generation) parameter for inpainting.
 * @property {string} [negativePrompt] - The negative prompt for contrasting images.
 * @property {number} [inPaintStrength] - The strength of the inpainting process.
 */
export declare type InpaintConfig = {
    style?: InpaintStyle;
    cfg?: number;
    negativePrompt?: string;
    inPaintStrength?: number;
};
