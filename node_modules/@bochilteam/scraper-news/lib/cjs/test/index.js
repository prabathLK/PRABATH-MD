"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const index_js_1 = require("../index.js");
(0, mocha_1.describe)('News', () => {
    (0, mocha_1.it)('CNBC Indonesia', (done) => {
        (0, index_js_1.cnbcindonesia)().then(() => {
            return done();
        }).catch(done);
    });
    (0, mocha_1.it)('Antara News', (done) => {
        (0, index_js_1.antaranews)().then(() => {
            return done();
        }).catch(done);
    });
    (0, mocha_1.it)('Kompas', (done) => {
        (0, index_js_1.kompas)().then(() => {
            return done();
        }).catch(done);
    });
    (0, mocha_1.it)('Suara.com', (done) => {
        (0, index_js_1.suaracom)().then(() => {
            return done();
        }).catch(done);
    });
    (0, mocha_1.it)('Liputan6', (done) => {
        (0, index_js_1.liputan6)().then(() => {
            return done();
        }).catch(done);
    });
    (0, mocha_1.it)('Merdeka', (done) => {
        (0, index_js_1.merdeka)().then(() => {
            return done();
        }).catch(done);
    });
});
