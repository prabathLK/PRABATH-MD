import { errorHandling } from "../Interface.js";
import { BokepSinLatestSearchResults, BokepSinDetail } from "../Types.js";
declare function latest(): Promise<BokepSinLatestSearchResults[] | errorHandling>;
declare function search(query: string): Promise<BokepSinLatestSearchResults[] | errorHandling>;
declare function detail(url: string): Promise<BokepSinDetail | errorHandling>;
export { latest, search, detail };
