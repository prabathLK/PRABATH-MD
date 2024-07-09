import { Image } from "../models/image";
import { Result } from "../models/result";
import { RequestClient } from "../services/client";
import { ImageParam } from "../types/image";
import { VariationConfig } from "../types/variations";
export declare const variationHandler: (client: RequestClient) => (prompt: string, image: ImageParam, config?: VariationConfig) => Promise<Result<Image>>;
export default variationHandler;
