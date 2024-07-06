import { ZodiacSchema } from '../types/index.js';
export default function getZodiac(months, dates) {
    var _a;
    // https://github.com/Nurutomo/wabot-aq/blob/master/plugins/zodiac.js
    const d = new Date(1970, months - 1, dates + 1);
    // https://www.primbon.com/zodiak.htm
    const zodiac = [
        ['capricorn', new Date(1970, 0, 21)],
        ['aquarius', new Date(1970, 1, 20)],
        ['pisces', new Date(1970, 2, 21)],
        ['aries', new Date(1970, 3, 20)],
        ['taurus', new Date(1970, 4, 21)],
        ['gemini', new Date(1970, 5, 22)],
        ['cancer', new Date(1970, 6, 23)],
        ['leo', new Date(1970, 7, 24)],
        ['virgo', new Date(1970, 8, 23)],
        ['libra', new Date(1970, 9, 24)],
        ['scorpio', new Date(1970, 10, 23)],
        ['sagitarius', new Date(1970, 11, 22)] // SAGITARIUS (23 November - 21 Desember)
    ];
    return ZodiacSchema.parse((_a = zodiac.find(([_, _d]) => _d >= d)) === null || _a === void 0 ? void 0 : _a[0]);
}
