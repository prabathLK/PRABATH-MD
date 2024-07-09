import { errorHandling } from "../Interface";
import { AnoboyLatest, AnoboyDetail } from "../Types";
declare function latest(): Promise<AnoboyLatest[] | errorHandling>;
declare function search(query: string): Promise<AnoboyLatest[] | errorHandling>;
declare function detail(url: string): Promise<AnoboyDetail | errorHandling>;
export { latest, search, detail };
