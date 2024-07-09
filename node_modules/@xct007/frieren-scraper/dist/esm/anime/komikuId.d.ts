import { errorHandling } from "../Interface.js";
import { KomikuIdLatestResults, KomikuIdDetailResult, KomikuIdSearchResults } from "../Types.js";
export declare const latest: () => Promise<KomikuIdLatestResults[] | errorHandling>;
export declare const search: (query: string) => Promise<KomikuIdSearchResults[] | errorHandling>;
export declare const detail: (url: string) => Promise<KomikuIdDetailResult["Manga"] | KomikuIdDetailResult["Chapter"] | errorHandling>;
