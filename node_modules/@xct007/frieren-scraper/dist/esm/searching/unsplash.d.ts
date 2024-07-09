import { errorHandling } from "../Interface.js";
import { UnsplashSearchResults } from "../Types.js";
declare function search(query: string, page?: number): Promise<UnsplashSearchResults[] | errorHandling>;
export { search };
