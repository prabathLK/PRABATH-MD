import { errorHandling } from "../Interface.js";
import { ApkmodyIoSearchResults, ApkmodyIoDetailResult } from "../Types.js";
declare function search(query: string): Promise<ApkmodyIoSearchResults[] | errorHandling>;
declare function detail(url: string): Promise<ApkmodyIoDetailResult | errorHandling>;
export { search, detail };
