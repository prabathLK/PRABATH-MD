import { z } from 'zod';
export const BioskopNowSchema = z.object({
    title: z.string(),
    img: z.string().url(),
    url: z.string().url(),
    genre: z.string(),
    duration: z.string(),
    playingAt: z.string()
});
export const BioskopArgsSchema = z.object({
    0: z.number().or(z.string()).optional()
});
export const BioskopSchema = z.object({
    title: z.string(),
    img: z.string().url(),
    url: z.string().url(),
    genre: z.string(),
    duration: z.string(),
    release: z.string(),
    director: z.string(),
    cast: z.string()
});
export const ChordArgsSchema = z.object({
    0: z.string()
});
export const ChordSchema = z.object({
    url: z.string().url(),
    artist: z.string(),
    artistUrl: z.string().url().or(z.string()),
    title: z.string(),
    chord: z.string()
});
export const NameFreeFireArgsSchema = z.object({
    0: z.string().or(z.number())
});
export const NameFreeFireSchema = z.object({
    id: z.string(),
    username: z.string()
});
export const ResultJadwalTVSchema = z.object({
    date: z.string(),
    event: z.string()
});
export const JadwalTVArgsSchema = z.object({
    0: z.string()
});
export const JadwalTVSchema = z.object({
    channel: z.string(),
    result: ResultJadwalTVSchema.array()
});
export const JadwalTVNOWSchema = z.record(ResultJadwalTVSchema.array());
export const KbbiArgsSchema = z.object({
    0: z.string()
});
export const KbbiSchema = z.object({
    index: z.number(),
    title: z.string(),
    means: z.string().array().min(1)
});
export const LyricsArgsSchema = z.object({
    0: z.string()
});
export const LyricsSchema = z.object({
    title: z.string(),
    author: z.string(),
    lyrics: z.string(),
    link: z.string()
});
export const WikipediaArgsSchema = z.object({
    0: z.string(),
    1: z.string()
});
export const WikipediaSchema = z.object({
    title: z.string(),
    img: z.string().url(),
    articles: z.string()
});
