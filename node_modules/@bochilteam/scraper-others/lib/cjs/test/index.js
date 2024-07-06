"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const chai_1 = require("chai");
const index_js_1 = require("../index.js");
describe('Others', () => {
    it('Wikipedia', (done) => {
        (0, index_js_1.wikipedia)('Minecraft', 'en').then(() => {
            return done();
        }).catch(done);
    });
    describe('Jadwal TV', () => {
        it('Jadwal TV', done => {
            (0, index_js_1.jadwalTV)('RCTI').then(res => {
                (0, chai_1.expect)(res.result).to.have.lengthOf.at.least(1);
                return done();
            }).catch(done);
        });
        it('Jadwal TV NOW', done => {
            (0, index_js_1.jadwalTVNow)().then(res => {
                Object.keys(res).forEach(key => {
                    (0, chai_1.expect)(res[key]).to.have.lengthOf.at.least(2);
                });
                return done();
            }).catch(done);
        });
        it("List Jadwal TV", done => {
            Promise.resolve(index_js_1.listJadwalTV).then((res) => {
                (0, chai_1.expect)(res).to.have.length.at.least(123);
                return done();
            }).catch(done);
        });
    });
    describe('Lyrics', () => {
        it('Lyrics', done => {
            (0, index_js_1.lyrics)('rick astley never gonna give you up').then(() => {
                return done();
            }).catch(done);
        });
        it('Lyrics V2', done => {
            (0, index_js_1.lyricsv2)('never gonna give you up').then(() => {
                return done();
            }).catch(done);
        });
    });
    it('KBBI', done => {
        (0, index_js_1.kbbi)('halo').then(() => {
            return done();
        }).catch(done);
    });
    it('ID Free Fire', done => {
        (0, index_js_1.nameFreeFire)('821587717').then(() => {
            return done();
        }).catch(done);
    });
    describe('Bioskop', () => {
        it('Bioskop now', done => {
            (0, index_js_1.bioskopNow)().then(res => {
                (0, chai_1.expect)(res).to.have.lengthOf.at.least(1);
                return done();
            }).catch(done);
        });
        it('Bioskop', done => {
            (0, index_js_1.bioskop)().then(res => {
                (0, chai_1.expect)(res).to.have.lengthOf.at.least(1);
                return done();
            }).catch(done);
        });
    });
    describe('Chord', function () {
        this.timeout(10000);
        it('Chord', done => {
            (0, index_js_1.chord)('Until i found you').then(res => {
                // console.log(res)
                return done();
            }).catch(done);
        });
    });
});
