import { IgCookie } from '../types';
export declare class CookieHandler {
    IgCookie: IgCookie;
    constructor(IgCookie?: string);
    /**
     * save session id to local directory
     * @param IgCookie session id
     * @returns
     */
    save: (IgCookie?: string) => void;
    /**
     * update with new cookie if last cookie got error, e.g account locked mybe
     * @param {String} IgCookie
     * @returns
     */
    update: (IgCookie?: string) => void;
    /**
     * to check if cookies.txt stored in local dir
     * @returns {boolean} true if file has stored in local dir
     */
    check: () => boolean;
    /**
     * get a session id
     * @returns session id
     */
    get: () => string;
}
