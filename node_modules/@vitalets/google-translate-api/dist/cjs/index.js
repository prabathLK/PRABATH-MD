"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translator = exports.translate = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const http_errors_1 = __importDefault(require("http-errors"));
const helpers_js_1 = require("./helpers.js");
const defaults = {
    from: 'auto',
    to: 'en',
    host: 'translate.google.com',
};
async function translate(inputText, options) {
    return new Translator(inputText, options).translate();
}
exports.translate = translate;
class Translator {
    constructor(inputText, options) {
        this.inputText = inputText;
        this.options = Object.assign({}, defaults, options);
    }
    async translate() {
        const url = this.buildUrl();
        const fetchOptions = this.buildFetchOptions();
        const res = await (0, node_fetch_1.default)(url, fetchOptions);
        if (!res.ok)
            throw await this.buildError(res);
        const raw = await res.json();
        const text = this.buildResText(raw);
        return { text, raw };
    }
    buildUrl() {
        const { host } = this.options;
        return [
            `https://${host}/translate_a/single`,
            '?client=at',
            '&dt=t',
            '&dt=rm',
            '&dj=1', // result as pretty json instead of deep nested arrays
        ].join('');
    }
    buildBody() {
        const { from, to } = this.options;
        const params = {
            sl: from,
            tl: to,
            q: this.inputText,
        };
        return new URLSearchParams(params).toString();
    }
    buildFetchOptions() {
        const { fetchOptions } = this.options;
        const res = Object.assign({}, fetchOptions);
        res.method = 'POST';
        res.headers = Object.assign({}, res.headers, {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        });
        res.body = this.buildBody();
        return res;
    }
    buildResText({ sentences }) {
        return sentences
            .filter((s) => 'trans' in s)
            .map(s => s.trans)
            .join('');
    }
    async buildError(res) {
        if (res.status === 429) {
            const text = await res.text();
            const { ip, time, url } = (0, helpers_js_1.extractTooManyRequestsInfo)(text);
            const message = `${res.statusText} IP: ${ip}, Time: ${time}, Url: ${url}`;
            return (0, http_errors_1.default)(res.status, message);
        }
        else {
            return (0, http_errors_1.default)(res.status, res.statusText);
        }
    }
}
exports.Translator = Translator;
//# sourceMappingURL=index.js.map