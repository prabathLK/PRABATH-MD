'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// 10ⁿ
exports.DEC_K = 1e3;
exports.DEC_M = 1e6;
exports.DEC_G = 1e9;
exports.DEC_T = 1e12;
exports.DEC_P = 1e15;
// 2ⁿ
exports.K = 2 ** 10;
exports.M = 2 ** 20;
exports.G = 2 ** 30;
exports.T = 2 ** 40;
exports.P = 2 ** 50;
const SI = [
    ['P', exports.DEC_P],
    ['T', exports.DEC_T],
    ['G', exports.DEC_G],
    ['M', exports.DEC_M],
    ['k', exports.DEC_K],
];
const IEC = [
    ['Pi', exports.P],
    ['Ti', exports.T],
    ['Gi', exports.G],
    ['Mi', exports.M],
    ['Ki', exports.K],
];
const JEDEC = [
    ['P', exports.P],
    ['T', exports.T],
    ['G', exports.G],
    ['M', exports.M],
    ['K', exports.K],
];
const Standards = {
    SI,
    IEC,
    JEDEC,
};
function isStandardName(std) {
    return std === 'SI' || std === 'IEC' || std === 'JEDEC';
}
const one = /^−?1$/;
const defaultOptions = {
    std: 'SI',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    allowMultiples: ['K', 'M', 'G', 'T', 'P'],
    render(literal, symbol) {
        if (symbol)
            return `${literal} ${symbol}B`;
        return `${literal} ${one.test(literal) ? 'byte' : 'bytes'}`;
    },
};
const trailingZeroes = /\.?0*$/;
function toFixed(n, decimalPlaces, keepTrailingZeroes) {
    const a = n.toFixed(decimalPlaces);
    if (keepTrailingZeroes)
        return a;
    return a.replace(trailingZeroes, '');
}
function sizeFormatter(options) {
    const opt = Object.assign({}, defaultOptions, options);
    if (!isStandardName(opt.std)) {
        throw Error(`Unknown std '${opt.std}'`);
    }
    const allowMultiples = new Set;
    opt.allowMultiples.forEach(a => {
        allowMultiples.add(a.toUpperCase());
        allowMultiples.add(a.toLowerCase());
    });
    return function (n) {
        let sign = '';
        if (n < 0) {
            sign = '−';
            n = -n;
        }
        let literal = '' + n;
        let symbol = '';
        for (const [a, b] of Standards[opt.std]) {
            if (n >= b && allowMultiples.has(a[0])) {
                literal = toFixed(n / b, opt.decimalPlaces, opt.keepTrailingZeroes);
                symbol = a;
                break;
            }
        }
        return opt.render(sign + literal, symbol);
    };
}
exports.sizeFormatter = sizeFormatter;
