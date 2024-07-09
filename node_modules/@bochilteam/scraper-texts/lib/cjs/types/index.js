"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextProSchema = exports.TextProListSchema = exports.TruthSchema = exports.DareSchema = exports.BucinSchema = exports.AksaraToLatinSchema = exports.LatinToAksaraSchema = void 0;
const zod_1 = require("zod");
exports.LatinToAksaraSchema = zod_1.z.string();
exports.AksaraToLatinSchema = zod_1.z.string();
exports.BucinSchema = zod_1.z.string();
exports.DareSchema = zod_1.z.string();
exports.TruthSchema = zod_1.z.string();
exports.TextProListSchema = zod_1.z.object({
    link: zod_1.z.string(),
    title: zod_1.z.string(),
    parameters: zod_1.z.array(zod_1.z.boolean())
});
exports.TextProSchema = zod_1.z.string();
