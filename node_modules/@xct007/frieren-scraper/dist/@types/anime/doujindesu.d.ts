import { errorHandling } from "../Interface";
import { DoujindesuLatest, DoujindesuSearch, DoujindesuDetail } from "../Types";
declare function latest(): Promise<DoujindesuLatest[] | errorHandling>;
declare function search(query: string): Promise<DoujindesuSearch[] | errorHandling>;
declare function detail(url: string): Promise<DoujindesuDetail | errorHandling>;
export { latest, search, detail };
//# sourceMappingURL=doujindesu.d.ts.map