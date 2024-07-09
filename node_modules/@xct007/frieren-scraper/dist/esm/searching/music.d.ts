import { errorHandling } from "../Interface.js";
import { MusicApiJamendoResults } from "../Types.js";
declare function search(query: string, limitValue?: number): Promise<MusicApiJamendoResults[] | errorHandling>;
export { search };
