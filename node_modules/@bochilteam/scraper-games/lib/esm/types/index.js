import { z } from 'zod';
export const AsahOtakSchema = z.object({
    index: z.number(),
    soal: z.string(),
    jawaban: z.string()
});
export const CakLontongSchema = z.object({
    index: z.number(),
    soal: z.string(),
    jawaban: z.string(),
    deskripsi: z.string()
});
export const Family100Schema = z.object({
    soal: z.string(),
    jawaban: z.array(z.string())
});
export const SiapakahAkuSchema = z.object({
    index: z.number(),
    soal: z.string(),
    jawaban: z.string()
});
export const SusunKataSchema = z.object({
    index: z.number(),
    soal: z.string(),
    tipe: z.string(),
    jawaban: z.string()
});
export const TebakBenderaSchema = z.object({
    flag: z.string(),
    img: z.string(),
    name: z.string()
});
export const TebakGambarSchema = z.object({
    index: z.number(),
    img: z.string(),
    jawaban: z.string(),
    deskripsi: z.string()
});
export const TebakKabupatenSchema = z.object({
    index: z.number(),
    title: z.string(),
    url: z.string()
});
export const TebakKataSchema = z.object({
    index: z.number(),
    soal: z.string(),
    jawaban: z.string()
});
export const TebakKimiaSchema = z.object({
    unsur: z.string(),
    lambang: z.string()
});
export const TebakLirikSchema = z.object({
    soal: z.string(),
    jawaban: z.string()
});
export const TebakTebakanSchema = z.object({
    soal: z.string(),
    jawaban: z.string()
});
export const TekaTekiSchema = z.object({
    soal: z.string(),
    jawaban: z.string()
});
