import { describe, it } from 'mocha';
import { cnbcindonesia, antaranews, kompas, suaracom, liputan6, merdeka } from '../index.js';
describe('News', () => {
    it('CNBC Indonesia', (done) => {
        cnbcindonesia().then(() => {
            return done();
        }).catch(done);
    });
    it('Antara News', (done) => {
        antaranews().then(() => {
            return done();
        }).catch(done);
    });
    it('Kompas', (done) => {
        kompas().then(() => {
            return done();
        }).catch(done);
    });
    it('Suara.com', (done) => {
        suaracom().then(() => {
            return done();
        }).catch(done);
    });
    it('Liputan6', (done) => {
        liputan6().then(() => {
            return done();
        }).catch(done);
    });
    it('Merdeka', (done) => {
        merdeka().then(() => {
            return done();
        }).catch(done);
    });
});
