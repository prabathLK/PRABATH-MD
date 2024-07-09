"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const index_js_1 = require("../index.js");
(0, mocha_1.describe)('BMKG', () => {
    (0, mocha_1.describe)('Gempabumi', () => {
        (0, mocha_1.it)('Gempa dirasakan', (done) => {
            (0, index_js_1.gempa)().then((res) => {
                (0, chai_1.expect)(res).to.have.length.at.least(1);
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('Gempabumi Terkini (M ≥ 5.0)', (done) => {
            (0, index_js_1.gempaNow)().then((res) => {
                (0, chai_1.expect)(res).to.have.length.at.least(1);
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('Gempabumi realtime', (done) => {
            (0, index_js_1.gempaRealtime)().then((res) => {
                (0, chai_1.expect)(res).to.have.length.at.least(1);
                return done();
            }).catch(done);
        });
    });
    (0, mocha_1.it)('Tsunami', (done) => {
        (0, index_js_1.tsunami)().then((res) => {
            (0, chai_1.expect)(res).to.have.length.at.least(1);
            return done();
        }).catch(done);
    });
});
