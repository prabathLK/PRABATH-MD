import { z } from 'zod';
export declare const AsahOtakSchema: z.ZodObject<{
    index: z.ZodNumber;
    soal: z.ZodString;
    jawaban: z.ZodString;
}, "strip", z.ZodTypeAny, {
    index: number;
    soal: string;
    jawaban: string;
}, {
    index: number;
    soal: string;
    jawaban: string;
}>;
export type AsahOtak = z.infer<typeof AsahOtakSchema>;
export declare const CakLontongSchema: z.ZodObject<{
    index: z.ZodNumber;
    soal: z.ZodString;
    jawaban: z.ZodString;
    deskripsi: z.ZodString;
}, "strip", z.ZodTypeAny, {
    index: number;
    soal: string;
    jawaban: string;
    deskripsi: string;
}, {
    index: number;
    soal: string;
    jawaban: string;
    deskripsi: string;
}>;
export type CakLontong = z.infer<typeof CakLontongSchema>;
export declare const Family100Schema: z.ZodObject<{
    soal: z.ZodString;
    jawaban: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    soal: string;
    jawaban: string[];
}, {
    soal: string;
    jawaban: string[];
}>;
export type Family100 = z.infer<typeof Family100Schema>;
export declare const SiapakahAkuSchema: z.ZodObject<{
    index: z.ZodNumber;
    soal: z.ZodString;
    jawaban: z.ZodString;
}, "strip", z.ZodTypeAny, {
    index: number;
    soal: string;
    jawaban: string;
}, {
    index: number;
    soal: string;
    jawaban: string;
}>;
export type SiapakahAku = z.infer<typeof SiapakahAkuSchema>;
export declare const SusunKataSchema: z.ZodObject<{
    index: z.ZodNumber;
    soal: z.ZodString;
    tipe: z.ZodString;
    jawaban: z.ZodString;
}, "strip", z.ZodTypeAny, {
    index: number;
    soal: string;
    jawaban: string;
    tipe: string;
}, {
    index: number;
    soal: string;
    jawaban: string;
    tipe: string;
}>;
export type SusunKata = z.infer<typeof SusunKataSchema>;
export declare const TebakBenderaSchema: z.ZodObject<{
    flag: z.ZodString;
    img: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    flag: string;
    img: string;
    name: string;
}, {
    flag: string;
    img: string;
    name: string;
}>;
export type TebakBendera = z.infer<typeof TebakBenderaSchema>;
export declare const TebakGambarSchema: z.ZodObject<{
    index: z.ZodNumber;
    img: z.ZodString;
    jawaban: z.ZodString;
    deskripsi: z.ZodString;
}, "strip", z.ZodTypeAny, {
    index: number;
    jawaban: string;
    deskripsi: string;
    img: string;
}, {
    index: number;
    jawaban: string;
    deskripsi: string;
    img: string;
}>;
export type TebakGambar = z.infer<typeof TebakGambarSchema>;
export declare const TebakKabupatenSchema: z.ZodObject<{
    index: z.ZodNumber;
    title: z.ZodString;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    index: number;
    title: string;
    url: string;
}, {
    index: number;
    title: string;
    url: string;
}>;
export type TebakKabupaten = z.infer<typeof TebakKabupatenSchema>;
export declare const TebakKataSchema: z.ZodObject<{
    index: z.ZodNumber;
    soal: z.ZodString;
    jawaban: z.ZodString;
}, "strip", z.ZodTypeAny, {
    index: number;
    soal: string;
    jawaban: string;
}, {
    index: number;
    soal: string;
    jawaban: string;
}>;
export type TebakKata = z.infer<typeof TebakKataSchema>;
export declare const TebakKimiaSchema: z.ZodObject<{
    unsur: z.ZodString;
    lambang: z.ZodString;
}, "strip", z.ZodTypeAny, {
    unsur: string;
    lambang: string;
}, {
    unsur: string;
    lambang: string;
}>;
export type TebakKimia = z.infer<typeof TebakKimiaSchema>;
export declare const TebakLirikSchema: z.ZodObject<{
    soal: z.ZodString;
    jawaban: z.ZodString;
}, "strip", z.ZodTypeAny, {
    soal: string;
    jawaban: string;
}, {
    soal: string;
    jawaban: string;
}>;
export type TebakLirik = z.infer<typeof TebakLirikSchema>;
export declare const TebakTebakanSchema: z.ZodObject<{
    soal: z.ZodString;
    jawaban: z.ZodString;
}, "strip", z.ZodTypeAny, {
    soal: string;
    jawaban: string;
}, {
    soal: string;
    jawaban: string;
}>;
export type TebakTebakan = z.infer<typeof TebakTebakanSchema>;
export declare const TekaTekiSchema: z.ZodObject<{
    soal: z.ZodString;
    jawaban: z.ZodString;
}, "strip", z.ZodTypeAny, {
    soal: string;
    jawaban: string;
}, {
    soal: string;
    jawaban: string;
}>;
export type TekaTeki = z.infer<typeof TekaTekiSchema>;
//# sourceMappingURL=index.d.ts.map