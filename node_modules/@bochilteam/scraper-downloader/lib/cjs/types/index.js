"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SfileMobiSchema = exports.SfileMobiArgsSchema = exports.SfileMobiSearchSchema = exports.SfileMobiSearchArgsSchema = exports.ZippyShareSchema = exports.ZippyShareArgsSchema = exports.MediafireSchema = exports.MediafireArgsSchema = void 0;
const zod_1 = require("zod");
exports.MediafireArgsSchema = zod_1.z.object({
    0: zod_1.z.string().url()
});
exports.MediafireSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    url2: zod_1.z.string().url(),
    filename: zod_1.z.string(),
    filetype: zod_1.z.string(),
    ext: zod_1.z.string(),
    aploud: zod_1.z.string(),
    filesizeH: zod_1.z.string(),
    filesize: zod_1.z.number()
});
exports.ZippyShareArgsSchema = zod_1.z.object({
    0: zod_1.z.string().url()
});
exports.ZippyShareSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    // url2: z.string().url(),
    filename: zod_1.z.string(),
    filesizeH: zod_1.z.string(),
    filesize: zod_1.z.number(),
    aploud: zod_1.z.string(),
    lastDownload: zod_1.z.string()
});
exports.SfileMobiSearchArgsSchema = zod_1.z.object({
    0: zod_1.z.string(),
    1: zod_1.z.number().min(0).optional()
});
exports.SfileMobiSearchSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    filename: zod_1.z.string(),
    icon: zod_1.z.string().url(),
    type: zod_1.z.string(),
    filesizeH: zod_1.z.string(),
    filesize: zod_1.z.number()
});
exports.SfileMobiArgsSchema = zod_1.z.object({
    0: zod_1.z.string().url()
});
exports.SfileMobiSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    filename: zod_1.z.string(),
    icon: zod_1.z.string(),
    type: zod_1.z.string(),
    mimetype: zod_1.z.string(),
    aploud: zod_1.z.string(),
    aploudby: zod_1.z.string(),
    aploudbyUrl: zod_1.z.string().url(),
    aploudon: zod_1.z.string(),
    aploudonUrl: zod_1.z.string().url(),
    downloads: zod_1.z.number(),
    filesizeH: zod_1.z.string(),
    filesize: zod_1.z.number()
});
