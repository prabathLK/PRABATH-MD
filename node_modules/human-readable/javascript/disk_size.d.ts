export declare const DEC_K = 1000;
export declare const DEC_M = 1000000;
export declare const DEC_G = 1000000000;
export declare const DEC_T = 1000000000000;
export declare const DEC_P = 1000000000000000;
export declare const K: number;
export declare const M: number;
export declare const G: number;
export declare const T: number;
export declare const P: number;
declare type Multiple = [string, number];
declare const Standards: {
    SI: Multiple[];
    IEC: Multiple[];
    JEDEC: Multiple[];
};
declare type StandardName = keyof typeof Standards;
declare type RenderFunction<T> = (literal: string, symbol: string) => T;
interface IOptions<T> {
    std?: StandardName;
    decimalPlaces?: number;
    keepTrailingZeroes?: boolean;
    allowMultiples?: string[];
    render?: RenderFunction<T>;
}
declare type FormatterFunction<T> = (size: number) => T;
export declare function sizeFormatter<T>(options?: IOptions<T>): FormatterFunction<T>;
export {};
