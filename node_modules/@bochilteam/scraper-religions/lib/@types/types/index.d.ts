import { z } from 'zod';
export declare const AlQuranSchema: z.ZodObject<{
    number: z.ZodNumber;
    ayatCount: z.ZodOptional<z.ZodNumber>;
    sequence: z.ZodNumber;
    asma: z.ZodObject<{
        ar: z.ZodObject<{
            short: z.ZodString;
            long: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            short: string;
            long: string;
        }, {
            short: string;
            long: string;
        }>;
        en: z.ZodObject<{
            short: z.ZodString;
            long: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            short: string;
            long: string;
        }, {
            short: string;
            long: string;
        }>;
        id: z.ZodObject<{
            short: z.ZodString;
            long: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            short: string;
            long: string;
        }, {
            short: string;
            long: string;
        }>;
        translation: z.ZodObject<{
            en: z.ZodString;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            en: string;
            id: string;
        }, {
            en: string;
            id: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        en: {
            short: string;
            long: string;
        };
        id: {
            short: string;
            long: string;
        };
        ar: {
            short: string;
            long: string;
        };
        translation: {
            en: string;
            id: string;
        };
    }, {
        en: {
            short: string;
            long: string;
        };
        id: {
            short: string;
            long: string;
        };
        ar: {
            short: string;
            long: string;
        };
        translation: {
            en: string;
            id: string;
        };
    }>;
    preBismillah: z.ZodNullable<z.ZodBoolean>;
    type: z.ZodObject<{
        ar: z.ZodString;
        id: z.ZodString;
        en: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        en: string;
        id: string;
        ar: string;
    }, {
        en: string;
        id: string;
        ar: string;
    }>;
    tafsir: z.ZodObject<{
        id: z.ZodString;
        en: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        en: string | null;
        id: string;
    }, {
        en: string | null;
        id: string;
    }>;
    recitation: z.ZodObject<{
        full: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        full: string;
    }, {
        full: string;
    }>;
    ayahs: z.ZodArray<z.ZodObject<{
        number: z.ZodObject<{
            inquran: z.ZodNumber;
            insurah: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            inquran: number;
            insurah: number;
        }, {
            inquran: number;
            insurah: number;
        }>;
        juz: z.ZodNumber;
        manzil: z.ZodNumber;
        page: z.ZodNumber;
        ruku: z.ZodNumber;
        hizbQuarter: z.ZodNumber;
        sajda: z.ZodObject<{
            recomended: z.ZodOptional<z.ZodBoolean>;
            obligatory: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            recomended?: boolean | undefined;
            obligatory: boolean;
        }, {
            recomended?: boolean | undefined;
            obligatory: boolean;
        }>;
        text: z.ZodObject<{
            ar: z.ZodString;
            read: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            ar: string;
            read: string;
        }, {
            ar: string;
            read: string;
        }>;
        translation: z.ZodObject<{
            en: z.ZodString;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            en: string;
            id: string;
        }, {
            en: string;
            id: string;
        }>;
        tafsir: z.ZodObject<{
            id: z.ZodString;
            en: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            en: string | null;
            id: string;
        }, {
            en: string | null;
            id: string;
        }>;
        audio: z.ZodObject<{
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
        }, {
            url: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        number: {
            inquran: number;
            insurah: number;
        };
        translation: {
            en: string;
            id: string;
        };
        tafsir: {
            en: string | null;
            id: string;
        };
        juz: number;
        manzil: number;
        page: number;
        ruku: number;
        hizbQuarter: number;
        sajda: {
            recomended?: boolean | undefined;
            obligatory: boolean;
        };
        text: {
            ar: string;
            read: string;
        };
        audio: {
            url: string;
        };
    }, {
        number: {
            inquran: number;
            insurah: number;
        };
        translation: {
            en: string;
            id: string;
        };
        tafsir: {
            en: string | null;
            id: string;
        };
        juz: number;
        manzil: number;
        page: number;
        ruku: number;
        hizbQuarter: number;
        sajda: {
            recomended?: boolean | undefined;
            obligatory: boolean;
        };
        text: {
            ar: string;
            read: string;
        };
        audio: {
            url: string;
        };
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    ayatCount?: number | undefined;
    number: number;
    type: {
        en: string;
        id: string;
        ar: string;
    };
    sequence: number;
    asma: {
        en: {
            short: string;
            long: string;
        };
        id: {
            short: string;
            long: string;
        };
        ar: {
            short: string;
            long: string;
        };
        translation: {
            en: string;
            id: string;
        };
    };
    preBismillah: boolean | null;
    tafsir: {
        en: string | null;
        id: string;
    };
    recitation: {
        full: string;
    };
    ayahs: {
        number: {
            inquran: number;
            insurah: number;
        };
        translation: {
            en: string;
            id: string;
        };
        tafsir: {
            en: string | null;
            id: string;
        };
        juz: number;
        manzil: number;
        page: number;
        ruku: number;
        hizbQuarter: number;
        sajda: {
            recomended?: boolean | undefined;
            obligatory: boolean;
        };
        text: {
            ar: string;
            read: string;
        };
        audio: {
            url: string;
        };
    }[];
}, {
    ayatCount?: number | undefined;
    number: number;
    type: {
        en: string;
        id: string;
        ar: string;
    };
    sequence: number;
    asma: {
        en: {
            short: string;
            long: string;
        };
        id: {
            short: string;
            long: string;
        };
        ar: {
            short: string;
            long: string;
        };
        translation: {
            en: string;
            id: string;
        };
    };
    preBismillah: boolean | null;
    tafsir: {
        en: string | null;
        id: string;
    };
    recitation: {
        full: string;
    };
    ayahs: {
        number: {
            inquran: number;
            insurah: number;
        };
        translation: {
            en: string;
            id: string;
        };
        tafsir: {
            en: string | null;
            id: string;
        };
        juz: number;
        manzil: number;
        page: number;
        ruku: number;
        hizbQuarter: number;
        sajda: {
            recomended?: boolean | undefined;
            obligatory: boolean;
        };
        text: {
            ar: string;
            read: string;
        };
        audio: {
            url: string;
        };
    }[];
}>;
export type AlQuran = z.infer<typeof AlQuranSchema>;
export declare const AsmaulHusnaArgsSchema: z.ZodObject<{
    0: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    0?: number | undefined;
}, {
    0?: number | undefined;
}>;
export declare const AsmaulHusnaSchema: z.ZodObject<{
    index: z.ZodNumber;
    latin: z.ZodString;
    arabic: z.ZodString;
    translation_id: z.ZodString;
    translation_en: z.ZodString;
}, "strip", z.ZodTypeAny, {
    index: number;
    latin: string;
    arabic: string;
    translation_id: string;
    translation_en: string;
}, {
    index: number;
    latin: string;
    arabic: string;
    translation_id: string;
    translation_en: string;
}>;
export type AsmaulHusna = z.infer<typeof AsmaulHusnaSchema>;
export declare const JadwalSholatArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const JadwalSholatItemSchema: z.ZodObject<{
    value: z.ZodString;
    kota: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
    kota: string;
}, {
    value: string;
    kota: string;
}>;
export declare const JadwalSholatSchema: z.ZodObject<{
    date: z.ZodString;
    today: z.ZodRecord<z.ZodString, z.ZodString>;
    list: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        imsyak: z.ZodString;
        shubuh: z.ZodString;
        terbit: z.ZodString;
        dhuha: z.ZodString;
        dzuhur: z.ZodString;
        ashr: z.ZodString;
        magrib: z.ZodString;
        isyak: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: string;
        imsyak: string;
        shubuh: string;
        terbit: string;
        dhuha: string;
        dzuhur: string;
        ashr: string;
        magrib: string;
        isyak: string;
    }, {
        date: string;
        imsyak: string;
        shubuh: string;
        terbit: string;
        dhuha: string;
        dzuhur: string;
        ashr: string;
        magrib: string;
        isyak: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    date: string;
    today: Record<string, string>;
    list: {
        date: string;
        imsyak: string;
        shubuh: string;
        terbit: string;
        dhuha: string;
        dzuhur: string;
        ashr: string;
        magrib: string;
        isyak: string;
    }[];
}, {
    date: string;
    today: Record<string, string>;
    list: {
        date: string;
        imsyak: string;
        shubuh: string;
        terbit: string;
        dhuha: string;
        dzuhur: string;
        ashr: string;
        magrib: string;
        isyak: string;
    }[];
}>;
export type JadwalSholatItem = z.infer<typeof JadwalSholatItemSchema>;
export type JadwalSholat = z.infer<typeof JadwalSholatSchema>;
export declare const DidYouMeanArgsSchema: z.ZodObject<{
    0: z.ZodString;
    1: z.ZodArray<z.ZodString, "many">;
    2: z.ZodOptional<z.ZodObject<{
        threshold: z.ZodOptional<z.ZodNumber>;
        opts: z.ZodOptional<z.ZodObject<{
            sensitive: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            sensitive: boolean;
        }, {
            sensitive: boolean;
        }>>;
    }, "strip", z.ZodTypeAny, {
        threshold?: number | undefined;
        opts?: {
            sensitive: boolean;
        } | undefined;
    }, {
        threshold?: number | undefined;
        opts?: {
            sensitive: boolean;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    2?: {
        threshold?: number | undefined;
        opts?: {
            sensitive: boolean;
        } | undefined;
    } | undefined;
    0: string;
    1: string[];
}, {
    2?: {
        threshold?: number | undefined;
        opts?: {
            sensitive: boolean;
        } | undefined;
    } | undefined;
    0: string;
    1: string[];
}>;
export declare const DidYouMeanSchema: z.ZodObject<{
    index: z.ZodNumber;
    query: z.ZodString;
    score: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    index: number;
    query: string;
    score: number;
}, {
    index: number;
    query: string;
    score: number;
}>;
export type DidYouMeanArgs = z.infer<typeof DidYouMeanArgsSchema>;
export type DidYouMean = z.infer<typeof DidYouMeanSchema>;
//# sourceMappingURL=index.d.ts.map