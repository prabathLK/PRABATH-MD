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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAudioBase64 = exports.getAudioBase64 = void 0;
var assertInputTypes_1 = __importDefault(require("./assertInputTypes"));
var axios_1 = __importDefault(require("axios"));
var splitLongText_1 = __importDefault(require("./splitLongText"));
/**
 * Get "Google TTS" audio base64 text
 *
 * @param {string}   text           length should be less than 200 characters
 * @param {object?}  option
 * @param {string?}  option.lang    default is "en"
 * @param {boolean?} option.slow    default is false
 * @param {string?}  option.host    default is "https://translate.google.com"
 * @param {number?}  option.timeout default is 10000 (ms)
 * @returns {Promise<string>} url
 */
var getAudioBase64 = function (text, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.lang, lang = _c === void 0 ? 'en' : _c, _d = _b.slow, slow = _d === void 0 ? false : _d, _e = _b.host, host = _e === void 0 ? 'https://translate.google.com' : _e, _f = _b.timeout, timeout = _f === void 0 ? 10000 : _f;
    return __awaiter(void 0, void 0, void 0, function () {
        var res, result;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    assertInputTypes_1.default(text, lang, slow, host);
                    if (typeof timeout !== 'number' || timeout <= 0) {
                        throw new TypeError('timeout should be a positive number');
                    }
                    if (text.length > 200) {
                        throw new RangeError("text length (" + text.length + ") should be less than 200 characters. Try \"getAllAudioBase64(text, [option])\" for long text.");
                    }
                    return [4 /*yield*/, axios_1.default({
                            method: 'post',
                            baseURL: host,
                            url: '/_/TranslateWebserverUi/data/batchexecute',
                            timeout: timeout,
                            data: 'f.req=' +
                                encodeURIComponent(JSON.stringify([
                                    [['jQ1olc', JSON.stringify([text, lang, slow ? true : null, 'null']), null, 'generic']],
                                ])),
                        })];
                case 1:
                    res = _g.sent();
                    try {
                        result = eval(res.data.slice(5))[0][2];
                    }
                    catch (e) {
                        throw new Error("parse response failed:\n" + res.data);
                    }
                    // Check the result. The result will be null if given the lang doesn't exist
                    if (!result) {
                        throw new Error("lang \"" + lang + "\" might not exist");
                    }
                    // 2. continue to parse audio base64 string
                    try {
                        result = eval(result)[0];
                    }
                    catch (e) {
                        throw new Error("parse response failed:\n" + res.data);
                    }
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.getAudioBase64 = getAudioBase64;
/**
 * @typedef {object} Result
 * @property {string} shortText
 * @property {string} base64
 */
/**
 * Split the long text into multiple short text and generate audio base64 list
 *
 * @param {string}   text
 * @param {object?}  option
 * @param {string?}  option.lang        default is "en"
 * @param {boolean?} option.slow        default is false
 * @param {string?}  option.host        default is "https://translate.google.com"
 * @param {string?}  option.splitPunct  split punctuation
 * @param {number?}  option.timeout     default is 10000 (ms)
 * @return {Result[]} the list with short text and audio base64
 */
var getAllAudioBase64 = function (text, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.lang, lang = _c === void 0 ? 'en' : _c, _d = _b.slow, slow = _d === void 0 ? false : _d, _e = _b.host, host = _e === void 0 ? 'https://translate.google.com' : _e, _f = _b.splitPunct, splitPunct = _f === void 0 ? '' : _f, _g = _b.timeout, timeout = _g === void 0 ? 10000 : _g;
    return __awaiter(void 0, void 0, void 0, function () {
        var shortTextList, base64List, result, i, shortText, base64;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    assertInputTypes_1.default(text, lang, slow, host);
                    if (typeof splitPunct !== 'string') {
                        throw new TypeError('splitPunct should be a string');
                    }
                    if (typeof timeout !== 'number' || timeout <= 0) {
                        throw new TypeError('timeout should be a positive number');
                    }
                    shortTextList = splitLongText_1.default(text, { splitPunct: splitPunct });
                    return [4 /*yield*/, Promise.all(shortTextList.map(function (shortText) { return exports.getAudioBase64(shortText, { lang: lang, slow: slow, host: host, timeout: timeout }); }))];
                case 1:
                    base64List = _h.sent();
                    result = [];
                    for (i = 0; i < shortTextList.length; i++) {
                        shortText = shortTextList[i];
                        base64 = base64List[i];
                        result.push({ shortText: shortText, base64: base64 });
                    }
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.getAllAudioBase64 = getAllAudioBase64;
//# sourceMappingURL=getAudioBase64.js.map