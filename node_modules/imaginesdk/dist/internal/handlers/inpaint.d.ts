import { Image } from "../models/image";
import { Result } from "../models/result";
import { RequestClient } from "../services/client";
import { ImageParam } from "../types/image";
import { InpaintConfig } from "../types/inpaint";
export declare const inpaintHandler: (client: RequestClient) => (prompt: string, image: ImageParam, mask: ImageParam, config: InpaintConfig) => Promise<Result<Image>>;
export default inpaintHandler;
