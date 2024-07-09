import { Image } from "../models/image";
import { Result } from "../models/result";
import { RequestClient } from "../services/client";
import { ImageParam } from "../types/image";
export declare const upscaleHandler: (client: RequestClient) => (image: ImageParam) => Promise<Result<Image>>;
export default upscaleHandler;
