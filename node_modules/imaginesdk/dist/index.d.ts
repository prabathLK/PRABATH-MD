import { Image } from "./internal/models/image";
import { Result } from "./internal/models/result";
import { RequestClient } from "./internal/services/client";
import { GenerationConfig } from "./internal/types/generations";
import { ImageParam } from "./internal/types/image";
import { InpaintConfig } from "./internal/types/inpaint";
import { RemixConfig } from "./internal/types/remix";
import { VariationConfig } from "./internal/types/variations";
/**
 * An interface for the Imagine SDK that provides methods for interacting with image generation and manipulation.
 *
 * @interface Imagine
 */
interface Imagine {
    /**
     * Generate an image based on a prompt.
     *
     * @param {string} prompt - The prompt for generating the image.
     * @param {GenerationConfig} [config] - Optional configuration for image generation. (model: GenerationConfig)
     * @returns {Promise<Result<Image>>} A Promise that resolves with the result of the image generation.
     */
    generations: (prompt: string, config?: GenerationConfig) => Promise<Result<Image>>;
    /**
     * Apply variations to an image based on a prompt.
     *
     * @param {string} prompt - The prompt for applying variations.
     * @param {ImageParam} image - The image to which variations will be applied.
     * @param {VariationConfig} [config] - Optional configuration for applying variations. (model: VariationConfig)
     * @returns {Promise<Result<Image>>} A Promise that resolves with the result of the image variations.
     */
    variations: (prompt: string, image: ImageParam, config?: VariationConfig) => Promise<Result<Image>>;
    /**
     * Remix an image based on a prompt.
     *
     * @param {string} prompt - The prompt for remixing the image.
     * @param {ImageParam} image - The image to be remixed.
     * @param {RemixConfig} [config] - Optional configuration for image remixing. (model: RemixConfig)
     * @returns {Promise<Result<Image>>} A Promise that resolves with the result of the image remixing.
     */
    remix: (prompt: string, image: ImageParam, config?: RemixConfig) => Promise<Result<Image>>;
    /**
     * Upscale an image.
     *
     * @param {ImageParam} image - The image to be upscaled.
     * @returns {Promise<Result<Image>>} A Promise that resolves with the result of the image upscaling.
     */
    upscale: (image: ImageParam) => Promise<Result<Image>>;
    /**
     * Inpaint an image based on a prompt and mask.
     *
     * @param {string} prompt - The prompt for inpainting the image.
     * @param {ImageParam} image - The image to be inpainted.
     * @param {ImageParam} mask - The mask specifying the inpainting areas.
     * @param {InpaintConfig} [config] - Optional configuration for image inpainting. (model: InpaintConfig)
     * @returns {Promise<Result<Image>>} A Promise that resolves with the result of the image inpainting.
     */
    inpaint: (prompt: string, image: ImageParam, mask: ImageParam, config?: InpaintConfig) => Promise<Result<Image>>;
}
/**
 * Creates an instance of the Imagine client with the specified token and optional configuration.
 *
 * @param {string} token - The API token for authentication.
 * @param {Object} [config] - Optional configuration object.
 *
 * @returns {Imagine} An instance of the Imagine client with various image generation and manipulation functions.
 */
export declare const client: (token: string, config?: {
    client?: RequestClient;
}) => Imagine;
export default client;
export * from "./internal/enums/ratios";
export * from "./internal/enums/statuses";
export * from "./internal/enums/styles";
export * from "./internal/enums/controls";
export * from "./internal/types/generations";
export * from "./internal/types/inpaint";
export * from "./internal/types/remix";
export * from "./internal/types/variations";
export { Err } from "./internal/models/error";
export { RequestClient } from "./internal/services/client";
export { ImageParam } from "./internal/types/image";
