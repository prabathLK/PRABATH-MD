import { LatinToAksara, AksaraToLatin } from '../types/index.js';
interface Options {
    diftong?: boolean;
    murda?: boolean;
    space?: boolean;
    number?: boolean;
    cecak?: boolean;
    mode?: 'ketik' | 'kopas';
    HVokal?: boolean;
}
export declare function latinToAksara(str: string, options?: Options): LatinToAksara;
export declare function aksaraToLatin(str: string, options?: Partial<Options>): AksaraToLatin;
export {};
//# sourceMappingURL=aksarajawa.d.ts.map