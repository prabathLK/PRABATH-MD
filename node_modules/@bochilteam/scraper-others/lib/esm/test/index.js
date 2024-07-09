/* eslint-disable no-undef */
import { expect } from 'chai';
import { wikipedia, jadwalTV, jadwalTVNow, listJadwalTV, lyrics, lyricsv2, kbbi, nameFreeFire, bioskopNow, bioskop, chord, } from '../index.js';
describe('Others', () => {
    it('Wikipedia', (done) => {
        wikipedia('Minecraft', 'en').then(() => {
            return done();
        }).catch(done);
    });
    describe('Jadwal TV', () => {
        it('Jadwal TV', done => {
            jadwalTV('RCTI').then(res => {
                expect(res.result).to.have.lengthOf.at.least(1);
                return done();
            }).catch(done);
        });
        it('Jadwal TV NOW', done => {
            jadwalTVNow().then(res => {
                Object.keys(res).forEach(key => {
                    expect(res[key]).to.have.lengthOf.at.least(2);
                });
                return done();
            }).catch(done);
        });
        it("List Jadwal TV", done => {
            Promise.resolve(listJadwalTV).then((res) => {
                expect(res).to.have.length.at.least(123);
                return done();
            }).catch(done);
        });
    });
    describe('Lyrics', () => {
        it('Lyrics', done => {
            lyrics('rick astley never gonna give you up').then(() => {
                return done();
            }).catch(done);
        });
        it('Lyrics V2', done => {
            lyricsv2('never gonna give you up').then(() => {
                return done();
            }).catch(done);
        });
    });
    it('KBBI', done => {
        kbbi('halo').then(() => {
            return done();
        }).catch(done);
    });
    it('ID Free Fire', done => {
        nameFreeFire('821587717').then(() => {
            return done();
        }).catch(done);
    });
    describe('Bioskop', () => {
        it('Bioskop now', done => {
            bioskopNow().then(res => {
                expect(res).to.have.lengthOf.at.least(1);
                return done();
            }).catch(done);
        });
        it('Bioskop', done => {
            bioskop().then(res => {
                expect(res).to.have.lengthOf.at.least(1);
                return done();
            }).catch(done);
        });
    });
    describe('Chord', function () {
        this.timeout(10000);
        it('Chord', done => {
            chord('Until i found you').then(res => {
                // console.log(res)
                return done();
            }).catch(done);
        });
    });
});
