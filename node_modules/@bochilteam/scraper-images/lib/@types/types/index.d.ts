import { z } from 'zod';
export declare const GoogleImageSchema: z.ZodString;
export type GoogleImage = z.infer<typeof GoogleImageSchema>;
export declare const PinterestSchema: z.ZodString;
export type Pinterest = z.infer<typeof PinterestSchema>;
export declare const StickerTelegramSchema: z.ZodObject<{
    title: z.ZodString;
    icon: z.ZodString;
    link: z.ZodString;
    stickers: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    icon: string;
    link: string;
    stickers: string[];
}, {
    title: string;
    icon: string;
    link: string;
    stickers: string[];
}>;
export type StickerTelegram = z.infer<typeof StickerTelegramSchema>;
export interface ResponseStickerLine {
    title: string;
    productUrl: string;
    id: string;
    description?: string;
    payloadForProduct: {
        staticUrl: string;
        animationUrl?: string;
        soundUrl?: string;
    };
    authorId: string;
    authorName: string;
}
export declare const StickerLineSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    url: z.ZodString;
    sticker: z.ZodString;
    stickerAnimated: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    stickerSound: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    authorId: z.ZodString;
    authorName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description?: string | null | undefined;
    stickerAnimated?: string | null | undefined;
    stickerSound?: string | null | undefined;
    title: string;
    id: string;
    url: string;
    sticker: string;
    authorId: string;
    authorName: string;
}, {
    description?: string | null | undefined;
    stickerAnimated?: string | null | undefined;
    stickerSound?: string | null | undefined;
    title: string;
    id: string;
    url: string;
    sticker: string;
    authorId: string;
    authorName: string;
}>;
export type StickerLine = z.infer<typeof StickerLineSchema>;
export declare const WallpaperSchema: z.ZodString;
export type Wallpaper = z.infer<typeof WallpaperSchema>;
//# sourceMappingURL=index.d.ts.map