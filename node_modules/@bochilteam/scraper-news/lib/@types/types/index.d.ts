import { z } from 'zod';
export declare const CNBCIndonesiaSchema: z.ZodObject<{
    title: z.ZodString;
    subtitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    link: z.ZodString;
    image: z.ZodString;
    label: z.ZodString;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    subtitle?: string | null | undefined;
    title: string;
    link: string;
    image: string;
    label: string;
    date: string;
}, {
    subtitle?: string | null | undefined;
    title: string;
    link: string;
    image: string;
    label: string;
    date: string;
}>;
export type CNBCIndonesia = z.infer<typeof CNBCIndonesiaSchema>;
export declare const AntaraNewsSchema: z.ZodObject<{
    title: z.ZodString;
    link: z.ZodString;
    image: z.ZodString;
    label: z.ZodString;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    link: string;
    image: string;
    label: string;
    date: string;
}, {
    title: string;
    link: string;
    image: string;
    label: string;
    date: string;
}>;
export type AntaraNews = z.infer<typeof AntaraNewsSchema>;
export declare const KompasSchema: z.ZodObject<{
    title: z.ZodString;
    link: z.ZodString;
    image: z.ZodString;
    label: z.ZodString;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    link: string;
    image: string;
    label: string;
    date: string;
}, {
    title: string;
    link: string;
    image: string;
    label: string;
    date: string;
}>;
export type Kompas = z.infer<typeof KompasSchema>;
export declare const SuaracomSchema: z.ZodObject<{
    title: z.ZodString;
    link: z.ZodString;
    image: z.ZodString;
    description: z.ZodString;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    link: string;
    image: string;
    date: string;
    description: string;
}, {
    title: string;
    link: string;
    image: string;
    date: string;
    description: string;
}>;
export type Suaracom = z.infer<typeof SuaracomSchema>;
export declare const Liputan6Schema: z.ZodObject<{
    title: z.ZodString;
    link: z.ZodString;
    image: z.ZodString;
    description: z.ZodString;
    label: z.ZodString;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    link: string;
    image: string;
    label: string;
    date: string;
    description: string;
}, {
    title: string;
    link: string;
    image: string;
    label: string;
    date: string;
    description: string;
}>;
export type Liputan6 = z.infer<typeof Liputan6Schema>;
export declare const MerdekaSchema: z.ZodObject<{
    title: z.ZodString;
    link: z.ZodString;
    image: z.ZodString;
    label: z.ZodString;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    link: string;
    image: string;
    label: string;
    date: string;
}, {
    title: string;
    link: string;
    image: string;
    label: string;
    date: string;
}>;
export type Merdeka = z.infer<typeof MerdekaSchema>;
//# sourceMappingURL=index.d.ts.map