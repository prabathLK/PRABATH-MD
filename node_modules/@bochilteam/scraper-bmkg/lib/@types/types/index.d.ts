import { z } from 'zod';
export declare const GempaBaseSchema: z.ZodObject<{
    date: z.ZodString;
    time: z.ZodString;
    latitude: z.ZodString;
    longitude: z.ZodString;
    magnitude: z.ZodString;
    depth: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string;
    time: string;
    latitude: string;
    longitude: string;
    magnitude: string;
    depth: string;
}, {
    date: string;
    time: string;
    latitude: string;
    longitude: string;
    magnitude: string;
    depth: string;
}>;
export declare const GempaSchema: z.ZodObject<z.extendShape<{
    location: z.ZodString;
    warning: z.ZodArray<z.ZodString, "many">;
}, {
    date: z.ZodString;
    time: z.ZodString;
    latitude: z.ZodString;
    longitude: z.ZodString;
    magnitude: z.ZodString;
    depth: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    date: string;
    time: string;
    latitude: string;
    longitude: string;
    magnitude: string;
    depth: string;
    location: string;
    warning: string[];
}, {
    date: string;
    time: string;
    latitude: string;
    longitude: string;
    magnitude: string;
    depth: string;
    location: string;
    warning: string[];
}>;
export declare const GempaNowSchema: z.ZodObject<z.extendShape<{
    location: z.ZodString;
}, {
    date: z.ZodString;
    time: z.ZodString;
    latitude: z.ZodString;
    longitude: z.ZodString;
    magnitude: z.ZodString;
    depth: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    date: string;
    time: string;
    latitude: string;
    longitude: string;
    magnitude: string;
    depth: string;
    location: string;
}, {
    date: string;
    time: string;
    latitude: string;
    longitude: string;
    magnitude: string;
    depth: string;
    location: string;
}>;
export declare const GempaRealtimeSchema: z.ZodObject<z.extendShape<{
    location: z.ZodArray<z.ZodString, "many">;
    isConfirmed: z.ZodBoolean;
}, {
    date: z.ZodString;
    time: z.ZodString;
    latitude: z.ZodString;
    longitude: z.ZodString;
    magnitude: z.ZodString;
    depth: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    date: string;
    time: string;
    latitude: string;
    longitude: string;
    magnitude: string;
    depth: string;
    location: string[];
    isConfirmed: boolean;
}, {
    date: string;
    time: string;
    latitude: string;
    longitude: string;
    magnitude: string;
    depth: string;
    location: string[];
    isConfirmed: boolean;
}>;
export type Gempa = z.infer<typeof GempaSchema>;
export type GempaNow = z.infer<typeof GempaNowSchema>;
export type GempaRealtime = z.infer<typeof GempaRealtimeSchema>;
export declare const TsunamiSchema: z.ZodObject<z.extendShape<{
    location: z.ZodString;
    info: z.ZodString;
}, {
    date: z.ZodString;
    time: z.ZodString;
    latitude: z.ZodString;
    longitude: z.ZodString;
    magnitude: z.ZodString;
    depth: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    date: string;
    time: string;
    latitude: string;
    longitude: string;
    magnitude: string;
    depth: string;
    location: string;
    info: string;
}, {
    date: string;
    time: string;
    latitude: string;
    longitude: string;
    magnitude: string;
    depth: string;
    location: string;
    info: string;
}>;
export type Tsunami = z.infer<typeof TsunamiSchema>;
//# sourceMappingURL=index.d.ts.map