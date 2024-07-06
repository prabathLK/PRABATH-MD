import { z } from 'zod';
export const LatinToAksaraSchema = z.string();
export const AksaraToLatinSchema = z.string();
export const BucinSchema = z.string();
export const DareSchema = z.string();
export const TruthSchema = z.string();
export const TextProListSchema = z.object({
    link: z.string(),
    title: z.string(),
    parameters: z.array(z.boolean())
});
export const TextProSchema = z.string();
