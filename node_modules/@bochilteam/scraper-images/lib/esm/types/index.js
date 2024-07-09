import { z } from 'zod';
export const GoogleImageSchema = z.string().url();
export const PinterestSchema = z.string().url();
export const StickerTelegramSchema = z.object({
    title: z.string(),
    icon: z.string(),
    link: z.string().url(),
    stickers: z.array(z.string().url())
});
export const StickerLineSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional().nullable(),
    url: z.string().url(),
    sticker: z.string(),
    stickerAnimated: z.string().optional().nullable(),
    stickerSound: z.string().optional().nullable(),
    authorId: z.string(),
    authorName: z.string()
});
export const WallpaperSchema = z.string().url();
