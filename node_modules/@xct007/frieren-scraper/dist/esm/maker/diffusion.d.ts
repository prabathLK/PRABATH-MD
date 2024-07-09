import { errorHandling } from "../Interface.js";
import { StableDiffusionResult } from "../Types.js";
declare class Diffusion {
    #private;
    private example;
    private advanceExample;
    constructor();
    protected add(): void;
    protected remove(): void;
    stable(prompt: string, seed?: string | number | boolean): Promise<StableDiffusionResult | errorHandling>;
}
export declare const diffusion: Diffusion;
export {};
