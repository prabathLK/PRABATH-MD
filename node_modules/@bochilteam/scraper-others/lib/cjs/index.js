"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameFreeFire = exports.kbbi = exports.listJadwalTV = exports.jadwalTVNow = exports.jadwalTV = exports.wikipedia = void 0;
var wikipedia_js_1 = require("./src/wikipedia.js");
Object.defineProperty(exports, "wikipedia", { enumerable: true, get: function () { return __importDefault(wikipedia_js_1).default; } });
var jadwal_tv_js_1 = require("./src/jadwal-tv.js");
Object.defineProperty(exports, "jadwalTV", { enumerable: true, get: function () { return __importDefault(jadwal_tv_js_1).default; } });
Object.defineProperty(exports, "jadwalTVNow", { enumerable: true, get: function () { return jadwal_tv_js_1.jadwalTVNow; } });
Object.defineProperty(exports, "listJadwalTV", { enumerable: true, get: function () { return jadwal_tv_js_1.listJadwalTV; } });
var KBBI_js_1 = require("./src/KBBI.js");
Object.defineProperty(exports, "kbbi", { enumerable: true, get: function () { return __importDefault(KBBI_js_1).default; } });
var idff_js_1 = require("./src/idff.js");
Object.defineProperty(exports, "nameFreeFire", { enumerable: true, get: function () { return __importDefault(idff_js_1).default; } });
__exportStar(require("./src/lyrics.js"), exports);
__exportStar(require("./src/bioskop.js"), exports);
__exportStar(require("./src/chord.js"), exports);
// TODO: add cekResi
// export * from "./cek-resi"
