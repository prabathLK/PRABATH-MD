"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const index_js_1 = require("../index.js");
const index_js_2 = require("../types/index.js");
(0, mocha_1.describe)('Games', () => {
    (0, mocha_1.describe)('Asah Otak', () => {
        (0, mocha_1.it)('Asah Otak', (done) => {
            (0, index_js_1.asahotak)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Asah Otak JSON', (done) => {
            index_js_1.asahotakjson.map((value) => {
                const parsed = index_js_2.AsahOtakSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    (0, mocha_1.describe)('Caklontong', () => {
        (0, mocha_1.it)('Caklontong', (done) => {
            (0, index_js_1.caklontong)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Caklontong JSON', (done) => {
            index_js_1.caklontongjson.map((value) => {
                const parsed = index_js_2.CakLontongSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    (0, mocha_1.describe)('Family100', () => {
        (0, mocha_1.it)('Family100', (done) => {
            (0, index_js_1.family100)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Family100 JSON', (done) => {
            index_js_1.family100json.map((value) => {
                const parsed = index_js_2.Family100Schema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    (0, mocha_1.describe)('Siapakah Aku', () => {
        (0, mocha_1.it)('Siapakah Aku', (done) => {
            (0, index_js_1.siapakahaku)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Siapakah Aku JSON', (done) => {
            index_js_1.siapakahakujson.map((value) => {
                const parsed = index_js_2.SiapakahAkuSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    (0, mocha_1.describe)('Susun Kata', () => {
        (0, mocha_1.it)('Susun Kata', (done) => {
            (0, index_js_1.susunkata)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Susun Kata JSON', (done) => {
            index_js_1.susunkatajson.map((value) => {
                const parsed = index_js_2.SusunKataSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    (0, mocha_1.describe)('Tebak Bendera', () => {
        (0, mocha_1.it)('Tebak Bendera', (done) => {
            (0, index_js_1.tebakbendera)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Tebak Bendera JSON', (done) => {
            index_js_1.tebakbenderajson.map((value) => {
                const parsed = index_js_2.TebakBenderaSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    (0, mocha_1.describe)('Tebak Gambar', () => {
        (0, mocha_1.it)('Tebak Gambar', (done) => {
            (0, index_js_1.tebakgambar)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Tebak Gambar JSON', (done) => {
            index_js_1.tebakgambarjson.map((value) => {
                const parsed = index_js_2.TebakGambarSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    (0, mocha_1.describe)('Tebak Kabupaten', () => {
        (0, mocha_1.it)('Tebak Kabupaten', (done) => {
            (0, index_js_1.tebakkabupaten)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Tebak Kabupaten JSON', (done) => {
            index_js_1.tebakkabupatenjson.map((value) => {
                const parsed = index_js_2.TebakKabupatenSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    (0, mocha_1.describe)('Tebak Kata', () => {
        (0, mocha_1.it)('Tebak Kata', (done) => {
            (0, index_js_1.tebakkata)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Tebak Kata JSON', (done) => {
            index_js_1.tebakkatajson.map((value) => {
                const parsed = index_js_2.TebakKataSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    (0, mocha_1.describe)('Tebak Kimia', () => {
        (0, mocha_1.it)('Tebak Kimia', (done) => {
            (0, index_js_1.tebakkimia)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Tebak Kimia JSON', (done) => {
            index_js_1.tebakkimiajson.map((value) => {
                const parsed = index_js_2.TebakKimiaSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    (0, mocha_1.describe)('Tebak Lirik', () => {
        (0, mocha_1.it)('Tebak Lirik', (done) => {
            (0, index_js_1.tebaklirik)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Tebak Lirik JSON', (done) => {
            index_js_1.tebaklirikjson.map((value) => {
                const parsed = index_js_2.TebakLirikSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    (0, mocha_1.describe)('Tebak-tebakan', () => {
        (0, mocha_1.it)('Tebak-tebakan', (done) => {
            (0, index_js_1.tebaktebakan)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Tebak-tebakan JSON', (done) => {
            index_js_1.tebaktebakanjson.map((value) => {
                const parsed = index_js_2.TebakTebakanSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    (0, mocha_1.describe)('Teka-teki', () => {
        (0, mocha_1.it)('Teka-teki', (done) => {
            (0, index_js_1.tekateki)().then(() => {
                done();
            }).catch(done);
        });
        (0, mocha_1.it)('Teka-teki JSON', (done) => {
            index_js_1.tekatekijson.map((value) => {
                const parsed = index_js_2.TekaTekiSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
});
