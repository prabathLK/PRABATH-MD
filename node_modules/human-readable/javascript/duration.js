'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// const ACTUAL_YEAR_DAYS = 365.242199
const GREGORIAN_YEAR_DAYS = 365.242500;
exports.DUR_MS = 1;
exports.DUR_S = 1000 * exports.DUR_MS;
exports.DUR_M = 60 * exports.DUR_S;
exports.DUR_H = 60 * exports.DUR_M;
exports.DUR_D = 24 * exports.DUR_H;
exports.DUR_W = 7 * exports.DUR_D;
exports.DUR_MO = GREGORIAN_YEAR_DAYS / 12 * exports.DUR_D;
exports.DUR_Y = GREGORIAN_YEAR_DAYS * exports.DUR_D;
const Units = [
    ['y', exports.DUR_Y],
    ['mo', exports.DUR_MO],
    ['w', exports.DUR_W],
    ['d', exports.DUR_D],
    ['h', exports.DUR_H],
    ['m', exports.DUR_M],
    ['s', exports.DUR_S],
    ['ms', exports.DUR_MS],
];
const defaultOptions = {
    allowMultiples: ['y', 'mo', 'd', 'h', 'm', 's'],
    keepNonLeadingZeroes: false,
    render(parts) {
        return parts.map(({ literal, symbol }) => `${literal}${symbol}`).join(' ');
    },
};
function durationFormatter(options) {
    const opt = Object.assign({}, defaultOptions, options);
    const allowMultiples = new Set(opt.allowMultiples.map(a => a.toLowerCase()));
    return function (n) {
        const parts = [];
        const short = { literal: '0', symbol: 'ms' };
        let sign = '';
        if (n < 0) {
            sign = '−';
            n = -n;
        }
        for (const [a, b] of Units) {
            if (allowMultiples.has(a)) {
                if (n >= b) {
                    parts.push({ literal: '' + Math.floor(n / b), symbol: a });
                    n %= b;
                }
                else if (!parts.length) {
                    short.symbol = a;
                }
                else if (opt.keepNonLeadingZeroes) {
                    parts.push({ literal: '0', symbol: a });
                }
            }
        }
        if (sign && parts.length && parts[0].literal != '0') {
            parts[0].literal = sign + parts[0].literal;
        }
        return opt.render(parts.length ? parts : [short]);
    };
}
exports.durationFormatter = durationFormatter;
