import similarity from 'similarity';
import { DidYouMean } from '../types/index.js';
export declare function didyoumean(query: string, list: string[], opts?: {
    threshold: number;
    opts?: Parameters<typeof similarity>[2];
}): DidYouMean[];
//# sourceMappingURL=index.d.ts.map