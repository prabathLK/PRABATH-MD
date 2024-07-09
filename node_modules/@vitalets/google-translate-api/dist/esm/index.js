import fetch from 'node-fetch';
import createHttpError from 'http-errors';
import { extractTooManyRequestsInfo } from './helpers.js';
const defaults = {
    from: 'auto',
    to: 'en',
    host: 'translate.google.com',
};
export async function translate(inputText, options) {
    return new Translator(inputText, options).translate();
}
export class Translator {
    constructor(inputText, options) {
        this.inputText = inputText;
        this.options = Object.assign({}, defaults, options);
    }
    async translate() {
        const url = this.buildUrl();
        const fetchOptions = this.buildFetchOptions();
        const res = await fetch(url, fetchOptions);
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
            const { ip, time, url } = extractTooManyRequestsInfo(text);
            const message = `${res.statusText} IP: ${ip}, Time: ${time}, Url: ${url}`;
            return createHttpError(res.status, message);
        }
        else {
            return createHttpError(res.status, res.statusText);
        }
    }
}
//# sourceMappingURL=index.js.map