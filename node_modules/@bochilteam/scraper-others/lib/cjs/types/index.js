"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikipediaSchema = exports.WikipediaArgsSchema = exports.LyricsSchema = exports.LyricsArgsSchema = exports.KbbiSchema = exports.KbbiArgsSchema = exports.JadwalTVNOWSchema = exports.JadwalTVSchema = exports.JadwalTVArgsSchema = exports.ResultJadwalTVSchema = exports.NameFreeFireSchema = exports.NameFreeFireArgsSchema = exports.ChordSchema = exports.ChordArgsSchema = exports.BioskopSchema = exports.BioskopArgsSchema = exports.BioskopNowSchema = void 0;
const zod_1 = require("zod");
exports.BioskopNowSchema = zod_1.z.object({
    title: zod_1.z.string(),
    img: zod_1.z.string().url(),
    url: zod_1.z.string().url(),
    genre: zod_1.z.string(),
    duration: zod_1.z.string(),
    playingAt: zod_1.z.string()
});
exports.BioskopArgsSchema = zod_1.z.object({
    0: zod_1.z.number().or(zod_1.z.string()).optional()
});
exports.BioskopSchema = zod_1.z.object({
    title: zod_1.z.string(),
    img: zod_1.z.string().url(),
    url: zod_1.z.string().url(),
    genre: zod_1.z.string(),
    duration: zod_1.z.string(),
    release: zod_1.z.string(),
    director: zod_1.z.string(),
    cast: zod_1.z.string()
});
exports.ChordArgsSchema = zod_1.z.object({
    0: zod_1.z.string()
});
exports.ChordSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    artist: zod_1.z.string(),
    artistUrl: zod_1.z.string().url().or(zod_1.z.string()),
    title: zod_1.z.string(),
    chord: zod_1.z.string()
});
exports.NameFreeFireArgsSchema = zod_1.z.object({
    0: zod_1.z.string().or(zod_1.z.number())
});
exports.NameFreeFireSchema = zod_1.z.object({
    id: zod_1.z.string(),
    username: zod_1.z.string()
});
exports.ResultJadwalTVSchema = zod_1.z.object({
    date: zod_1.z.string(),
    event: zod_1.z.string()
});
exports.JadwalTVArgsSchema = zod_1.z.object({
    0: zod_1.z.string()
});
exports.JadwalTVSchema = zod_1.z.object({
    channel: zod_1.z.string(),
    result: exports.ResultJadwalTVSchema.array()
});
exports.JadwalTVNOWSchema = zod_1.z.record(exports.ResultJadwalTVSchema.array());
exports.KbbiArgsSchema = zod_1.z.object({
    0: zod_1.z.string()
});
exports.KbbiSchema = zod_1.z.object({
    index: zod_1.z.number(),
    title: zod_1.z.string(),
    means: zod_1.z.string().array().min(1)
});
exports.LyricsArgsSchema = zod_1.z.object({
    0: zod_1.z.string()
});
exports.LyricsSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    lyrics: zod_1.z.string(),
    link: zod_1.z.string()
});
exports.WikipediaArgsSchema = zod_1.z.object({
    0: zod_1.z.string(),
    1: zod_1.z.string()
});
exports.WikipediaSchema = zod_1.z.object({
    title: zod_1.z.string(),
    img: zod_1.z.string().url(),
    articles: zod_1.z.string()
});
