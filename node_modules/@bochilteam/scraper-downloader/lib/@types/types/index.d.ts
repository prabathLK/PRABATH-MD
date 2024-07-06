import { z } from 'zod';
export declare const MediafireArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const MediafireSchema: z.ZodObject<{
    url: z.ZodString;
    url2: z.ZodString;
    filename: z.ZodString;
    filetype: z.ZodString;
    ext: z.ZodString;
    aploud: z.ZodString;
    filesizeH: z.ZodString;
    filesize: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    url: string;
    url2: string;
    filename: string;
    filetype: string;
    ext: string;
    aploud: string;
    filesizeH: string;
    filesize: number;
}, {
    url: string;
    url2: string;
    filename: string;
    filetype: string;
    ext: string;
    aploud: string;
    filesizeH: string;
    filesize: number;
}>;
export type Mediafire = z.infer<typeof MediafireSchema>;
export declare const ZippyShareArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const ZippyShareSchema: z.ZodObject<{
    url: z.ZodString;
    filename: z.ZodString;
    filesizeH: z.ZodString;
    filesize: z.ZodNumber;
    aploud: z.ZodString;
    lastDownload: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    filename: string;
    aploud: string;
    filesizeH: string;
    filesize: number;
    lastDownload: string;
}, {
    url: string;
    filename: string;
    aploud: string;
    filesizeH: string;
    filesize: number;
    lastDownload: string;
}>;
export type ZippyShareArgs = z.infer<typeof ZippyShareArgsSchema>;
export type ZippyShare = z.infer<typeof ZippyShareSchema>;
export declare const SfileMobiSearchArgsSchema: z.ZodObject<{
    0: z.ZodString;
    1: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    1?: number | undefined;
    0: string;
}, {
    1?: number | undefined;
    0: string;
}>;
export declare const SfileMobiSearchSchema: z.ZodObject<{
    url: z.ZodString;
    filename: z.ZodString;
    icon: z.ZodString;
    type: z.ZodString;
    filesizeH: z.ZodString;
    filesize: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: string;
    url: string;
    filename: string;
    filesizeH: string;
    filesize: number;
    icon: string;
}, {
    type: string;
    url: string;
    filename: string;
    filesizeH: string;
    filesize: number;
    icon: string;
}>;
export declare const SfileMobiArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const SfileMobiSchema: z.ZodObject<{
    url: z.ZodString;
    filename: z.ZodString;
    icon: z.ZodString;
    type: z.ZodString;
    mimetype: z.ZodString;
    aploud: z.ZodString;
    aploudby: z.ZodString;
    aploudbyUrl: z.ZodString;
    aploudon: z.ZodString;
    aploudonUrl: z.ZodString;
    downloads: z.ZodNumber;
    filesizeH: z.ZodString;
    filesize: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: string;
    url: string;
    filename: string;
    aploud: string;
    filesizeH: string;
    filesize: number;
    icon: string;
    mimetype: string;
    aploudby: string;
    aploudbyUrl: string;
    aploudon: string;
    aploudonUrl: string;
    downloads: number;
}, {
    type: string;
    url: string;
    filename: string;
    aploud: string;
    filesizeH: string;
    filesize: number;
    icon: string;
    mimetype: string;
    aploudby: string;
    aploudbyUrl: string;
    aploudon: string;
    aploudonUrl: string;
    downloads: number;
}>;
export type SfileMobiSearch = z.infer<typeof SfileMobiSearchSchema>;
export type SfileMobi = z.infer<typeof SfileMobiSchema>;
//# sourceMappingURL=index.d.ts.map