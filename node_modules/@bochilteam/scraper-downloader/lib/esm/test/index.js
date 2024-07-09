import { describe, it } from 'mocha';
import { mediafiredl, sfilemobiSearch, sfilemobi, } from '../index.js';
describe('Downloader', () => {
    describe('Mediafire', () => {
        it('Mediafire Download', done => {
            mediafiredl('https://www.mediafire.com/file/gpeiucmm1xo6ln0/hello_world.mp4/file').then(() => {
                return done();
            }).catch(done);
        });
    });
    describe('sfilemobi', function () {
        this.timeout(5000);
        it('sfilemobi search', done => {
            sfilemobiSearch('minecraft').then(() => {
                return done();
            }).catch(done);
        });
        it('sfilemobi download', done => {
            sfilemobi('https://sfile.mobi/oGm8kAIQCs7').then(() => {
                return done();
            }).catch(done);
        });
    });
});
