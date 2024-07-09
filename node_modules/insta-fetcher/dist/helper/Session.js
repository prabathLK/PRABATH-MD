"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookie = exports.getSessionId = exports.getCsrfToken = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
const config_1 = require("../config");
const crypto_1 = require("crypto");
const getCsrfToken = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { headers } = yield (0, axios_1.default)({
            method: 'GET',
            url: 'https://www.instagram.com/accounts/login/'
        });
        let csrfToken = ((_c = (_b = (_a = headers["set-cookie"]) === null || _a === void 0 ? void 0 : _a.find(x => { var _a; return (_a = x.match(/csrftoken=(.*?);/)) === null || _a === void 0 ? void 0 : _a[1]; })) === null || _b === void 0 ? void 0 : _b.match(/csrftoken=(.*?);/)) === null || _c === void 0 ? void 0 : _c[1]) || '';
        return csrfToken;
    }
    catch (error) {
        throw error;
    }
});
exports.getCsrfToken = getCsrfToken;
/**
 * get session id using login method
 * @deprecated recommended to use getCookie() function, but you still can use this function too
 * @param {username} username instagram username
 * @param {password} password instagram password
 * @returns {IgCookie} session id
 */
const getSessionId = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof username !== 'string' || typeof password !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof username !== 'string' ? typeof username : typeof password}`);
    }
    try {
        const csrfToken = yield (0, exports.getCsrfToken)();
        const genHeaders = {
            'X-CSRFToken': csrfToken,
            'user-agent': config_1.config.desktop,
            'cache-Control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded',
            referer: 'https://www.instagram.com/accounts/login/?source=auth_switcher',
            'authority': 'www.instagram.com',
            'origin': 'https://www.instagram.com',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'x-ig-app-id': '936619743392459',
            'x-ig-www-claim': 'hmac.AR3W0DThY2Mu5Fag4sW5u3RhaR3qhFD_5wvYbOJOD9qaPjIf',
            'x-instagram-ajax': '1',
            'x-requested-with': 'XMLHttpRequest',
            'Cookie': 'csrftoken=' + csrfToken + ';'
        };
        const { headers, data } = yield (0, axios_1.default)({
            method: 'POST',
            url: 'https://www.instagram.com/accounts/login/ajax/',
            data: `username=${username}&enc_password=#PWD_INSTAGRAM_BROWSER:0:${Date.now()}:${password}&queryParams=%7B%22source%22%3A%22auth_switcher%22%7D&optIntoOneTap=false`,
            headers: genHeaders
        });
        const { userId: userID, authenticated } = (data);
        if (authenticated) {
            let Cookie = (0, utils_1.formatCookie)(headers['set-cookie']) || '';
            return Cookie;
        }
        else {
            throw new Error('Username or password is incorrect. Please check and try again');
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            throw error.toJSON();
        }
        else {
            throw error;
        }
    }
});
exports.getSessionId = getSessionId;
/**
 *
 * @param {username} username
 * @param {password} password
 * @param withLoginData if true, it will return logindata
 * @returns
 */
const getCookie = (username, password, withLoginData = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let login_headers = {
            "User-Agent": "Instagram 100.1.0.29.135 Android",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Language": "en-US,en;q=0.9",
            Cookie: "",
        };
        const { headers: getHeaders } = yield axios_1.default.get('https://i.instagram.com/api/v1/si/fetch_headers/?challenge_type=signup');
        login_headers.Cookie = (0, utils_1.formatCookie)(getHeaders["set-cookie"]) || '';
        const res = yield axios_1.default.post('https://i.instagram.com/api/v1/accounts/login/', `username=${username}&password=${encodeURIComponent(password)}&device_id=${(0, crypto_1.randomUUID)()}&login_attempt_count=0`, {
            headers: login_headers
        });
        const cookie = (0, utils_1.formatCookie)(res.headers['set-cookie']) || '';
        const result = res.data;
        if (withLoginData) {
            result['cookie'] = cookie;
            return result;
        }
        else
            return cookie;
    }
    catch (error) {
        throw error;
    }
});
exports.getCookie = getCookie;
