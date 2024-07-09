"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TekaTekiSchema = exports.TebakTebakanSchema = exports.TebakLirikSchema = exports.TebakKimiaSchema = exports.TebakKataSchema = exports.TebakKabupatenSchema = exports.TebakGambarSchema = exports.TebakBenderaSchema = exports.SusunKataSchema = exports.SiapakahAkuSchema = exports.Family100Schema = exports.CakLontongSchema = exports.AsahOtakSchema = void 0;
const zod_1 = require("zod");
exports.AsahOtakSchema = zod_1.z.object({
    index: zod_1.z.number(),
    soal: zod_1.z.string(),
    jawaban: zod_1.z.string()
});
exports.CakLontongSchema = zod_1.z.object({
    index: zod_1.z.number(),
    soal: zod_1.z.string(),
    jawaban: zod_1.z.string(),
    deskripsi: zod_1.z.string()
});
exports.Family100Schema = zod_1.z.object({
    soal: zod_1.z.string(),
    jawaban: zod_1.z.array(zod_1.z.string())
});
exports.SiapakahAkuSchema = zod_1.z.object({
    index: zod_1.z.number(),
    soal: zod_1.z.string(),
    jawaban: zod_1.z.string()
});
exports.SusunKataSchema = zod_1.z.object({
    index: zod_1.z.number(),
    soal: zod_1.z.string(),
    tipe: zod_1.z.string(),
    jawaban: zod_1.z.string()
});
exports.TebakBenderaSchema = zod_1.z.object({
    flag: zod_1.z.string(),
    img: zod_1.z.string(),
    name: zod_1.z.string()
});
exports.TebakGambarSchema = zod_1.z.object({
    index: zod_1.z.number(),
    img: zod_1.z.string(),
    jawaban: zod_1.z.string(),
    deskripsi: zod_1.z.string()
});
exports.TebakKabupatenSchema = zod_1.z.object({
    index: zod_1.z.number(),
    title: zod_1.z.string(),
    url: zod_1.z.string()
});
exports.TebakKataSchema = zod_1.z.object({
    index: zod_1.z.number(),
    soal: zod_1.z.string(),
    jawaban: zod_1.z.string()
});
exports.TebakKimiaSchema = zod_1.z.object({
    unsur: zod_1.z.string(),
    lambang: zod_1.z.string()
});
exports.TebakLirikSchema = zod_1.z.object({
    soal: zod_1.z.string(),
    jawaban: zod_1.z.string()
});
exports.TebakTebakanSchema = zod_1.z.object({
    soal: zod_1.z.string(),
    jawaban: zod_1.z.string()
});
exports.TekaTekiSchema = zod_1.z.object({
    soal: zod_1.z.string(),
    jawaban: zod_1.z.string()
});
