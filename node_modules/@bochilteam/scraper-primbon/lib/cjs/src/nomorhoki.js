"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function nomorhoki(nomer) {
    var _a, _b, _c, _d;
    const config = {
        nomer: encodeURIComponent(nomer),
        submit: '+Submit!+'
    };
    const data = await got_1.default
        .post('https://www.primbon.com/no_hoki_bagua_shuzi.php', {
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        form: config
    })
        .text();
    const results = data
        .split('</b><br></td></tr><tr><td')[0]
        .split(`<br><b>No. HP : ${nomer}</b><br>`)[1];
    const angka_bagua_shuzi = parseInt((_b = (_a = results === null || results === void 0 ? void 0 : results.split('Angka Bagua Shuzi :')[1]) === null || _a === void 0 ? void 0 : _a.split('</b><br><br>')[0]) === null || _b === void 0 ? void 0 : _b.replace(/&#37/gi, ''));
    if (!angka_bagua_shuzi)
        throw new Error(`Can't get data, maybe your number(${nomer}) invalid!`);
    const kekayaan = parseInt(results.split('Kekayaan =')[1].split('<br>')[0]);
    const kesehatan = parseInt(results.split('Kesehatan =')[1].split('<br>')[0]);
    const cinta = parseInt(results.split('Cinta/Relasi =')[1].split('<br>')[0]);
    const kestabilan = parseInt(results.split('Kestabilan =')[1].split('<br>')[0]);
    const positif = parseInt((_c = results
        .split('</b><br></td><td><!-- space -->')[0]
        .split('b>% = ')[1]) === null || _c === void 0 ? void 0 : _c.replace(/&#37/gi, ''));
    const perselisihan = parseInt(results.split('Perselisihan =')[1].split('<br>')[0]);
    const kehilangan = parseInt(results.split('Kehilangan =')[1].split('<br>')[0]);
    const malapetaka = parseInt(results.split('Malapetaka =')[1].split('<br>')[0]);
    const Kehancuran = parseInt(results.split('Kehancuran =')[1].split('<br>')[0]);
    const negatif = parseInt((_d = results.split('Kehancuran =')[1].split('<b>% =')[1]) === null || _d === void 0 ? void 0 : _d.replace(/&#37/gi, ''));
    return index_js_1.NomerHokiSchema.parse({
        nomer: nomer,
        angka_bagua_shuzi,
        positif: {
            kekayaan,
            kesehatan,
            cinta,
            kestabilan,
            positif
        },
        negatif: {
            perselisihan,
            kehilangan,
            malapetaka,
            Kehancuran,
            negatif
        }
    });
}
exports.default = nomorhoki;
