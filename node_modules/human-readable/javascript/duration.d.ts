export declare const DUR_MS = 1;
export declare const DUR_S: number;
export declare const DUR_M: number;
export declare const DUR_H: number;
export declare const DUR_D: number;
export declare const DUR_W: number;
export declare const DUR_MO: number;
export declare const DUR_Y: number;
declare type DurationPart = {
    literal: string;
    symbol: string;
};
declare type RenderFunction<T> = (parts: DurationPart[]) => T;
interface IOptions<T> {
    allowMultiples?: string[];
    keepNonLeadingZeroes?: boolean;
    render?: RenderFunction<T>;
}
declare type FormatterFunction<T> = (duration: number) => T;
export declare function durationFormatter<T>(options?: IOptions<T>): FormatterFunction<T>;
export {};
