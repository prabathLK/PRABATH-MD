import { errorHandling } from "../Interface";
import { UnsplashSearchResults } from "../Types";
declare function search(query: string, page?: number): Promise<UnsplashSearchResults[] | errorHandling>;
export { search };
//# sourceMappingURL=unsplash.d.ts.map