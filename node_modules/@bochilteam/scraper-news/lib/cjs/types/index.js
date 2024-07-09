"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerdekaSchema = exports.Liputan6Schema = exports.SuaracomSchema = exports.KompasSchema = exports.AntaraNewsSchema = exports.CNBCIndonesiaSchema = void 0;
const zod_1 = require("zod");
exports.CNBCIndonesiaSchema = zod_1.z.object({
    title: zod_1.z.string(),
    subtitle: zod_1.z.string().optional().nullable(),
    link: zod_1.z.string().url(),
    image: zod_1.z.string().url(),
    label: zod_1.z.string(),
    date: zod_1.z.string()
});
exports.AntaraNewsSchema = zod_1.z.object({
    title: zod_1.z.string(),
    link: zod_1.z.string().url(),
    image: zod_1.z.string().url(),
    label: zod_1.z.string(),
    date: zod_1.z.string()
});
exports.KompasSchema = zod_1.z.object({
    title: zod_1.z.string(),
    link: zod_1.z.string().url(),
    image: zod_1.z.string().url(),
    label: zod_1.z.string(),
    date: zod_1.z.string()
});
exports.SuaracomSchema = zod_1.z.object({
    title: zod_1.z.string(),
    link: zod_1.z.string().url(),
    image: zod_1.z.string().url(),
    description: zod_1.z.string(),
    date: zod_1.z.string()
});
exports.Liputan6Schema = zod_1.z.object({
    title: zod_1.z.string(),
    link: zod_1.z.string().url(),
    image: zod_1.z.string().url(),
    description: zod_1.z.string(),
    label: zod_1.z.string(),
    date: zod_1.z.string()
});
exports.MerdekaSchema = zod_1.z.object({
    title: zod_1.z.string(),
    link: zod_1.z.string().url(),
    image: zod_1.z.string().url(),
    label: zod_1.z.string(),
    date: zod_1.z.string()
});
