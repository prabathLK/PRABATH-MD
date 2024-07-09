import { describe, it } from 'mocha';
import { expect } from 'chai';
import { googleIt, tiktokdl, instagramdl, instagramStory, facebookdl, facebookdlv2, twitterdl, youtubedl, youtubedlv2, youtubeSearch, groupWA, aiovideodl, savefrom, snapsave } from '../index.js';
describe('Social media', () => {
    describe('Tiktok scraper', function () {
        this.timeout(5000);
        it('Tiktok video downloader', (done) => {
            tiktokdl('https://www.tiktok.com/@omagadsus/video/7025456384175017243?is_from_webapp=1&sender_device=pc&web_id6982004129280116226').then(() => {
                return done();
            }).catch(done);
        });
    });
    describe('Instagram', function () {
        this.timeout(15000);
        it('Instagram downloader', (done) => {
            // https://www.instagram.com/p/CaHpoweBjmx/?utm_source=ig_web_copy_link
            instagramdl('https://www.instagram.com/reel/CXK49yFLtJ_/?utm_source=ig_web_copy_link').then(() => {
                return done();
            }).catch(done);
        });
        it('Instagram story', (done) => {
            instagramStory('raffinagita1717').then(() => {
                return done();
            }).catch(done);
        });
    });
    describe('Facebook (Metaverse :V)', function () {
        this.timeout(10000);
        it('Facebook downloader', done => {
            facebookdl('https://fb.watch/9WktuN9j-z/').then((res) => {
                return done();
            }).catch(done);
        });
        it('Facebook downloader v2', done => {
            facebookdlv2('https://fb.watch/9WktuN9j-z/').then(() => {
                return done();
            }).catch(done);
        });
    });
    describe('Twitter', () => {
        it('Twitter downloader', done => {
            twitterdl('https://twitter.com/jen_degen/status/1458167531869458440?s=20').then(() => {
                return done();
            }).catch(done);
        });
    });
    describe('Youtube', function () {
        this.timeout(100000);
        it('Youtube downloader', done => {
            youtubedl('https://youtu.be/iik25wqIuFo').then((res) => {
                Promise.all([
                    res.video['360p'].download(),
                    res.audio['128kbps'].download()
                ]).then(([video, audio]) => {
                    return done();
                }).catch(done);
            }).catch(done);
        });
        it('Youtube downloader v2', done => {
            youtubedlv2('https://youtu.be/iik25wqIuFo').then((res) => {
                console.log(res);
                // idk, why error if process in parallel
                res.video['360p'].download().then((video) => {
                    res.audio['128kbps'].download().then((audio) => {
                        return done();
                    }).catch(done);
                }).catch(done);
            }).catch(done);
        });
        it('Youtube search', done => {
            youtubeSearch('Mr Bean funfair').then((res) => {
                expect(res.video).to.have.lengthOf.at.least(1);
                return done();
            }).catch(done);
        });
    });
    it('Google It', function (done) {
        this.timeout(5000);
        googleIt('Minecraft').then((res) => {
            expect(res.articles).to.have.lengthOf.at.least(1);
            return done();
        }).catch(done);
    });
    it('Group WhatsApp', done => {
        groupWA('A').then(res => {
            expect(res).to.have.lengthOf.at.least(1);
            return done();
        }).catch(done);
    });
    describe('aiovideodl', function () {
        this.timeout(10000);
        it('Tiktok download', done => {
            aiovideodl('https://www.tiktok.com/@omagadsus/video/7025456384175017243').then((res) => {
                expect(res.medias).to.have.lengthOf.at.least(1);
                expect(res.source).to.be.eq('tiktok');
                return done();
            }).catch(done);
        });
        it('Facebook download', done => {
            aiovideodl('https://fb.watch/9WktuN9j-z/').then((res) => {
                expect(res.medias).to.have.lengthOf.at.least(1);
                expect(res.source).to.be.eq('facebook');
                return done();
            }).catch(done);
        });
        it('Twitter download', done => {
            aiovideodl('https://twitter.com/jen_degen/status/1458167531869458440?s=20').then((res) => {
                expect(res.medias).to.have.lengthOf.at.least(1);
                expect(res.source).to.be.eq('twitter');
                return done();
            }).catch(done);
        });
    });
    describe('Savefrom', function () {
        this.timeout(5000);
        it('Tiktok download', done => {
            savefrom('https://www.tiktok.com/@omagadsus/video/7025456384175017243?is_from_webapp=1&sender_device=pc&web_id6982004129280116226').then((res) => {
                for (const { hosting } of res) {
                    expect(hosting).to.be.eq('tiktok.com');
                }
                return done();
            }).catch(done);
        });
        it('Facebook download', done => {
            savefrom('https://fb.watch/9WktuN9j-z/').then((res) => {
                for (const { hosting } of res) {
                    expect(hosting).to.be.eq('facebook.com');
                }
                return done();
            }).catch(done);
        });
        it('Twitter download', done => {
            savefrom('https://twitter.com/jen_degen/status/1458167531869458440?s=20').then((res) => {
                for (const { hosting } of res) {
                    expect(hosting).to.be.eq('twitter.com');
                }
                return done();
            }).catch(done);
        });
        it('Instagram download', done => {
            savefrom('https://www.instagram.com/reel/CXK49yFLtJ_/?utm_source=ig_web_copy_link').then((res) => {
                for (const { hosting } of res) {
                    expect(hosting).to.be.eq('instagram.com');
                }
                return done();
            }).catch(done);
        });
        it('Instagram download #63', done => {
            savefrom('https://www.instagram.com/p/CrvIUf8omdg/').then((res) => {
                return done();
            }).catch(done);
        });
    });
    describe('SnapSave', function () {
        this.timeout(20000);
        it('Instagram download', done => {
            // https://instagram.com/stories/officialpersebaya/2787913152184277704?utm_source=ig_story_item_share&utm_medium=share_sheet
            snapsave('https://www.instagram.com/reel/CXK49yFLtJ_/?utm_source=ig_web_copy_link').then((res) => {
                expect(res).to.have.length.at.least(1);
                return done();
            }).catch(done);
        });
        it('Facebook download', done => {
            snapsave('https://fb.watch/9WktuN9j-z/').then((res) => {
                expect(res).to.have.length.at.least(1);
                return done();
            }).catch(done);
        });
    });
});
