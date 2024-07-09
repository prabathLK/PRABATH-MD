import { errorHandling } from "../Interface";
import { KomikuIdLatestResults, KomikuIdDetailResult, KomikuIdSearchResults } from "../Types";
export declare const latest: () => Promise<KomikuIdLatestResults[] | errorHandling>;
export declare const search: (query: string) => Promise<KomikuIdSearchResults[] | errorHandling>;
export declare const detail: (url: string) => Promise<KomikuIdDetailResult["Manga"] | KomikuIdDetailResult["Chapter"] | errorHandling>;
