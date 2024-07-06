import { z } from 'zod';
export const GempaBaseSchema = z.object({
    date: z.string(),
    time: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    magnitude: z.string(),
    depth: z.string()
});
export const GempaSchema = z.object({
    location: z.string(),
    warning: z.array(z.string())
}).merge(GempaBaseSchema);
export const GempaNowSchema = z.object({
    location: z.string(),
}).merge(GempaBaseSchema);
export const GempaRealtimeSchema = z.object({
    location: z.array(z.string()),
    isConfirmed: z.boolean()
}).merge(GempaBaseSchema);
export const TsunamiSchema = z.object({
    location: z.string(),
    info: z.string()
}).merge(GempaBaseSchema);
