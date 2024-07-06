import { errorHandling } from "../Interface";
import { StableDiffusionResult } from "../Types";
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
//# sourceMappingURL=diffusion.d.ts.map