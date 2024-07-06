import { Image } from "../models/image";
import { Result } from "../models/result";
import { RequestClient } from "../services/client";
import { ImageParam } from "../types/image";
import { RemixConfig } from "../types/remix";
export declare const remixHandler: (client: RequestClient) => (prompt: string, image: ImageParam, config?: RemixConfig) => Promise<Result<Image>>;
export default remixHandler;
