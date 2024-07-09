"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const index_js_1 = require("../index.js");
(0, mocha_1.describe)('Social media', () => {
    (0, mocha_1.describe)('Tiktok scraper', function () {
        this.timeout(5000);
        (0, mocha_1.it)('Tiktok video downloader', (done) => {
            (0, index_js_1.tiktokdl)('https://www.tiktok.com/@omagadsus/video/7025456384175017243?is_from_webapp=1&sender_device=pc&web_id6982004129280116226').then(() => {
                return done();
            }).catch(done);
        });
    });
    (0, mocha_1.describe)('Instagram', function () {
        this.timeout(15000);
        (0, mocha_1.it)('Instagram downloader', (done) => {
            // https://www.instagram.com/p/CaHpoweBjmx/?utm_source=ig_web_copy_link
            (0, index_js_1.instagramdl)('https://www.instagram.com/reel/CXK49yFLtJ_/?utm_source=ig_web_copy_link').then(() => {
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('Instagram story', (done) => {
            (0, index_js_1.instagramStory)('raffinagita1717').then(() => {
                return done();
            }).catch(done);
        });
    });
    (0, mocha_1.describe)('Facebook (Metaverse :V)', function () {
        this.timeout(10000);
        (0, mocha_1.it)('Facebook downloader', done => {
            (0, index_js_1.facebookdl)('https://fb.watch/9WktuN9j-z/').then((res) => {
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('Facebook downloader v2', done => {
            (0, index_js_1.facebookdlv2)('https://fb.watch/9WktuN9j-z/').then(() => {
                return done();
            }).catch(done);
        });
    });
    (0, mocha_1.describe)('Twitter', () => {
        (0, mocha_1.it)('Twitter downloader', done => {
            (0, index_js_1.twitterdl)('https://twitter.com/jen_degen/status/1458167531869458440?s=20').then(() => {
                return done();
            }).catch(done);
        });
    });
    (0, mocha_1.describe)('Youtube', function () {
        this.timeout(100000);
        (0, mocha_1.it)('Youtube downloader', done => {
            (0, index_js_1.youtubedl)('https://youtu.be/iik25wqIuFo').then((res) => {
                Promise.all([
                    res.video['360p'].download(),
                    res.audio['128kbps'].download()
                ]).then(([video, audio]) => {
                    return done();
                }).catch(done);
            }).catch(done);
        });
        (0, mocha_1.it)('Youtube downloader v2', done => {
            (0, index_js_1.youtubedlv2)('https://youtu.be/iik25wqIuFo').then((res) => {
                console.log(res);
                // idk, why error if process in parallel
                res.video['360p'].download().then((video) => {
                    res.audio['128kbps'].download().then((audio) => {
                        return done();
                    }).catch(done);
                }).catch(done);
            }).catch(done);
        });
        (0, mocha_1.it)('Youtube search', done => {
            (0, index_js_1.youtubeSearch)('Mr Bean funfair').then((res) => {
                (0, chai_1.expect)(res.video).to.have.lengthOf.at.least(1);
                return done();
            }).catch(done);
        });
    });
    (0, mocha_1.it)('Google It', function (done) {
        this.timeout(5000);
        (0, index_js_1.googleIt)('Minecraft').then((res) => {
            (0, chai_1.expect)(res.articles).to.have.lengthOf.at.least(1);
            return done();
        }).catch(done);
    });
    (0, mocha_1.it)('Group WhatsApp', done => {
        (0, index_js_1.groupWA)('A').then(res => {
            (0, chai_1.expect)(res).to.have.lengthOf.at.least(1);
            return done();
        }).catch(done);
    });
    (0, mocha_1.describe)('aiovideodl', function () {
        this.timeout(10000);
        (0, mocha_1.it)('Tiktok download', done => {
            (0, index_js_1.aiovideodl)('https://www.tiktok.com/@omagadsus/video/7025456384175017243').then((res) => {
                (0, chai_1.expect)(res.medias).to.have.lengthOf.at.least(1);
                (0, chai_1.expect)(res.source).to.be.eq('tiktok');
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('Facebook download', done => {
            (0, index_js_1.aiovideodl)('https://fb.watch/9WktuN9j-z/').then((res) => {
                (0, chai_1.expect)(res.medias).to.have.lengthOf.at.least(1);
                (0, chai_1.expect)(res.source).to.be.eq('facebook');
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('Twitter download', done => {
            (0, index_js_1.aiovideodl)('https://twitter.com/jen_degen/status/1458167531869458440?s=20').then((res) => {
                (0, chai_1.expect)(res.medias).to.have.lengthOf.at.least(1);
                (0, chai_1.expect)(res.source).to.be.eq('twitter');
                return done();
            }).catch(done);
        });
    });
    (0, mocha_1.describe)('Savefrom', function () {
        this.timeout(5000);
        (0, mocha_1.it)('Tiktok download', done => {
            (0, index_js_1.savefrom)('https://www.tiktok.com/@omagadsus/video/7025456384175017243?is_from_webapp=1&sender_device=pc&web_id6982004129280116226').then((res) => {
                for (const { hosting } of res) {
                    (0, chai_1.expect)(hosting).to.be.eq('tiktok.com');
                }
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('Facebook download', done => {
            (0, index_js_1.savefrom)('https://fb.watch/9WktuN9j-z/').then((res) => {
                for (const { hosting } of res) {
                    (0, chai_1.expect)(hosting).to.be.eq('facebook.com');
                }
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('Twitter download', done => {
            (0, index_js_1.savefrom)('https://twitter.com/jen_degen/status/1458167531869458440?s=20').then((res) => {
                for (const { hosting } of res) {
                    (0, chai_1.expect)(hosting).to.be.eq('twitter.com');
                }
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('Instagram download', done => {
            (0, index_js_1.savefrom)('https://www.instagram.com/reel/CXK49yFLtJ_/?utm_source=ig_web_copy_link').then((res) => {
                for (const { hosting } of res) {
                    (0, chai_1.expect)(hosting).to.be.eq('instagram.com');
                }
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('Instagram download #63', done => {
            (0, index_js_1.savefrom)('https://www.instagram.com/p/CrvIUf8omdg/').then((res) => {
                return done();
            }).catch(done);
        });
    });
    (0, mocha_1.describe)('SnapSave', function () {
        this.timeout(20000);
        (0, mocha_1.it)('Instagram download', done => {
            // https://instagram.com/stories/officialpersebaya/2787913152184277704?utm_source=ig_story_item_share&utm_medium=share_sheet
            (0, index_js_1.snapsave)('https://www.instagram.com/reel/CXK49yFLtJ_/?utm_source=ig_web_copy_link').then((res) => {
                (0, chai_1.expect)(res).to.have.length.at.least(1);
                return done();
            }).catch(done);
        });
        (0, mocha_1.it)('Facebook download', done => {
            (0, index_js_1.snapsave)('https://fb.watch/9WktuN9j-z/').then((res) => {
                (0, chai_1.expect)(res).to.have.length.at.least(1);
                return done();
            }).catch(done);
        });
    });
});
