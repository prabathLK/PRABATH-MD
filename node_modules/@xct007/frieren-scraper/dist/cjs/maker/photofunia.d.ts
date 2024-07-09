import { errorHandling } from "../Interface";
import { PhotoFuniaListResults, PhotoFuniaCreatedResult } from "../Types";
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
