import { describe, it } from 'mocha';
import { expect } from 'chai';
import { asmaulhusna, asmaulhusnajson, alquran, jadwalsholat, listJadwalSholat } from '../index.js';
describe('Religions', () => {
    describe('Asmaul Husna', () => {
        it('AsmaulHusna', done => {
            asmaulhusna().then(res => {
                return done();
            }).catch(done);
        });
        it('AsmaulHusna JSON', done => {
            const res = asmaulhusnajson;
            expect(res).to.have.length(99);
            return done();
        });
    });
    describe('Al quran', function () {
        this.timeout(10000);
        it('Alquran', done => {
            alquran().then(res => {
                expect(res).to.have.length(114);
                return done();
            }).catch(done);
        });
    });
    describe('Jadwal Sholat', function () {
        this.timeout(5000);
        it('jadwalSholat', done => {
            jadwalsholat('Semarang').then(res => {
                expect(res.list).to.have.lengthOf.at.least(27);
                return done();
            }).catch(done);
        });
        it('List jadwal sholat', done => {
            Promise.resolve(listJadwalSholat).then(res => {
                expect(res).to.have.lengthOf.at.least(316);
                return done();
            }).catch(done);
        });
    });
});
