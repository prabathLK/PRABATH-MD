import { z } from 'zod';
export const CNBCIndonesiaSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional().nullable(),
    link: z.string().url(),
    image: z.string().url(),
    label: z.string(),
    date: z.string()
});
export const AntaraNewsSchema = z.object({
    title: z.string(),
    link: z.string().url(),
    image: z.string().url(),
    label: z.string(),
    date: z.string()
});
export const KompasSchema = z.object({
    title: z.string(),
    link: z.string().url(),
    image: z.string().url(),
    label: z.string(),
    date: z.string()
});
export const SuaracomSchema = z.object({
    title: z.string(),
    link: z.string().url(),
    image: z.string().url(),
    description: z.string(),
    date: z.string()
});
export const Liputan6Schema = z.object({
    title: z.string(),
    link: z.string().url(),
    image: z.string().url(),
    description: z.string(),
    label: z.string(),
    date: z.string()
});
export const MerdekaSchema = z.object({
    title: z.string(),
    link: z.string().url(),
    image: z.string().url(),
    label: z.string(),
    date: z.string()
});
