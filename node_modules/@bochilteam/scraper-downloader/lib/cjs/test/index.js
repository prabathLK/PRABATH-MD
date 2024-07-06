"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const index_js_1 = require("../index.js");
(0, mocha_1.describe)('Downloader', () => {
    (0, mocha_1.describe)('Mediafire', () => {
        (0, mocha_1.it)('Mediafire Download', done => {
            (0, index_js_1.mediafiredl)('https://www.mediafire.com/file/gpeiucmm1xo6ln0/hello_world.mp4/file').then(() => {
                return done();
            }).catch(done);
        });
    });
    (0, mocha_1.describe)('sfilemobi', function () {
        this.timeout(5000);
        (0, mocha_1.it)('sfilemobi search', done => {
            (0, index_js_1.sfilemobiSearch)('minecraft').then(() => {
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('sfilemobi download', done => {
            (0, index_js_1.sfilemobi)('https://sfile.mobi/oGm8kAIQCs7').then(() => {
                return done();
            }).catch(done);
        });
    });
});
