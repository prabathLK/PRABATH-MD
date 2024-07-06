import { StalkResult } from "../types/stalker";
export declare const TiktokStalk: (username: string, options: {
    cookie: string;
}) => Promise<StalkResult>;
