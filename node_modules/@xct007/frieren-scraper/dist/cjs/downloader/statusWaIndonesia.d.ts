import { errorHandling } from "../Interface";
import { StatusWaIndonesiaAny } from "../Types";
declare function popular(page?: string, seed?: string): Promise<StatusWaIndonesiaAny[] | errorHandling>;
declare function search(query: string, page?: string, seed?: string): Promise<StatusWaIndonesiaAny[] | errorHandling>;
export { popular, search };
