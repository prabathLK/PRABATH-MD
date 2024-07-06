import { z } from 'zod';
export declare const BioskopNowSchema: z.ZodObject<{
    title: z.ZodString;
    img: z.ZodString;
    url: z.ZodString;
    genre: z.ZodString;
    duration: z.ZodString;
    playingAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    img: string;
    url: string;
    genre: string;
    duration: string;
    playingAt: string;
}, {
    title: string;
    img: string;
    url: string;
    genre: string;
    duration: string;
    playingAt: string;
}>;
export declare const BioskopArgsSchema: z.ZodObject<{
    0: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    0?: string | number | undefined;
}, {
    0?: string | number | undefined;
}>;
export declare const BioskopSchema: z.ZodObject<{
    title: z.ZodString;
    img: z.ZodString;
    url: z.ZodString;
    genre: z.ZodString;
    duration: z.ZodString;
    release: z.ZodString;
    director: z.ZodString;
    cast: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    img: string;
    url: string;
    genre: string;
    duration: string;
    release: string;
    director: string;
    cast: string;
}, {
    title: string;
    img: string;
    url: string;
    genre: string;
    duration: string;
    release: string;
    director: string;
    cast: string;
}>;
export type BioskopNow = z.infer<typeof BioskopNowSchema>;
export type BioskopArgs = z.infer<typeof BioskopArgsSchema>;
export type Bioskop = z.infer<typeof BioskopSchema>;
export declare const ChordArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const ChordSchema: z.ZodObject<{
    url: z.ZodString;
    artist: z.ZodString;
    artistUrl: z.ZodUnion<[z.ZodString, z.ZodString]>;
    title: z.ZodString;
    chord: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    url: string;
    artist: string;
    artistUrl: string;
    chord: string;
}, {
    title: string;
    url: string;
    artist: string;
    artistUrl: string;
    chord: string;
}>;
export type ChordArgs = z.infer<typeof ChordArgsSchema>;
export type Chord = z.infer<typeof ChordSchema>;
export declare const NameFreeFireArgsSchema: z.ZodObject<{
    0: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
}, "strip", z.ZodTypeAny, {
    0: string | number;
}, {
    0: string | number;
}>;
export declare const NameFreeFireSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    username: string;
}, {
    id: string;
    username: string;
}>;
export type NameFreeFireArgs = z.infer<typeof NameFreeFireArgsSchema>;
export type NameFreeFire = z.infer<typeof NameFreeFireSchema>;
export declare const ResultJadwalTVSchema: z.ZodObject<{
    date: z.ZodString;
    event: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string;
    event: string;
}, {
    date: string;
    event: string;
}>;
export declare const JadwalTVArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const JadwalTVSchema: z.ZodObject<{
    channel: z.ZodString;
    result: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        event: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        date: string;
        event: string;
    }, {
        date: string;
        event: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    channel: string;
    result: {
        date: string;
        event: string;
    }[];
}, {
    channel: string;
    result: {
        date: string;
        event: string;
    }[];
}>;
export declare const JadwalTVNOWSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
    date: z.ZodString;
    event: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string;
    event: string;
}, {
    date: string;
    event: string;
}>, "many">>;
export type ResultJadwalTV = z.infer<typeof ResultJadwalTVSchema>;
export type JadwalTVArgs = z.infer<typeof JadwalTVArgsSchema>;
export type JadwalTV = z.infer<typeof JadwalTVSchema>;
export type JadwalTVNOW = z.infer<typeof JadwalTVNOWSchema>;
export declare const KbbiArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const KbbiSchema: z.ZodObject<{
    index: z.ZodNumber;
    title: z.ZodString;
    means: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    index: number;
    means: string[];
}, {
    title: string;
    index: number;
    means: string[];
}>;
export type KbbiArgs = z.infer<typeof KbbiArgsSchema>;
export type Kbbi = z.infer<typeof KbbiSchema>;
export declare const LyricsArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const LyricsSchema: z.ZodObject<{
    title: z.ZodString;
    author: z.ZodString;
    lyrics: z.ZodString;
    link: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    author: string;
    lyrics: string;
    link: string;
}, {
    title: string;
    author: string;
    lyrics: string;
    link: string;
}>;
export type LyricsArgs = z.infer<typeof LyricsArgsSchema>;
export type Lyrics = z.infer<typeof LyricsSchema>;
export declare const WikipediaArgsSchema: z.ZodObject<{
    0: z.ZodString;
    1: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
    1: string;
}, {
    0: string;
    1: string;
}>;
export declare const WikipediaSchema: z.ZodObject<{
    title: z.ZodString;
    img: z.ZodString;
    articles: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    img: string;
    articles: string;
}, {
    title: string;
    img: string;
    articles: string;
}>;
export type WikipediaArgs = z.infer<typeof WikipediaArgsSchema>;
export type Wikipedia = z.infer<typeof WikipediaSchema>;
//# sourceMappingURL=index.d.ts.map