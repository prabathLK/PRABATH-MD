import { errorHandling } from "../Interface.js";
import { YoutubeSearchResult, YoutubeDownloadResult } from "../Types.js";
declare function search(query: string): Promise<YoutubeSearchResult[] | errorHandling>;
declare function download(url: string): Promise<YoutubeDownloadResult | errorHandling>;
export { search, download };
