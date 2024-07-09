import { describe, it } from 'mocha';
import { expect } from 'chai';
import { gempa, gempaNow, gempaRealtime, tsunami } from '../index.js';
describe('BMKG', () => {
    describe('Gempabumi', () => {
        it('Gempa dirasakan', (done) => {
            gempa().then((res) => {
                expect(res).to.have.length.at.least(1);
                return done();
            }).catch(done);
        });
        it('Gempabumi Terkini (M ≥ 5.0)', (done) => {
            gempaNow().then((res) => {
                expect(res).to.have.length.at.least(1);
                return done();
            }).catch(done);
        });
        it('Gempabumi realtime', (done) => {
            gempaRealtime().then((res) => {
                expect(res).to.have.length.at.least(1);
                return done();
            }).catch(done);
        });
    });
    it('Tsunami', (done) => {
        tsunami().then((res) => {
            expect(res).to.have.length.at.least(1);
            return done();
        }).catch(done);
    });
});
