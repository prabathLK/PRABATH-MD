import { Response } from 'node-fetch';
import createHttpError from 'http-errors';
import { RawResponse, TranslateOptions } from './types.js';
declare const defaults: Required<Pick<TranslateOptions, 'from' | 'to' | 'host'>>;
export declare function translate(inputText: string, options?: TranslateOptions): Promise<{
    text: string;
    raw: RawResponse;
}>;
export declare class Translator {
    protected inputText: string;
    protected options: typeof defaults & TranslateOptions;
    constructor(inputText: string, options?: TranslateOptions);
    translate(): Promise<{
        text: string;
        raw: RawResponse;
    }>;
    protected buildUrl(): string;
    protected buildBody(): string;
    protected buildFetchOptions(): Partial<import("node-fetch").RequestInit>;
    protected buildResText({ sentences }: RawResponse): string;
    protected buildError(res: Response): Promise<createHttpError.HttpError<number>>;
}
export {};
//# sourceMappingURL=index.d.ts.map