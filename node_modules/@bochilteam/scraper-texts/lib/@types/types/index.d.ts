import { z } from 'zod';
export declare const LatinToAksaraSchema: z.ZodString;
export declare const AksaraToLatinSchema: z.ZodString;
export type LatinToAksara = z.infer<typeof LatinToAksaraSchema>;
export type AksaraToLatin = z.infer<typeof AksaraToLatinSchema>;
export declare const BucinSchema: z.ZodString;
export type Bucin = z.infer<typeof BucinSchema>;
export declare const DareSchema: z.ZodString;
export type Dare = z.infer<typeof DareSchema>;
export declare const TruthSchema: z.ZodString;
export type Truth = z.infer<typeof TruthSchema>;
export declare const TextProListSchema: z.ZodObject<{
    link: z.ZodString;
    title: z.ZodString;
    parameters: z.ZodArray<z.ZodBoolean, "many">;
}, "strip", z.ZodTypeAny, {
    link: string;
    title: string;
    parameters: boolean[];
}, {
    link: string;
    title: string;
    parameters: boolean[];
}>;
export declare const TextProSchema: z.ZodString;
export type TextProList = z.infer<typeof TextProListSchema>;
export type TextPro = z.infer<typeof TextProSchema>;
//# sourceMappingURL=index.d.ts.map