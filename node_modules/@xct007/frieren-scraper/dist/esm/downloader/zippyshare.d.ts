import { errorHandling } from "../Interface.js";
import { ZippyShareResult } from "../Types.js";
declare function download(url: string): Promise<ZippyShareResult | errorHandling>;
export { download };
