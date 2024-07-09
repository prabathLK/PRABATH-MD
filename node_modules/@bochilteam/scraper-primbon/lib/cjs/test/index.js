"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const index_js_1 = require("../index.js");
(0, mocha_1.describe)('Primbon', () => {
    (0, mocha_1.it)('Arti nama', (done) => {
        (0, index_js_1.artinama)('Windah basudara').then(() => {
            return done();
        }).catch(done);
    });
    (0, mocha_1.it)('Arti mimpi', (done) => {
        (0, index_js_1.artimimpi)('Jalan').then(() => {
            return done();
        }).catch(done);
    });
    (0, mocha_1.it)('Nomor hoki', (done) => {
        (0, index_js_1.nomorhoki)(6213353).then(() => {
            return done();
        }).catch(done);
    });
    (0, mocha_1.it)('Zodiac', (done) => {
        const res = (0, index_js_1.getZodiac)(1, 1);
        (0, chai_1.expect)(res).equal('capricorn');
        return done();
    });
});
