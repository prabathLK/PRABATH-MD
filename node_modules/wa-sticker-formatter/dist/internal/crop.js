"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs_extra_1 = require("fs-extra");
const os_1 = require("os");
const crop = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield new Promise((resolve) => {
        const name = `${(0, os_1.tmpdir)()}/${Math.random().toString(36)}.webp`;
        (0, fluent_ffmpeg_1.default)(filename)
            // eslint-disable-next-line no-useless-escape
            .outputOptions([
            '-vcodec',
            'libwebp',
            '-vf',
            // eslint-disable-next-line no-useless-escape
            `crop=w='min(min(iw\,ih)\,500)':h='min(min(iw\,ih)\,500)',scale=500:500,setsar=1,fps=15`,
            '-loop',
            '0',
            '-preset',
            'default',
            '-an',
            '-vsync',
            '0',
            '-s',
            '512:512'
        ])
            .save(name)
            .on('end', () => resolve(name));
    });
    return yield (0, fs_extra_1.readFile)(file);
});
exports.default = crop;
