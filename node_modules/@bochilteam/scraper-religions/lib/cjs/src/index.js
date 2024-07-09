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
exports.listJadwalSholat = exports.jadwalsholat = exports.asmaulhusnajson = exports.asmaulhusna = void 0;
var asmaulhusna_js_1 = require("./asmaulhusna.js");
Object.defineProperty(exports, "asmaulhusna", { enumerable: true, get: function () { return __importDefault(asmaulhusna_js_1).default; } });
Object.defineProperty(exports, "asmaulhusnajson", { enumerable: true, get: function () { return asmaulhusna_js_1.asmaulhusnajson; } });
var jadwalsholat_js_1 = require("./jadwalsholat.js");
Object.defineProperty(exports, "jadwalsholat", { enumerable: true, get: function () { return __importDefault(jadwalsholat_js_1).default; } });
Object.defineProperty(exports, "listJadwalSholat", { enumerable: true, get: function () { return jadwalsholat_js_1.listJadwalSholat; } });
__exportStar(require("./alquran.js"), exports);
