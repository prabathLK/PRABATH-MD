interface Option {
    maxLength?: number;
    splitPunct?: string;
}
/**
 * split the long text to short texts
 * Time Complexity: O(n)
 *
 * @param {string}  text
 * @param {object?} option
 * @param {number?} option.maxLength  default is 200
 * @param {string?} option.splitPunct default is ''
 * @returns {string[]} short text list
 */
declare const splitLongText: (text: string, { maxLength, splitPunct }?: Option) => string[];
export default splitLongText;
//# sourceMappingURL=splitLongText.d.ts.map