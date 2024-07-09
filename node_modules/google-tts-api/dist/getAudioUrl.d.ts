import url from 'url';
interface Option {
    lang?: string;
    slow?: boolean;
    host?: string;
}
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
export declare const getAudioUrl: (text: string, { lang, slow, host }?: Option) => string;
interface LongTextOption extends Option {
    splitPunct?: string;
}
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
export declare const getAllAudioUrls: (text: string, { lang, slow, host, splitPunct, }?: LongTextOption) => {
    shortText: string;
    url: string;
}[];
export {};
//# sourceMappingURL=getAudioUrl.d.ts.map