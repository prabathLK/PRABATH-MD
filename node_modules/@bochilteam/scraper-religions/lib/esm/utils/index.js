import similarity from 'similarity';
import { DidYouMeanArgsSchema, DidYouMeanSchema } from '../types/index.js';
export function didyoumean(query, list, opts = { threshold: 0.7 }) {
    DidYouMeanArgsSchema.parse(arguments);
    const results = [];
    for (const index in list) {
        const item = list[index];
        const score = similarity(query, item);
        if (similarity(query, item, opts.opts) >= opts.threshold) {
            results.push({ index: parseInt(index), query: item, score });
        }
    }
    const sortByHigest = results.sort((a, b) => b.score - a.score);
    return sortByHigest.map(item => DidYouMeanSchema.parse(item));
}
