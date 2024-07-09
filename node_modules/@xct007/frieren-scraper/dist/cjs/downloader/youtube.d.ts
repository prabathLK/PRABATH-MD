import { errorHandling } from "../Interface";
import { YoutubeSearchResult, YoutubeDownloadResult } from "../Types";
declare function search(query: string): Promise<YoutubeSearchResult[] | errorHandling>;
declare function download(url: string): Promise<YoutubeDownloadResult | errorHandling>;
export { search, download };
