import { csrfToken, IgCookie, LoginData } from "../types";
export declare const getCsrfToken: () => Promise<csrfToken>;
/**
 * get session id using login method
 * @deprecated recommended to use getCookie() function, but you still can use this function too
 * @param {username} username instagram username
 * @param {password} password instagram password
 * @returns {IgCookie} session id
 */
export declare const getSessionId: (username: string, password: string) => Promise<IgCookie>;
/**
 *
 * @param {username} username
 * @param {password} password
 * @param withLoginData if true, it will return logindata
 * @returns
 */
export declare const getCookie: (username: string, password: string, withLoginData?: boolean) => Promise<string | LoginData>;
