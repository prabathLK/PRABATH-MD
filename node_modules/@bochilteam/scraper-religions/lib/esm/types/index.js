import { z } from 'zod';
const AlQuranTranslationSchema = z.object({
    en: z.string(),
    id: z.string()
});
const AlQuranTafsirSchema = z.object({
    id: z.string(),
    en: z.string().nullable()
});
const AlQuranAsmaSchema = z.object({
    short: z.string(),
    long: z.string()
});
export const AlQuranSchema = z.object({
    number: z.number(),
    ayatCount: z.number().optional(),
    sequence: z.number(),
    asma: z.object({
        ar: AlQuranAsmaSchema,
        en: AlQuranAsmaSchema,
        id: AlQuranAsmaSchema,
        translation: AlQuranTranslationSchema
    }),
    preBismillah: z.boolean().nullable(),
    type: z.object({
        ar: z.string(),
        id: z.string(),
        en: z.string()
    }),
    tafsir: AlQuranTafsirSchema,
    recitation: z.object({
        full: z.string()
    }),
    ayahs: z.array(z.object({
        number: z.object({
            inquran: z.number(),
            insurah: z.number()
        }),
        juz: z.number(),
        manzil: z.number(),
        page: z.number(),
        ruku: z.number(),
        hizbQuarter: z.number(),
        sajda: z.object({
            recomended: z.boolean().optional(),
            obligatory: z.boolean()
        }),
        text: z.object({
            ar: z.string(),
            read: z.string()
        }),
        translation: AlQuranTranslationSchema,
        tafsir: AlQuranTafsirSchema,
        audio: z.object({
            url: z.string().url()
        })
    }))
});
export const AsmaulHusnaArgsSchema = z.object({
    0: z.number().min(1).max(99).optional()
});
export const AsmaulHusnaSchema = z.object({
    index: z.number(),
    latin: z.string(),
    arabic: z.string(),
    translation_id: z.string(),
    translation_en: z.string()
});
export const JadwalSholatArgsSchema = z.object({
    0: z.string()
});
export const JadwalSholatItemSchema = z.object({
    value: z.string(),
    kota: z.string()
});
export const JadwalSholatSchema = z.object({
    date: z.string(),
    today: z.record(z.string()),
    list: z.object({
        date: z.string(),
        imsyak: z.string(),
        shubuh: z.string(),
        terbit: z.string(),
        dhuha: z.string(),
        dzuhur: z.string(),
        ashr: z.string(),
        magrib: z.string(),
        isyak: z.string()
    }).array()
});
export const DidYouMeanArgsSchema = z.object({
    0: z.string(),
    1: z.array(z.string()),
    2: z.object({
        threshold: z.number().min(0).max(1).optional(),
        opts: z.object({
            sensitive: z.boolean()
        }).optional()
    }).optional()
});
export const DidYouMeanSchema = z.object({
    index: z.number(),
    query: z.string(),
    score: z.number().min(0).max(1)
});
