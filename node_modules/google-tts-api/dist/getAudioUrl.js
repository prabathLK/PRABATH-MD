"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAudioUrls = exports.getAudioUrl = void 0;
var assertInputTypes_1 = __importDefault(require("./assertInputTypes"));
var splitLongText_1 = __importDefault(require("./splitLongText"));
var url_1 = __importDefault(require("url"));
/**
 * Generate "Google TTS" audio URL
 *
 * @param {string}   text         length should be less than 200 characters
 * @param {object?}  option
 * @param {string?}  option.lang  default is "en"
 * @param {boolean?} option.slow  default is false
 * @param {string?}  option.host  default is "https://translate.google.com"
 * @return {string} url
 */
var getAudioUrl = function (text, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.lang, lang = _c === void 0 ? 'en' : _c, _d = _b.slow, slow = _d === void 0 ? false : _d, _e = _b.host, host = _e === void 0 ? 'https://translate.google.com' : _e;
    assertInputTypes_1.default(text, lang, slow, host);
    if (text.length > 200) {
        throw new RangeError("text length (" + text.length + ") should be less than 200 characters. Try \"getAllAudioUrls(text, [option])\" for long text.");
    }
    return (host +
        '/translate_tts' +
        url_1.default.format({
            query: {
                ie: 'UTF-8',
                q: text,
                tl: lang,
                total: 1,
                idx: 0,
                textlen: text.length,
                client: 'tw-ob',
                prev: 'input',
                ttsspeed: slow ? 0.24 : 1,
            },
        }));
};
exports.getAudioUrl = getAudioUrl;
/**
 * @typedef {object} Result
 * @property {string} shortText
 * @property {string} url
 */
/**
 * Split the long text into multiple short text and generate audio URL list
 *
 * @param {string}   text
 * @param {object?}  option
 * @param {string?}  option.lang        default is "en"
 * @param {boolean?} option.slow        default is false
 * @param {string?}  option.host        default is "https://translate.google.com"
 * @param {string?}  option.splitPunct  split punctuation
 * @return {Result[]} the list with short text and audio url
 */
var getAllAudioUrls = function (text, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.lang, lang = _c === void 0 ? 'en' : _c, _d = _b.slow, slow = _d === void 0 ? false : _d, _e = _b.host, host = _e === void 0 ? 'https://translate.google.com' : _e, _f = _b.splitPunct, splitPunct = _f === void 0 ? '' : _f;
    assertInputTypes_1.default(text, lang, slow, host);
    if (typeof splitPunct !== 'string') {
        throw new TypeError('splitPunct should be a string');
    }
    return splitLongText_1.default(text, { splitPunct: splitPunct }).map(function (shortText) { return ({
        shortText: shortText,
        url: exports.getAudioUrl(shortText, { lang: lang, slow: slow, host: host }),
    }); });
};
exports.getAllAudioUrls = getAllAudioUrls;
//# sourceMappingURL=getAudioUrl.js.map