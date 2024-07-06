import { errorHandling } from "../Interface.js";
import { DoujindesuLatest, DoujindesuSearch, DoujindesuDetail } from "../Types.js";
declare function latest(): Promise<DoujindesuLatest[] | errorHandling>;
declare function search(query: string): Promise<DoujindesuSearch[] | errorHandling>;
declare function detail(url: string): Promise<DoujindesuDetail | errorHandling>;
export { latest, search, detail };
