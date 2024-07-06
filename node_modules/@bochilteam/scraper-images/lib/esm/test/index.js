import { describe, it } from 'mocha';
import { googleImage, pinterest, wallpaper, stickerLine, stickerTelegram } from '../index.js';
describe('Images', () => {
    it('google-image', function (done) {
        this.timeout(5000);
        googleImage('Minecraft').then(() => {
            return done();
        }).catch(done);
    });
    it('pinterest', (done) => {
        pinterest('Minecraft').then(() => {
            return done();
        }).catch(done);
    });
    describe('Wallpaper', () => {
        it('wallpaper', (done) => {
            wallpaper('Minecraft').then(() => {
                return done();
            }).catch(done);
        });
    });
    it('Sticker Telegram', (done) => {
        stickerTelegram('Minecraft').then(() => {
            return done();
        }).catch(done);
    });
    it('Sticker Line', (done) => {
        stickerLine('Anime').then(() => {
            return done();
        }).catch(done);
    });
});
