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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.textproList = exports.textpro = exports.truthjson = exports.truth = exports.darejson = exports.dare = exports.bucinjson = exports.bucin = void 0;
const bucin_js_1 = __importStar(require("./src/bucin.js"));
exports.bucin = bucin_js_1.default;
Object.defineProperty(exports, "bucinjson", { enumerable: true, get: function () { return bucin_js_1.bucinjson; } });
const dare_js_1 = __importStar(require("./src/dare.js"));
exports.dare = dare_js_1.default;
Object.defineProperty(exports, "darejson", { enumerable: true, get: function () { return dare_js_1.darejson; } });
const truth_js_1 = __importStar(require("./src/truth.js"));
exports.truth = truth_js_1.default;
Object.defineProperty(exports, "truthjson", { enumerable: true, get: function () { return truth_js_1.truthjson; } });
const textpro_js_1 = __importStar(require("./src/textpro.js"));
exports.textpro = textpro_js_1.default;
Object.defineProperty(exports, "textproList", { enumerable: true, get: function () { return textpro_js_1.textproList; } });
__exportStar(require("./src/aksarajawa.js"), exports);
