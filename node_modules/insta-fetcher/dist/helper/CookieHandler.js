"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieHandler = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let DIR = path.join(__dirname, '../config/Cookies.txt');
class CookieHandler {
    constructor(IgCookie = '') {
        /**
         * save session id to local directory
         * @param IgCookie session id
         * @returns
         */
        this.save = (IgCookie = this.IgCookie) => {
            if (!fs.existsSync(DIR)) {
                fs.writeFileSync(DIR, IgCookie, 'utf-8');
            }
            else {
                this.update(IgCookie);
            }
        };
        /**
         * update with new cookie if last cookie got error, e.g account locked mybe
         * @param {String} IgCookie
         * @returns
         */
        this.update = (IgCookie = this.IgCookie) => {
            if (fs.existsSync(DIR)) {
                fs.writeFileSync(DIR, IgCookie, 'utf-8');
            }
            else {
                throw new Error("Cookie hasn't been saved before, save cookie first using save()");
            }
        };
        /**
         * to check if cookies.txt stored in local dir
         * @returns {boolean} true if file has stored in local dir
         */
        this.check = () => {
            return fs.existsSync(DIR);
        };
        /**
         * get a session id
         * @returns session id
         */
        this.get = () => {
            let data = this.check()
                ? fs.readFileSync(DIR, 'utf-8').toString() || this.IgCookie
                : this.IgCookie;
            return data;
        };
        this.IgCookie = IgCookie;
    }
}
exports.CookieHandler = CookieHandler;
