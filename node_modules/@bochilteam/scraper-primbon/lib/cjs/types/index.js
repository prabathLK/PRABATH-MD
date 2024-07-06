"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodiacSchema = exports.NomerHokiSchema = exports.ArtiNamaSchema = exports.ArtiMimpiSchema = void 0;
const zod_1 = require("zod");
exports.ArtiMimpiSchema = zod_1.z.string();
exports.ArtiNamaSchema = zod_1.z.string();
exports.NomerHokiSchema = zod_1.z.object({
    nomer: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]),
    angka_bagua_shuzi: zod_1.z.number(),
    positif: zod_1.z.object({
        kekayaan: zod_1.z.number(),
        kesehatan: zod_1.z.number(),
        cinta: zod_1.z.number(),
        kestabilan: zod_1.z.number(),
        positif: zod_1.z.number(),
    }),
    negatif: zod_1.z.object({
        perselisihan: zod_1.z.number(),
        kehilangan: zod_1.z.number(),
        malapetaka: zod_1.z.number(),
        Kehancuran: zod_1.z.number(),
        negatif: zod_1.z.number(),
    }),
});
exports.ZodiacSchema = zod_1.z.enum([
    'capricorn',
    'aquarius',
    'pisces',
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
    'scorpio',
    'sagitarius',
]);
