import { errorHandling } from "../Interface.js";
import { StatusWaIndonesiaAny } from "../Types.js";
declare function popular(page?: string, seed?: string): Promise<StatusWaIndonesiaAny[] | errorHandling>;
declare function search(query: string, page?: string, seed?: string): Promise<StatusWaIndonesiaAny[] | errorHandling>;
export { popular, search };
