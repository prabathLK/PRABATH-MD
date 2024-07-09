import { Image } from "../models/image";
import { Result } from "../models/result";
import { RequestClient } from "../services/client";
import { GenerationConfig } from "../types/generations";
export declare const generationsHandler: (client: RequestClient) => (prompt: string, config?: GenerationConfig) => Promise<Result<Image>>;
export default generationsHandler;
