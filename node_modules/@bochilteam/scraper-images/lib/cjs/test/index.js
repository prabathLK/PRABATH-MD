"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const index_js_1 = require("../index.js");
(0, mocha_1.describe)('Images', () => {
    (0, mocha_1.it)('google-image', function (done) {
        this.timeout(5000);
        (0, index_js_1.googleImage)('Minecraft').then(() => {
            return done();
        }).catch(done);
    });
    (0, mocha_1.it)('pinterest', (done) => {
        (0, index_js_1.pinterest)('Minecraft').then(() => {
            return done();
        }).catch(done);
    });
    (0, mocha_1.describe)('Wallpaper', () => {
        (0, mocha_1.it)('wallpaper', (done) => {
            (0, index_js_1.wallpaper)('Minecraft').then(() => {
                return done();
            }).catch(done);
        });
    });
    (0, mocha_1.it)('Sticker Telegram', (done) => {
        (0, index_js_1.stickerTelegram)('Minecraft').then(() => {
            return done();
        }).catch(done);
    });
    (0, mocha_1.it)('Sticker Line', (done) => {
        (0, index_js_1.stickerLine)('Anime').then(() => {
            return done();
        }).catch(done);
    });
});
