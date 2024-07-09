"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsunamiSchema = exports.GempaRealtimeSchema = exports.GempaNowSchema = exports.GempaSchema = exports.GempaBaseSchema = void 0;
const zod_1 = require("zod");
exports.GempaBaseSchema = zod_1.z.object({
    date: zod_1.z.string(),
    time: zod_1.z.string(),
    latitude: zod_1.z.string(),
    longitude: zod_1.z.string(),
    magnitude: zod_1.z.string(),
    depth: zod_1.z.string()
});
exports.GempaSchema = zod_1.z.object({
    location: zod_1.z.string(),
    warning: zod_1.z.array(zod_1.z.string())
}).merge(exports.GempaBaseSchema);
exports.GempaNowSchema = zod_1.z.object({
    location: zod_1.z.string(),
}).merge(exports.GempaBaseSchema);
exports.GempaRealtimeSchema = zod_1.z.object({
    location: zod_1.z.array(zod_1.z.string()),
    isConfirmed: zod_1.z.boolean()
}).merge(exports.GempaBaseSchema);
exports.TsunamiSchema = zod_1.z.object({
    location: zod_1.z.string(),
    info: zod_1.z.string()
}).merge(exports.GempaBaseSchema);
