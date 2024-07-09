import { z } from 'zod';
export declare const ArtiMimpiSchema: z.ZodString;
export type ArtiMimpi = z.infer<typeof ArtiMimpiSchema>;
export declare const ArtiNamaSchema: z.ZodString;
export type ArtiNama = z.infer<typeof ArtiNamaSchema>;
export declare const NomerHokiSchema: z.ZodObject<{
    nomer: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    angka_bagua_shuzi: z.ZodNumber;
    positif: z.ZodObject<{
        kekayaan: z.ZodNumber;
        kesehatan: z.ZodNumber;
        cinta: z.ZodNumber;
        kestabilan: z.ZodNumber;
        positif: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        positif: number;
        kekayaan: number;
        kesehatan: number;
        cinta: number;
        kestabilan: number;
    }, {
        positif: number;
        kekayaan: number;
        kesehatan: number;
        cinta: number;
        kestabilan: number;
    }>;
    negatif: z.ZodObject<{
        perselisihan: z.ZodNumber;
        kehilangan: z.ZodNumber;
        malapetaka: z.ZodNumber;
        Kehancuran: z.ZodNumber;
        negatif: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        negatif: number;
        perselisihan: number;
        kehilangan: number;
        malapetaka: number;
        Kehancuran: number;
    }, {
        negatif: number;
        perselisihan: number;
        kehilangan: number;
        malapetaka: number;
        Kehancuran: number;
    }>;
}, "strip", z.ZodTypeAny, {
    nomer: string | number;
    angka_bagua_shuzi: number;
    positif: {
        positif: number;
        kekayaan: number;
        kesehatan: number;
        cinta: number;
        kestabilan: number;
    };
    negatif: {
        negatif: number;
        perselisihan: number;
        kehilangan: number;
        malapetaka: number;
        Kehancuran: number;
    };
}, {
    nomer: string | number;
    angka_bagua_shuzi: number;
    positif: {
        positif: number;
        kekayaan: number;
        kesehatan: number;
        cinta: number;
        kestabilan: number;
    };
    negatif: {
        negatif: number;
        perselisihan: number;
        kehilangan: number;
        malapetaka: number;
        Kehancuran: number;
    };
}>;
export type NomerHoki = z.infer<typeof NomerHokiSchema>;
export declare const ZodiacSchema: z.ZodEnum<["capricorn", "aquarius", "pisces", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagitarius"]>;
export type Zodiac = z.infer<typeof ZodiacSchema>;
//# sourceMappingURL=index.d.ts.map