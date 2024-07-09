import { errorHandling } from "../Interface.js";
import { PhotoFuniaListResults, PhotoFuniaCreatedResult } from "../Types.js";
declare function listEffects(): Promise<PhotoFuniaListResults[] | errorHandling>;
declare function create(name: string, opts: {
    type: string;
    input: string;
}): Promise<PhotoFuniaCreatedResult | errorHandling>;
export declare const photofunia: {
    listEffects: typeof listEffects;
    create: typeof create;
};
export {};
