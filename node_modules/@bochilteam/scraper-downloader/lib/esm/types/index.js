import { z } from 'zod';
export const MediafireArgsSchema = z.object({
    0: z.string().url()
});
export const MediafireSchema = z.object({
    url: z.string().url(),
    url2: z.string().url(),
    filename: z.string(),
    filetype: z.string(),
    ext: z.string(),
    aploud: z.string(),
    filesizeH: z.string(),
    filesize: z.number()
});
export const ZippyShareArgsSchema = z.object({
    0: z.string().url()
});
export const ZippyShareSchema = z.object({
    url: z.string().url(),
    // url2: z.string().url(),
    filename: z.string(),
    filesizeH: z.string(),
    filesize: z.number(),
    aploud: z.string(),
    lastDownload: z.string()
});
export const SfileMobiSearchArgsSchema = z.object({
    0: z.string(),
    1: z.number().min(0).optional()
});
export const SfileMobiSearchSchema = z.object({
    url: z.string().url(),
    filename: z.string(),
    icon: z.string().url(),
    type: z.string(),
    filesizeH: z.string(),
    filesize: z.number()
});
export const SfileMobiArgsSchema = z.object({
    0: z.string().url()
});
export const SfileMobiSchema = z.object({
    url: z.string().url(),
    filename: z.string(),
    icon: z.string(),
    type: z.string(),
    mimetype: z.string(),
    aploud: z.string(),
    aploudby: z.string(),
    aploudbyUrl: z.string().url(),
    aploudon: z.string(),
    aploudonUrl: z.string().url(),
    downloads: z.number(),
    filesizeH: z.string(),
    filesize: z.number()
});
