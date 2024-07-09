interface Option {
    lang?: string;
    slow?: boolean;
    host?: string;
    timeout?: number;
}
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
export declare const getAudioBase64: (text: string, { lang, slow, host, timeout }?: Option) => Promise<string>;
interface LongTextOption extends Option {
    splitPunct?: string;
}
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
export declare const getAllAudioBase64: (text: string, { lang, slow, host, splitPunct, timeout, }?: LongTextOption) => Promise<{
    shortText: string;
    base64: string;
}[]>;
export {};
//# sourceMappingURL=getAudioBase64.d.ts.map