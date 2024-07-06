"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
var SPACE_REGEX = '\\s\\uFEFF\\xA0';
// https://remarkablemark.org/blog/2019/09/28/javascript-remove-punctuation/
var DEFAULT_PUNCTUATION_REGEX = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
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
var splitLongText = function (text, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.maxLength, maxLength = _c === void 0 ? 200 : _c, _d = _b.splitPunct, splitPunct = _d === void 0 ? '' : _d;
    var isSpaceOrPunct = function (s, i) {
        var regex = new RegExp('[' + SPACE_REGEX + DEFAULT_PUNCTUATION_REGEX + splitPunct + ']');
        return regex.test(s.charAt(i));
    };
    var lastIndexOfSpaceOrPunct = function (s, left, right) {
        for (var i = right; i >= left; i--) {
            if (isSpaceOrPunct(s, i))
                return i;
        }
        return -1; // not found
    };
    var result = [];
    var addResult = function (text, start, end) {
        result.push(text.slice(start, end + 1));
    };
    var start = 0;
    for (;;) {
        // check text's length
        if (text.length - start <= maxLength) {
            addResult(text, start, text.length - 1);
            break; // end of text
        }
        // check whether the word is cut in the middle.
        var end = start + maxLength - 1;
        if (isSpaceOrPunct(text, end) || isSpaceOrPunct(text, end + 1)) {
            addResult(text, start, end);
            start = end + 1;
            continue;
        }
        // find last index of space
        end = lastIndexOfSpaceOrPunct(text, start, end);
        if (end === -1) {
            var str = text.slice(start, start + maxLength);
            throw new Error('The word is too long to split into a short text:' +
                ("\n" + str + " ...") +
                '\n\nTry the option "splitPunct" to split the text by punctuation.');
        }
        // add result
        addResult(text, start, end);
        start = end + 1;
    }
    return result;
};
exports.default = splitLongText;
//# sourceMappingURL=splitLongText.js.map