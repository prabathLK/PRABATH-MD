"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_js_1 = require("../index.js");
describe('Texts', () => {
    describe('Aksara Jawa', () => {
        it('Latin to Aksara', done => {
            try {
                const res = (0, index_js_1.latinToAksara)('hallo rek');
                (0, chai_1.expect)(res).equal('ꦲꦭ꧀ꦭꦺꦴ​ꦫꦺꦏ꧀');
                return done();
            }
            catch (e) {
                return done(e);
            }
        });
        it('Aksara to Latin', done => {
            try {
                const res = (0, index_js_1.aksaraToLatin)('ꦲꦭ꧀ꦭꦺꦴ​ꦫꦺꦏ꧀', { HVokal: false });
                (0, chai_1.expect)(res).equal('hal​lo rek​');
                return done();
            }
            catch (e) {
                return done(e);
            }
        });
    });
    describe('Bucin', () => {
        it('Bucin', done => {
            (0, index_js_1.bucin)().then(res => {
                (0, chai_1.expect)(res).to.be.a('string');
                return done();
            }).catch(done);
        });
        it('Bucin JSON', done => {
            const res = index_js_1.bucinjson;
            (0, chai_1.expect)(res).to.be.an('array');
            (0, chai_1.expect)(res).to.have.lengthOf.at.least(365);
            return done();
        });
    });
    describe('Dare', () => {
        it('Dare', done => {
            (0, index_js_1.dare)().then(res => {
                (0, chai_1.expect)(res).to.be.a('string');
                return done();
            }).catch(done);
        });
        it('Dare JSON', done => {
            const res = index_js_1.darejson;
            (0, chai_1.expect)(res).to.be.an('array');
            (0, chai_1.expect)(res).to.have.lengthOf.at.least(63);
            return done();
        });
    });
    describe('Truth', () => {
        it('Truth', done => {
            (0, index_js_1.truth)().then(res => {
                (0, chai_1.expect)(res).to.be.a('string');
                return done();
            }).catch(done);
        });
        it('Truth JSON', done => {
            const res = index_js_1.truthjson;
            (0, chai_1.expect)(res).to.be.an('array');
            (0, chai_1.expect)(res).to.have.lengthOf.at.least(61);
            return done();
        });
    });
    describe('TextPro', () => {
        it('TextPro', done => {
            (0, index_js_1.textpro)('neon', ['Hallo']).then(res => {
                (0, chai_1.expect)(res).to.be.a('string');
                return done();
            }).catch(done);
        });
        it('TextPro List', done => {
            Promise.resolve(index_js_1.textproList).then(res => {
                (0, chai_1.expect)(res).to.be.an('array');
                (0, chai_1.expect)(res).to.have.lengthOf.at.least(1);
                return done();
            }).catch(done);
        });
    });
});
