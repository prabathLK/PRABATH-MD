"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WallpaperSchema = exports.StickerLineSchema = exports.StickerTelegramSchema = exports.PinterestSchema = exports.GoogleImageSchema = void 0;
const zod_1 = require("zod");
exports.GoogleImageSchema = zod_1.z.string().url();
exports.PinterestSchema = zod_1.z.string().url();
exports.StickerTelegramSchema = zod_1.z.object({
    title: zod_1.z.string(),
    icon: zod_1.z.string(),
    link: zod_1.z.string().url(),
    stickers: zod_1.z.array(zod_1.z.string().url())
});
exports.StickerLineSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string().optional().nullable(),
    url: zod_1.z.string().url(),
    sticker: zod_1.z.string(),
    stickerAnimated: zod_1.z.string().optional().nullable(),
    stickerSound: zod_1.z.string().optional().nullable(),
    authorId: zod_1.z.string(),
    authorName: zod_1.z.string()
});
exports.WallpaperSchema = zod_1.z.string().url();
