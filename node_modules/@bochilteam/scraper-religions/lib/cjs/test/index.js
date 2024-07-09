"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const index_js_1 = require("../index.js");
(0, mocha_1.describe)('Religions', () => {
    (0, mocha_1.describe)('Asmaul Husna', () => {
        (0, mocha_1.it)('AsmaulHusna', done => {
            (0, index_js_1.asmaulhusna)().then(res => {
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('AsmaulHusna JSON', done => {
            const res = index_js_1.asmaulhusnajson;
            (0, chai_1.expect)(res).to.have.length(99);
            return done();
        });
    });
    (0, mocha_1.describe)('Al quran', function () {
        this.timeout(10000);
        (0, mocha_1.it)('Alquran', done => {
            (0, index_js_1.alquran)().then(res => {
                (0, chai_1.expect)(res).to.have.length(114);
                return done();
            }).catch(done);
        });
    });
    (0, mocha_1.describe)('Jadwal Sholat', function () {
        this.timeout(5000);
        (0, mocha_1.it)('jadwalSholat', done => {
            (0, index_js_1.jadwalsholat)('Semarang').then(res => {
                (0, chai_1.expect)(res.list).to.have.lengthOf.at.least(27);
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('List jadwal sholat', done => {
            Promise.resolve(index_js_1.listJadwalSholat).then(res => {
                (0, chai_1.expect)(res).to.have.lengthOf.at.least(316);
                return done();
            }).catch(done);
        });
    });
});
