import { describe, it } from 'mocha';
import { expect } from 'chai';
import { artinama, artimimpi, nomorhoki, getZodiac } from '../index.js';
describe('Primbon', () => {
    it('Arti nama', (done) => {
        artinama('Windah basudara').then(() => {
            return done();
        }).catch(done);
    });
    it('Arti mimpi', (done) => {
        artimimpi('Jalan').then(() => {
            return done();
        }).catch(done);
    });
    it('Nomor hoki', (done) => {
        nomorhoki(6213353).then(() => {
            return done();
        }).catch(done);
    });
    it('Zodiac', (done) => {
        const res = getZodiac(1, 1);
        expect(res).equal('capricorn');
        return done();
    });
});
