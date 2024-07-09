import { describe, it } from 'mocha';
import { asahotak, asahotakjson, caklontong, caklontongjson, family100, family100json, siapakahaku, siapakahakujson, susunkata, susunkatajson, tebakbendera, tebakbenderajson, tebakgambar, tebakgambarjson, tebakkabupaten, tebakkabupatenjson, tebakkata, tebakkatajson, tebakkimia, tebakkimiajson, tebaklirik, tebaklirikjson, tebaktebakan, tebaktebakanjson, tekateki, tekatekijson } from '../index.js';
import { AsahOtakSchema, CakLontongSchema, Family100Schema, SiapakahAkuSchema, SusunKataSchema, TebakBenderaSchema, TebakGambarSchema, TebakKabupatenSchema, TebakKataSchema, TebakKimiaSchema, TebakLirikSchema, TebakTebakanSchema, TekaTekiSchema } from '../types/index.js';
describe('Games', () => {
    describe('Asah Otak', () => {
        it('Asah Otak', (done) => {
            asahotak().then(() => {
                done();
            }).catch(done);
        });
        it('Asah Otak JSON', (done) => {
            asahotakjson.map((value) => {
                const parsed = AsahOtakSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    describe('Caklontong', () => {
        it('Caklontong', (done) => {
            caklontong().then(() => {
                done();
            }).catch(done);
        });
        it('Caklontong JSON', (done) => {
            caklontongjson.map((value) => {
                const parsed = CakLontongSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    describe('Family100', () => {
        it('Family100', (done) => {
            family100().then(() => {
                done();
            }).catch(done);
        });
        it('Family100 JSON', (done) => {
            family100json.map((value) => {
                const parsed = Family100Schema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    describe('Siapakah Aku', () => {
        it('Siapakah Aku', (done) => {
            siapakahaku().then(() => {
                done();
            }).catch(done);
        });
        it('Siapakah Aku JSON', (done) => {
            siapakahakujson.map((value) => {
                const parsed = SiapakahAkuSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    describe('Susun Kata', () => {
        it('Susun Kata', (done) => {
            susunkata().then(() => {
                done();
            }).catch(done);
        });
        it('Susun Kata JSON', (done) => {
            susunkatajson.map((value) => {
                const parsed = SusunKataSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    describe('Tebak Bendera', () => {
        it('Tebak Bendera', (done) => {
            tebakbendera().then(() => {
                done();
            }).catch(done);
        });
        it('Tebak Bendera JSON', (done) => {
            tebakbenderajson.map((value) => {
                const parsed = TebakBenderaSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    describe('Tebak Gambar', () => {
        it('Tebak Gambar', (done) => {
            tebakgambar().then(() => {
                done();
            }).catch(done);
        });
        it('Tebak Gambar JSON', (done) => {
            tebakgambarjson.map((value) => {
                const parsed = TebakGambarSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    describe('Tebak Kabupaten', () => {
        it('Tebak Kabupaten', (done) => {
            tebakkabupaten().then(() => {
                done();
            }).catch(done);
        });
        it('Tebak Kabupaten JSON', (done) => {
            tebakkabupatenjson.map((value) => {
                const parsed = TebakKabupatenSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    describe('Tebak Kata', () => {
        it('Tebak Kata', (done) => {
            tebakkata().then(() => {
                done();
            }).catch(done);
        });
        it('Tebak Kata JSON', (done) => {
            tebakkatajson.map((value) => {
                const parsed = TebakKataSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    describe('Tebak Kimia', () => {
        it('Tebak Kimia', (done) => {
            tebakkimia().then(() => {
                done();
            }).catch(done);
        });
        it('Tebak Kimia JSON', (done) => {
            tebakkimiajson.map((value) => {
                const parsed = TebakKimiaSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    describe('Tebak Lirik', () => {
        it('Tebak Lirik', (done) => {
            tebaklirik().then(() => {
                done();
            }).catch(done);
        });
        it('Tebak Lirik JSON', (done) => {
            tebaklirikjson.map((value) => {
                const parsed = TebakLirikSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    describe('Tebak-tebakan', () => {
        it('Tebak-tebakan', (done) => {
            tebaktebakan().then(() => {
                done();
            }).catch(done);
        });
        it('Tebak-tebakan JSON', (done) => {
            tebaktebakanjson.map((value) => {
                const parsed = TebakTebakanSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
    describe('Teka-teki', () => {
        it('Teka-teki', (done) => {
            tekateki().then(() => {
                done();
            }).catch(done);
        });
        it('Teka-teki JSON', (done) => {
            tekatekijson.map((value) => {
                const parsed = TekaTekiSchema.safeParse(value);
                if (!parsed.success)
                    done(parsed.error);
            });
            done();
        });
    });
});
