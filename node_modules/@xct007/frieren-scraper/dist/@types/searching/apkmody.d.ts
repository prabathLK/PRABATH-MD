import { errorHandling } from "../Interface";
import { ApkmodyIoSearchResults, ApkmodyIoDetailResult } from "../Types";
declare function search(query: string): Promise<ApkmodyIoSearchResults[] | errorHandling>;
declare function detail(url: string): Promise<ApkmodyIoDetailResult | errorHandling>;
export { search, detail };
//# sourceMappingURL=apkmody.d.ts.map