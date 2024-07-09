"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assertInputTypes = function (text, lang, slow, host) {
    if (typeof text !== 'string' || text.length === 0) {
        throw new TypeError('text should be a string');
    }
    if (typeof lang !== 'string' || lang.length === 0) {
        throw new TypeError('lang should be a string');
    }
    if (typeof slow !== 'boolean') {
        throw new TypeError('slow should be a boolean');
    }
    if (typeof host !== 'string' || host.length === 0) {
        throw new TypeError('host should be a string');
    }
};
exports.default = assertInputTypes;
//# sourceMappingURL=assertInputTypes.js.map