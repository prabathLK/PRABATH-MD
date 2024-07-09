import { errorHandling } from "../Interface";
declare function search(query: string): Promise<any | errorHandling>;
export { search };
