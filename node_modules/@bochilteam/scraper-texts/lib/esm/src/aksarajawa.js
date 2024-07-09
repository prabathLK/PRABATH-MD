/* eslint-disable no-redeclare */
/* eslint-disable no-var */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable eqeqeq */
import { LatinToAksaraSchema, AksaraToLatinSchema } from '../types/index.js';
export function latinToAksara(str, options = { mode: 'ketik', space: true }) {
    const aksara = new Aksara(str, options);
    return LatinToAksaraSchema.parse(aksara.toAksara());
}
export function aksaraToLatin(str, options = { HVokal: false }) {
    const aksara = new Aksara(str, options);
    return AksaraToLatinSchema.parse(aksara.toLatin());
}
// https://bennylin.github.io/transliterasijawa/
// https://jv.wikipedia.org/w/index.php?title=Panganggo:Bennylin/trans.js&action=raw&ctype=text/javascript
const SuperTrim = (str) => str.replace(/^\s*|\s*$/g, '').replace(/\s+/g, ' '); // trim string, menemukan karakter di dalam string
const findstr = (str, find) => {
    for (let i = 0; i < str.length; i++)
        if (str[i] == find)
            return true;
    return false;
};
const isDigit = (a) => findstr('0123456789', a);
const isPunct = (a) => findstr(',.><?/+=-_}{[]*&^%$#@!~`"\\|:;()', a);
const isVowel = (a) => findstr('AaĂăEeÈèÉéIiOoUuÊêĚěĔĕṚṛXxôâāīūōåɔə', a);
const isConsonant = (a) => findstr('BCDfGHJKLMNPQRSTVWYZbcdfghjklmnpqrstvwyzḌḍṆṇṢṣṬṭŊŋÑñɲś', a); // Xx are vowels (pepet)
const isSpecial = (a) => findstr('GgHhRrYyñn', a); // untuk bikonsonan th, dh, ng (nga dan cecak), ny, -r- (cakra), -y- (pengkal), jñ/jnya (ꦘ)
const isHR = (a) => findstr('HhRrŊŋ', a); // untuk layar dan wignyan dan cecak ([[:en:w:Engma]])
const isLW = (a) => findstr('LlWw', a); // untuk panjingan ("ng" dapat diikuti "g", "r"/cakra, "y"/pengkal, dan "w" atau "l"/panjingan)
const isCJ = (a) => findstr('CcJj', a); // untuk anuswara -nj- dan -nc-
const GetSpecialSound = (str) => {
    const specialsoundMap = {
        f: 'ꦥ꦳꧀',
        v: 'ꦮ꦳꧀',
        z: 'ꦗ꦳꧀',
        ś: 'ꦯ꧀',
        Q: '꧀',
        q: '꧀' /* pangkon */
    };
    if (specialsoundMap[str] !== undefined)
        return specialsoundMap[str];
    return null;
};
class Aksara {
    constructor(str, opts = { mode: 'ketik', space: true, HVokal: true }) {
        this.opts = opts;
        this.str = '';
        this.str2 = '';
        this.spasi = '';
        this.str = str.toString();
        this.angkaFlag = opts.number;
        this.cecakFlag = opts.cecak;
        this.diftong = opts.diftong;
        this.modeSpasi = opts.space;
        this.murda = opts.murda;
        this.mode = opts.mode;
        this.isHVokal = opts.HVokal;
    }
    toAksara() {
        let i = 0;
        let ret = '';
        let pi = 0; // ?offset
        const angka = {
            0: '꧐',
            1: '꧑',
            2: '꧒',
            3: '꧓',
            4: '꧔',
            5: '꧕',
            6: '꧖',
            7: '꧗',
            8: '꧘',
            9: '꧙'
        };
        this.str = SuperTrim(this.str);
        while (i < this.str.length) {
            if (i > 0 && isVowel(this.str[i]) && isVowel(this.str[i - 1])) {
                // deal with words that start with multiple vocals
                if ((this.str[i - 1] == 'a' && this.str[i] == 'a') ||
                    (this.str[i - 1] == 'i' && this.str[i] == 'i') ||
                    (this.str[i - 1] == 'u' && this.str[i] == 'u') ||
                    (this.str[i - 1] == 'a' && this.str[i] == 'i') ||
                    (this.str[i - 1] == 'a' && this.str[i] == 'u')) {
                    // specials
                    if (i == 1 || (i > 1 && !isConsonant(this.str[i - 2]))) {
                        // for example if starts with 'ai-'
                        this.str =
                            this.str.substring(0, i) +
                                'h' +
                                this.str.substring(i, this.str.length);
                    }
                    else {
                        // var modeDiftong = document.getElementsByName("diftong");
                        // for (var rad in modeDiftong) {
                        //   if (modeDiftong[rad].checked)
                        //     diftong = modeDiftong[rad].value;
                        // }
                        if (this.diftong) {
                            // do nothing, look in matramap table   if(diftong == "tidak")
                        }
                        else {
                            this.str =
                                this.str.substring(0, i) +
                                    'h' +
                                    this.str.substring(i, this.str.length);
                        }
                    }
                }
                else if ((this.str[i - 1] == 'e' ||
                    this.str[i - 1] == 'è' ||
                    this.str[i - 1] == 'é') &&
                    (this.str[i] == 'a' || this.str[i] == 'o')) {
                    // -y-
                    this.str =
                        this.str.substring(0, i) +
                            'y' +
                            this.str.substring(i, this.str.length);
                }
                else if (this.str[i - 1] == 'i' &&
                    (this.str[i] == 'a' ||
                        this.str[i] == 'e' ||
                        this.str[i] == 'è' ||
                        this.str[i] == 'é' ||
                        this.str[i] == 'o' ||
                        this.str[i] == 'u')) {
                    // -y-
                    this.str =
                        this.str.substring(0, i) +
                            'y' +
                            this.str.substring(i, this.str.length);
                }
                else if (this.str[i - 1] == 'o' &&
                    (this.str[i] == 'a' ||
                        this.str[i] == 'e' ||
                        this.str[i] == 'è' ||
                        this.str[i] == 'é')) {
                    // -w-
                    this.str =
                        this.str.substring(0, i) +
                            'w' +
                            this.str.substring(i, this.str.length);
                }
                else if (this.str[i - 1] == 'u' &&
                    (this.str[i] == 'a' ||
                        this.str[i] == 'e' ||
                        this.str[i] == 'è' ||
                        this.str[i] == 'é' ||
                        this.str[i] == 'i' ||
                        this.str[i] == 'o')) {
                    // -y-
                    this.str =
                        this.str.substring(0, i) +
                            'w' +
                            this.str.substring(i, this.str.length);
                }
                else {
                    this.str =
                        this.str.substring(0, i) +
                            'h' +
                            this.str.substring(i, this.str.length);
                }
            }
            if ((isSpecial(this.str[i]) || isLW(this.str[i]) || isCJ(this.str[i])) &&
                !this.vowelFlag) {
                // i++;
            }
            else if ((this.str[i] == 'h' && this.vowelFlag) ||
                (!isVowel(this.str[i]) && i > 0) ||
                this.str[i] == ' ' ||
                isPunct(this.str[i]) ||
                isDigit(this.str[i]) ||
                i - pi > 5) {
                if (!isDigit(this.str[i]) && this.angkaFlag) {
                    // turn off the flag
                    ret += '꧇​'; // with zws
                    this.angkaFlag = false;
                }
                if (pi < i) {
                    if (this.cecakFlag &&
                        this.GetSound(this.str.substring(pi, i)) == 'ꦁ') {
                        this.cecakFlag = false;
                        ret += 'ꦔ꧀ꦔ';
                    }
                    else if (!this.cecakFlag &&
                        this.GetSound(this.str.substring(pi, i)) == 'ꦁ') {
                        this.cecakFlag = true;
                        ret += 'ꦁ​';
                    }
                    else {
                        this.cecakFlag = false;
                        ret += this.GetSound(this.str.substring(pi, i));
                    }
                }
                if (this.str[i] == ' ') {
                    // var spasi, modeSpasi;
                    // var pakaiSpasi = document.getElementsByName("spasi");
                    // for (var rad in pakaiSpasi) {
                    //   if (pakaiSpasi[rad].checked)
                    //     modeSpasi = pakaiSpasi[rad].value;
                    // }
                    if (this.modeSpasi) {
                        // if space preceeded by open vowel, or layar/wignyan (therefore, no pangkon/virama)
                        if (i > 0 &&
                            ['a', 'e', 'i', 'o', 'u', 'r', 'h', 'ě'].indexOf(this.str[i - 1]) >= 0) {
                            this.spasi = '​'; // zero-width space
                        }
                        else {
                            this.spasi = '';
                        }
                    }
                    else {
                        // if(mode == "with")
                        this.spasi = '​'; // zero-width space
                        // spasi = ' '; }//hair space http://en.wikipedia.org/wiki/Space_(punctuation)#Spaces_in_Unicode
                    }
                    ret += this.spasi;
                }
                if (isPunct(this.str[i])) {
                    if (this.str[i] == '.') {
                        ret += '꧉​'; // titik+zero-width space
                        pi = i + 1;
                    }
                    else if (this.str[i] == ',') {
                        ret += '꧈​'; // koma+zero-width space
                        pi = i + 1;
                    }
                    else if (this.str[i] == ':') {
                        ret += '꧇​'; // titik dua+zero-width space
                        pi = i + 1;
                    }
                    else if (this.str[i] == '|') {
                        ret += '꧋';
                        pi = i + 1;
                        /* comment out, not really a good way to do brackets
                                                                     } else if (str[i] == '(') {
                                                                            ret += "꧌"; pi = i + 1;
                                                                     } else if (str[i] == ')') {
                                                                            ret += "꧍​"; pi = i + 1;// with zws
                                            */
                    }
                    else if (this.str[i] == '-') {
                        // tanda hubung
                        ret += '​';
                        pi = i + 1;
                    }
                    else if (this.str[i] == '?' ||
                        this.str[i] == '!' ||
                        this.str[i] == '"' ||
                        this.str[i] == "'") {
                        // tanda tanya/seru/petik
                        ret += '​'; // zero-width space
                        pi = i + 1;
                    }
                    else {
                        ret += this.str[i];
                        pi = i + 1;
                    }
                }
                else if (isDigit(this.str[i])) {
                    if (!this.angkaFlag)
                        ret += '꧇';
                    ret += angka[this.str[i]];
                    this.angkaFlag = true;
                    pi = i + 1;
                }
                else {
                    pi = i;
                }
                this.vowelFlag = false;
            }
            else if (isVowel(this.str[i]) && this.str[i] != 'h') {
                if (!isDigit(this.str[i]) && this.angkaFlag) {
                    // turn off the flag
                    ret += '꧇​'; // with zws
                    this.angkaFlag = false;
                }
                this.vowelFlag = true;
            }
            if (pi > 0 && isVowel(this.str[pi - 1])) {
                // <vowel>ngg
                this.vowelPrev = true;
            }
            else
                this.vowelPrev = false;
            /* not working
                    if (pi > 0 && findstr(" ",str[pi-1])) {//<vowel>ngg
                            spacePrev = true;
                    }
                    else spacePrev = false; */
            i++;
        } // endwhile
        if (pi < i) {
            ret += this.GetSound(this.str.substring(pi, i));
        }
        return SuperTrim(ret).toString();
    }
    GetMatra(str) {
        let i = 0;
        if (str.length < 1) {
            return '꧀';
        }
        while (str[i] == 'h') {
            i++;
            if (i >= str.length) {
                break;
            }
        }
        if (i < str.length) {
            str = str.substring(i);
        }
        const matramap1 = { e: 'ꦺ', E: 'ꦌ' }; // mode ketik
        const matramap2 = { e: 'ꦼ', E: 'ꦄꦼ' }; // mode kopas
        const matramap3 = {
            // both mode ketik and kopas
            ā: 'ꦴ',
            â: 'ꦴ',
            aa: 'ꦴ',
            è: 'ꦺ',
            é: 'ꦺ',
            i: 'ꦶ',
            ī: 'ꦷ',
            ii: 'ꦷ',
            o: 'ꦺꦴ',
            ō: 'ꦼꦴ',
            u: 'ꦸ',
            ū: 'ꦹ',
            uu: 'ꦹ',
            x: 'ꦼ',
            ě: 'ꦼ',
            ĕ: 'ꦼ',
            ê: 'ꦼ',
            ə: 'ꦼ',
            ô: '',
            ă: '',
            å: '',
            ɔ: '',
            A: 'ꦄ',
            Ă: 'ꦄ',
            È: 'ꦌ',
            É: 'ꦌ',
            I: 'ꦆ',
            O: 'ꦎ',
            U: 'ꦈ',
            X: 'ꦄꦼ',
            Ě: 'ꦄꦼ',
            Ĕ: 'ꦄꦼ',
            Ê: 'ꦄꦼ',
            ṛ: 'ꦽ',
            Ṛ: 'ꦽ',
            ai: 'ꦻ',
            au: 'ꦻꦴ'
        };
        // var matramap, mode;
        // var modeTranslit = document.getElementsByName("mode");
        // for (var rad in modeTranslit) {
        //   if (modeTranslit[rad].checked)
        //     mode = modeTranslit[rad].value;
        // }
        if (this.mode == 'kopas')
            var matramap = { ...matramap2, ...matramap3 };
        // if(mode == "ketik")
        else
            var matramap = { ...matramap1, ...matramap3 };
        if (matramap[str] !== undefined) {
            return matramap[str];
        }
        return '';
    }
    GetShift(str1) {
        const str = str1.toLowerCase(); // case insensitive
        // var modeMurda = document.getElementsByName("murda");
        // for (var rad in modeMurda) {
        //   if (modeMurda[rad].checked)
        //     murda = modeMurda[rad].value;
        // }
        if (this.murda)
            this.str2 = str1;
        // case sensitive (particularly the 8 characters of ꦛ ꦜ ꦝ ꦞ ꦠ ꦡ ꦢ ꦣ),
        // for combination of murda and cakra/pengkal/panjingan
        // if(murda == "tidak")
        else
            this.str2 = str1.toLowerCase(); // case insensitive
        // V.1. 2nd letter of the consonant cluster is 'h'
        if (this.str2.indexOf('th') == 0) {
            // suku kata diawali 'th'
            if (this.str2.indexOf('thl') == 0) {
                // thl-
                return { CoreSound: 'ꦛ꧀ꦭ', len: 3 };
            }
            else if (this.str2.indexOf('thr') == 0) {
                // thr-
                return { CoreSound: 'ꦛꦿ', len: 3 };
            }
            else if (this.str2.indexOf('thw') == 0) {
                // thw-
                return { CoreSound: 'ꦛ꧀ꦮ', len: 3 };
            }
            else if (this.str2.indexOf('thy') == 0) {
                // thy-
                return { CoreSound: 'ꦛꦾ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦛ', len: 2 }; // tha
            }
        }
        else if (this.str2.indexOf('dh') == 0) {
            // suku kata diawali 'dh'
            if (this.str2.indexOf('dhl') == 0) {
                // dhl-
                return { CoreSound: 'ꦝ꧀ꦭ', len: 3 };
            }
            else if (this.str2.indexOf('dhr') == 0) {
                // dhr-
                return { CoreSound: 'ꦝꦿ', len: 3 };
            }
            else if (this.str2.indexOf('dhw') == 0) {
                // dhw-: dhwani
                return { CoreSound: 'ꦝ꧀ꦮ', len: 3 };
            }
            else if (this.str2.indexOf('dhy') == 0) {
                // dhy-: dhyaksa
                return { CoreSound: 'ꦝꦾ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦝ', len: 2 }; // dha
            }
        }
        else if (this.str2.indexOf('Th') == 0) {
            // suku kata diawali 'Th'
            if (this.str2.indexOf('Thl') == 0) {
                // Thl-
                return { CoreSound: 'ꦜ꧀ꦭ', len: 3 };
            }
            else if (this.str2.indexOf('Thr') == 0) {
                // Thr-
                return { CoreSound: 'ꦜꦿ', len: 3 };
            }
            else if (this.str2.indexOf('Thw') == 0) {
                // Thw-
                return { CoreSound: 'ꦜ꧀ꦮ', len: 3 };
            }
            else if (this.str2.indexOf('Thy') == 0) {
                // Thy-
                return { CoreSound: 'ꦜꦾ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦜ', len: 2 }; // Tha Mahaprana
            }
        }
        else if (this.str2.indexOf('Dh') == 0) {
            // suku kata diawali 'Dh'
            if (this.str2.indexOf('Dhl') == 0) {
                // Dhl-
                return { CoreSound: 'ꦞ꧀ꦭ', len: 3 };
            }
            else if (this.str2.indexOf('Dhr') == 0) {
                // Dhr-
                return { CoreSound: 'ꦞꦿ', len: 3 };
            }
            else if (this.str2.indexOf('Dhw') == 0) {
                // Dhw-: Dhwani
                return { CoreSound: 'ꦞ꧀ꦮ', len: 3 };
            }
            else if (this.str2.indexOf('Dhy') == 0) {
                // Dhy-: Dhyaksa
                return { CoreSound: 'ꦞꦾ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦞ', len: 2 }; // Dha Mahaprana
            }
            /* murda block start */
        }
        else if (str.indexOf('ṭh') == 0) {
            // ṭh (aksara murda: tha mahaprana)
            if (str.indexOf('ṭhy') == 0) {
                return { CoreSound: 'ꦜꦾ', len: 2 };
            }
            else if (str.indexOf('ṭhr') == 0) {
                return { CoreSound: 'ꦜꦿ', len: 2 };
            }
            else
                return { CoreSound: 'ꦜ', len: 2 };
        }
        else if (str.indexOf('ḍh') == 0) {
            // ḍh (aksara murda: dha mahaprana)
            if (str.indexOf('ḍhy') == 0) {
                return { CoreSound: 'ꦞꦾ', len: 2 };
            }
            else if (str.indexOf('ḍhr') == 0) {
                return { CoreSound: 'ꦞꦿ', len: 2 };
            }
            else
                return { CoreSound: 'ꦞ', len: 2 };
        }
        else if (str.indexOf('kh') == 0) {
            // kh (aksara murda: ka murda)
            if (str.indexOf('khl') == 0) {
                // ka murda + panjingan la
                return { CoreSound: 'ꦑ꧀ꦭ', len: 3 };
            }
            else if (str.indexOf('khr') == 0) {
                // ka murda + cakra
                return { CoreSound: 'ꦑꦿ', len: 3 };
            }
            else if (str.indexOf('khw') == 0) {
                // ka murda + panjingan wa
                return { CoreSound: 'ꦑ꧀ꦮ', len: 3 };
            }
            else if (str.indexOf('khy') == 0) {
                // ka murda + wignyan
                return { CoreSound: 'ꦑꦾ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦑ', len: 2 };
            }
        }
        else if (str.indexOf('gh') == 0) {
            // gh (aksara murda: ga murda)
            if (str.indexOf('ghl') == 0) {
                // ga murda + panjingan la
                return { CoreSound: 'ꦓ꧀ꦭ', len: 3 };
            }
            else if (str.indexOf('ghw') == 0) {
                // ga murda + panjingan wa
                return { CoreSound: 'ꦓ꧀ꦮ', len: 3 };
            }
            else if (str.indexOf('ghr') == 0) {
                // ga murda + cakra
                return { CoreSound: 'ꦓꦿ', len: 3 };
            }
            else if (str.indexOf('ghy') == 0) {
                // ga murda + wignyan
                return { CoreSound: 'ꦓꦾ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦓ', len: 2 };
            }
        }
        else if (str.indexOf('ch') == 0) {
            // ch (aksara murda: ca murda)
            if (str.indexOf('chl') == 0) {
                // ca murda + panjingan la
                return { CoreSound: 'ꦖ꧀ꦭ', len: 3 };
            }
            else if (str.indexOf('chr') == 0) {
                // ca murda + cakra
                return { CoreSound: 'ꦖꦿ', len: 3 };
            }
            else if (str.indexOf('chw') == 0) {
                // ca murda + panjingan wa
                return { CoreSound: 'ꦖ꧀ꦮ', len: 3 };
            }
            else if (str.indexOf('chy') == 0) {
                // ca murda + wignyan
                return { CoreSound: 'ꦖꦾ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦖ', len: 2 };
            }
        }
        else if (str.indexOf('jh') == 0) {
            // jh (aksara murda: ja mahaprana)
            if (str.indexOf('jhl') == 0) {
                // ja mahaprana + panjingan la
                return { CoreSound: 'ꦙ꧀​ꦭ', len: 3 }; // with zws, otherwise the panjingan is overlapped
            }
            else if (str.indexOf('jhr') == 0) {
                // ja mahaprana + cakra
                return { CoreSound: 'ꦙꦿ', len: 3 };
            }
            else if (str.indexOf('jhw') == 0) {
                // ja mahaprana + panjingan wa
                return { CoreSound: 'ꦙ꧀ꦮ', len: 3 };
            }
            else if (str.indexOf('jhy') == 0) {
                // ja mahaprana + wignyan
                return { CoreSound: 'ꦙꦾ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦙ', len: 2 };
            }
        }
        else if (str.indexOf('ph') == 0) {
            // ph (aksara murda: pa murda)
            if (str.indexOf('phl') == 0) {
                // pa murda + panjingan la
                return { CoreSound: 'ꦦ꧀ꦭ', len: 3 };
            }
            else if (str.indexOf('phr') == 0) {
                // pa murda + cakra
                return { CoreSound: 'ꦦꦿ', len: 3 };
            }
            else if (str.indexOf('phw') == 0) {
                // pa murda + panjingan wa
                return { CoreSound: 'ꦦ꧀ꦮ', len: 3 };
            }
            else if (str.indexOf('phy') == 0) {
                // pa murda + wignyan
                return { CoreSound: 'ꦦꦾ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦦ', len: 2 };
            }
        }
        else if (str.indexOf('bh') == 0) {
            // bh (aksara murda: ba murda)
            if (str.indexOf('bhl') == 0) {
                // ba murda + panjingan la
                return { CoreSound: 'ꦨ꧀ꦭ', len: 3 };
            }
            else if (str.indexOf('bhr') == 0) {
                // ba murda + cakra
                return { CoreSound: 'ꦨꦿ', len: 3 };
            }
            else if (str.indexOf('bhw') == 0) {
                // ba murda + panjingan wa
                return { CoreSound: 'ꦨ꧀ꦮ', len: 3 };
            }
            else if (str.indexOf('bhy') == 0) {
                // ba murda + wignyan
                return { CoreSound: 'ꦨꦾ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦨ', len: 2 };
            }
        }
        else if (str.indexOf('sh') == 0) {
            // sh (aksara murda: sa murda)
            if (str.indexOf('shl') == 0) {
                // sa murda + panjingan la
                return { CoreSound: 'ꦯ꧀ꦭ', len: 3 };
            }
            else if (str.indexOf('shr') == 0) {
                // sa murda + cakra
                return { CoreSound: 'ꦯꦿ', len: 3 };
            }
            else if (str.indexOf('shw') == 0) {
                // sa murda + panjingan wa
                return { CoreSound: 'ꦯ꧀ꦮ', len: 3 };
            }
            else if (str.indexOf('shy') == 0) {
                // sa murda + wignyan
                return { CoreSound: 'ꦯꦾ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦯ', len: 2 };
            }
            /* murda block end */
            // Uncatched exception: -h followed by hy, hr, hl, hw
        }
        else if (str.indexOf('hh') == 0) {
            // wignyan + ha, e.g. root word ends with 'h' with suffix -i
            return { CoreSound: 'ꦃꦲ', len: 2 };
            // Uncatched exception: -r followed by hy, hr, hl, hw
        }
        else if (str.indexOf('rh') == 0) {
            // layar + ha
            return { CoreSound: 'ꦂꦲ', len: 2 };
        }
        else if (str.indexOf('h') == 1) {
            // h (h di posisi karakter kedua)
            return {
                CoreSound: '' + this.GetCoreSound(this.str2[0]).CoreSound + '꧀ꦲ',
                len: 2
            };
        }
        // V.2. 2nd letter is 'g'
        if (str.indexOf('ng') == 0) {
            // suku kata diawali 'ng'
            // Uncatched exception: -ng followed by ry, rw, rl
            if (str.indexOf('ngr') == 0) {
                // cakra (for cecak + ra, separate by a space)
                return { CoreSound: '' + 'ꦔꦿ', len: 3 };
            }
            else if (str.indexOf('ngy') == 0) {
                // pengkal (for cecak + ya, separate by a space)
                return { CoreSound: '' + 'ꦔꦾ', len: 3 };
                // Uncatched exception: -ng followed by hy, hr, hl
            }
            else if (str.indexOf('nghw') == 0) {
                // tyonghwa
                return { CoreSound: '' + 'ꦁꦲ꧀ꦮ​', len: 4 };
            }
            else if (str.indexOf('ngg') == 0) {
                // cecak + ga
                if (str.indexOf('nggr') == 0) {
                    // nggronjal
                    return { CoreSound: 'ꦔ꧀ꦒꦿ', len: 4 };
                }
                else if (str.indexOf('nggl') == 0) {
                    // nggl-
                    return { CoreSound: 'ꦔ꧀ꦒ꧀ꦭ', len: 4 };
                }
                else if (str.indexOf('nggw') == 0) {
                    // nggw-, munggwing
                    return { CoreSound: 'ꦔ꧀ꦒ꧀ꦮ', len: 4 };
                }
                else if (str.indexOf('nggy') == 0) {
                    // nggy-, anggyat
                    return { CoreSound: 'ꦔ꧀ꦒꦾ', len: 4 };
                }
                else {
                    return { CoreSound: 'ꦔ꧀ꦒ', len: 3 };
                }
            }
            else if (str.indexOf('ngn') == 0) {
                // cecak + na
                // Uncatched exception: -ng followed by ngy, ngr, ngl, ngw
                if (str.indexOf('ngng') == 0) {
                    // ngng
                    return { CoreSound: 'ꦁ​ꦔ', len: 4 };
                }
                else {
                    return { CoreSound: 'ꦁ​ꦤ', len: 3 };
                }
            }
            else if (str.indexOf('ngh') == 0) {
                // cecak + ha
                return { CoreSound: 'ꦁ​ꦲ', len: 3 };
            }
            else if (str.indexOf('ngc') == 0) {
                // cecak + ca
                return { CoreSound: 'ꦁ​ꦕ', len: 3 };
            }
            else if (str.indexOf('ngj') == 0) {
                // cecak + ja
                return { CoreSound: 'ꦁ​ꦗ', len: 3 };
            }
            else if (str.indexOf('ngl') == 0) {
                // ngl, e.g. ngluwari
                return { CoreSound: 'ꦔ꧀ꦭ', len: 3 };
            }
            else if (str.indexOf('ngw') == 0) {
                // ngw, e.g. ngwiru
                return { CoreSound: 'ꦔ꧀ꦮ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦁ​', len: 2 }; // cecak, with zws
            }
        }
        else if (str.indexOf('gg') == 0) {
            // 'gg', e.g. root word ends with 'g' with suffix -i
            return { CoreSound: 'ꦒ꧀ꦒ', len: 2 };
        }
        else if (str.indexOf('hg') == 0) {
            // wignyan + ga, e.g. dahgene
            return { CoreSound: 'ꦃꦒ', len: 2 };
        }
        else if (str.indexOf('rg') == 0) {
            // layar + ga, e.g. amarga
            return { CoreSound: 'ꦂꦒ', len: 2 };
        }
        else if (str.indexOf('g') == 1) {
            // g (g di posisi karakter kedua)
            return {
                CoreSound: '' + this.GetCoreSound(this.str2[0]).CoreSound + '꧀ꦒ',
                len: 2
            };
        }
        // V.3. 2nd letter is 'y'
        if (str.indexOf('ny') == 0) {
            // suku kata diawali 'ny'
            if (str.indexOf('nyr') == 0) {
                // cakra
                return { CoreSound: 'ꦚꦿ', len: 3 }; /*
      } else if (str.indexOf("nyy") == 0) { //nyy, I don't think it's possible
        return { "CoreSound": "ꦚꦾ", "len": 3 }; */
            }
            else if (str.indexOf('nyl') == 0) {
                // nyl, e.g. nylonong
                return { CoreSound: 'ꦚ꧀ꦭ', len: 3 };
            }
            else if (str.indexOf('nyw') == 0) {
                // nyw
                return { CoreSound: 'ꦚ꧀ꦮ', len: 3 }; /*
        } else if (str2.indexOf("Ny") == 0) { //Na murda + pengkal, unlikely combination?
            return { "CoreSound": "ꦟꦾ", "len": 2  }; */
            }
            else {
                return { CoreSound: 'ꦚ', len: 2 };
            }
        }
        else if (str.indexOf('hy') == 0) {
            // wignyan + ya / ha + pengkal -- hyang
            return { CoreSound: 'ꦲꦾ', len: 2 };
        }
        else if (this.str2.indexOf('ry') == 0) {
            // layar + ya, e.g. Suryati, Wiryadi
            if (str.indexOf('ryy') == 0) {
                return { CoreSound: 'ꦂꦪꦾ', len: 3 }; // 'ryy', e.g. Duryyodhana (Jawa Kuno)
            }
            else {
                return { CoreSound: 'ꦂꦪ', len: 2 };
            } /*
    } else if (str.indexOf("yy") == 0) { //'yy', I don't think it's possible
        return { "CoreSound": "ꦪꦾ", "len": 2 }; */
        }
        else if (this.str2.indexOf('qy') == 0) {
            // qy -- only pengkal
            return { CoreSound: 'ꦾ', len: 1 };
        }
        else if (str.indexOf('y') == 1) {
            // pengkal (y di posisi karakter kedua)
            return {
                CoreSound: '' + this.GetCoreSound(this.str2[0]).CoreSound + 'ꦾ',
                len: 2
            };
        }
        // V.4. 2nd letter is 'r'
        // Uncatched exception: -h followed by ry, rw, rl
        if (str.indexOf('hr') == 0) {
            // wignyan + ra / ha + cakra
            return { CoreSound: 'ꦲꦿ', len: 2 };
        }
        else if (str.indexOf('wr') == 0) {
            // wr -- panjingan + cakra
            return { CoreSound: '' + 'ꦮꦿ', len: 2 };
            // Uncatched exception: -r followed by ry, rw, rl
        }
        else if (str.indexOf('rr') == 0) {
            // layar + ra (no cakra)
            return { CoreSound: 'ꦂꦫ', len: 2 };
        }
        else if (this.str2.indexOf('qr') == 0) {
            // qr -- only pasangan ra
            return { CoreSound: '꧀ꦫ', len: 1 };
        }
        else if (this.str2.indexOf('qR') == 0) {
            // qR -- only cakra
            return { CoreSound: 'ꦿ', len: 1 };
        }
        else if (str.indexOf('r') == 1) {
            // cakra (r di posisi karakter kedua)
            return {
                CoreSound: '' + this.GetCoreSound(this.str2[0]).CoreSound + 'ꦿ',
                len: 2
            };
        }
        // V.5. 2nd letter is 'l' or 'w'
        // panjingan -l
        if (str.indexOf('hl') == 0) {
            // wignyan + la
            return { CoreSound: 'ꦃꦭ', len: 2 };
        }
        else if (str.indexOf('rl') == 0) {
            // layar + la
            return { CoreSound: 'ꦂꦭ', len: 2 };
        }
        else if (str.indexOf('ll') == 0) {
            // ll
            return { CoreSound: 'ꦭ꧀ꦭ', len: 2 };
        }
        else if (str.indexOf('ql') == 0) {
            // only panjingan
            return { CoreSound: '꧀ꦭ', len: 2 };
        }
        else if (str.indexOf('l') == 1) {
            // (l di posisi karakter kedua)
            return {
                CoreSound: '' + this.GetCoreSound(this.str2[0]).CoreSound + '꧀ꦭ',
                len: 2
            };
        }
        // panjingan -w
        if (str.indexOf('hw') == 0) {
            // wignyan + ha
            return { CoreSound: 'ꦃꦮ', len: 2 }; // ꦲ꧀ꦮ
        }
        else if (str.indexOf('rw') == 0) {
            // layar + ha
            return { CoreSound: 'ꦂꦮ', len: 2 }; // error untuk 'rwi', 'rwab'
        }
        else if (str.indexOf('ww') == 0) {
            // ww (wwang, pûrwwa) - terima kasih Mas Revo
            return { CoreSound: 'ꦮ꧀ꦮ', len: 2 };
        }
        else if (str.indexOf('qw') == 0) {
            // only panjingan
            return { CoreSound: '꧀ꦮ', len: 2 };
        }
        else if (str.indexOf('w') == 1) {
            // (w di posisi karakter kedua)
            return {
                CoreSound: '' + this.GetCoreSound(this.str2[0]).CoreSound + '꧀ꦮ',
                len: 2
            };
        }
        // V.6. 2nd letter is 'c' or 'j'
        if (str.indexOf('nc') == 0) {
            // nc
            if (str.indexOf('ncr') == 0) {
                // ncr -- kencrung
                return { CoreSound: 'ꦚ꧀ꦕꦿ', len: 3 };
            }
            else if (str.indexOf('ncl') == 0) {
                // ncl -- kinclong
                return { CoreSound: 'ꦚ꧀ꦕ꧀ꦭ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦚ꧀ꦕ', len: 2 };
            }
        }
        else if (str.indexOf('hc') == 0) {
            // wignyan + ca
            return { CoreSound: 'ꦃꦕ', len: 2 };
        }
        else if (str.indexOf('rc') == 0) {
            // layar + ca -- arca
            return { CoreSound: 'ꦂꦕ', len: 2 };
        }
        else if (str.indexOf('cc') == 0) {
            // cc -- impossible combination in real text
            return { CoreSound: 'ꦕ꧀ꦕ', len: 2 };
        }
        else if (this.str2.indexOf('qc') == 0) {
            // only pasangan ca
            return { CoreSound: '꧀ꦕ', len: 2 };
        }
        else if (str.indexOf('c') == 1) {
            // c
            return {
                CoreSound: '' + this.GetCoreSound(this.str2[0]).CoreSound + '꧀ꦕ',
                len: 2
            };
        }
        if (str.indexOf('nj') == 0) {
            // nj
            if (str.indexOf('njr') == 0) {
                // njr -- anjrit
                return { CoreSound: 'ꦚ꧀ꦗꦿ', len: 3 };
            }
            else if (str.indexOf('njl') == 0) {
                // njl -- anjlog
                return { CoreSound: 'ꦚ꧀ꦗ꧀ꦭ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦚ꧀ꦗ', len: 2 };
            }
        }
        else if (str.indexOf('hj') == 0) {
            // wignyan + ja
            return { CoreSound: 'ꦃꦗ', len: 2 };
        }
        else if (str.indexOf('rj') == 0) {
            // layar + ja
            return { CoreSound: 'ꦂꦗ', len: 2 };
        }
        else if (str.indexOf('jj') == 0) {
            // jj -- impossible combination in real text
            return { CoreSound: 'ꦗ꧀ꦗ', len: 2 };
        }
        else if (this.str2.indexOf('qj') == 0) {
            // only pasangan ja
            return { CoreSound: '꧀ꦗ', len: 2 };
        }
        else if (str.indexOf('j') == 1) {
            // j
            return {
                CoreSound: '' + this.GetCoreSound(this.str2[0]).CoreSound + '꧀ꦗ',
                len: 2
            };
        }
        // V.7. 2nd letter is 'ñ' or 'n'
        if (str.indexOf('jñ') == 0) {
            // suku kata diawali 'jñ'
            if (str.indexOf('jñl') == 0) {
                // suku kata diawali 'jñ' - nya murda
                return { CoreSound: 'ꦘ꧀ꦭ', len: 3 };
            }
            else if (str.indexOf('jñr') == 0) {
                // nya murda + cakra
                return { CoreSound: 'ꦘꦿ', len: 3 };
            }
            else if (str.indexOf('jñw') == 0) {
                // nya murda + panjingan wa
                return { CoreSound: 'ꦘ꧀ꦮ', len: 3 };
            }
            else if (str.indexOf('jñy') == 0) {
                // nya murda + wignyan
                return { CoreSound: 'ꦘꦾ', len: 3 };
            }
            else {
                return { CoreSound: 'ꦘ', len: 2 };
            }
        }
        else if (str.indexOf('jn') == 0) {
            // suku kata diawali 'jn'
            if (str.indexOf('jny') == 0) {
                // suku kata diawali 'jny' - nya murda
                if (str.indexOf('jnyl') == 0) {
                    // suku kata diawali 'jny' - nya murda
                    return { CoreSound: 'ꦘ꧀ꦭ', len: 4 };
                }
                else if (str.indexOf('jnyr') == 0) {
                    // nya murda + cakra
                    return { CoreSound: 'ꦘꦿ', len: 4 };
                }
                else if (str.indexOf('jnyw') == 0) {
                    // nya murda + panjingan wa
                    return { CoreSound: 'ꦘ꧀ꦮ', len: 4 };
                }
                else if (str.indexOf('jnyy') == 0) {
                    // nya murda + wignyan
                    return { CoreSound: 'ꦘꦾ', len: 4 };
                }
                else {
                    return { CoreSound: 'ꦘ', len: 3 };
                }
            }
            else {
                return { CoreSound: 'ꦗ꧀ꦤ', len: 2 };
            }
            // Uncatched exception: -h followed by ngy, ngr, ngl, ngw
        }
        else if (str.indexOf('hn') == 0) {
            // wignyan + na
            return { CoreSound: 'ꦃꦤ', len: 2 };
            // Uncatched exception: -r followed by ngy, ngr, ngl, ngw
        }
        else if (str.indexOf('rn') == 0) {
            // layar + na
            return { CoreSound: 'ꦂꦤ', len: 2 };
        }
        else if (str.indexOf('nn') == 0) {
            // nn, e.g. root word ends with 'n' with suffix -i
            if (str.indexOf('nng') == 0) {
                //
                return { CoreSound: 'ꦤ꧀ꦁ​', len: 3 };
            }
            else if (str.indexOf('nng') == 0) {
                //
                return { CoreSound: 'ꦤ꧀ꦚ꧀', len: 3 };
            }
            else {
                return { CoreSound: 'ꦤ꧀ꦤ', len: 2 };
            }
        }
        else if (this.str2.indexOf('qn') == 0) {
            // only pasangan na
            return { CoreSound: '꧀ꦤ', len: 2 };
        }
        else if (str.indexOf('ñ') == 1) {
            // huruf asing sih sebenarnya, kemungkinan kecil muncul
            return {
                CoreSound: '' + this.GetCoreSound(this.str2[0]).CoreSound + '꧀ꦚ',
                len: 2
            };
        }
        else if (str.indexOf('n') == 1) {
            //
            return {
                CoreSound: '' + this.GetCoreSound(this.str2[0]).CoreSound + '꧀ꦤ',
                len: 2
            };
        }
        // suku kata memiliki konsonan tersebut yang tidak di posisi kedua
        if (str.indexOf('h') > 1 ||
            str.indexOf('g') > 1 ||
            str.indexOf('y') > 1 ||
            str.indexOf('r') > 1 ||
            str.indexOf('l') > 1 ||
            str.indexOf('w') > 1 ||
            str.indexOf('c') > 1 ||
            str.indexOf('j') > 1 ||
            str.indexOf('n') > 1 ||
            str.indexOf('ñ') > 1) {
            let sound = '';
            let len = 0;
            let index = 0;
            for (index = 0; index < str.length; index++) {
                const c = str[index];
                if (!isVowel(c)) {
                    sound += this.ResolveCharacterSound(c);
                    len++;
                }
                else {
                    break;
                }
            }
            return { CoreSound: sound, len: len };
        }
        return { CoreSound: null, len: 1 };
    }
    GetCoreSound(str) {
        const soundMap1 = {
            // 26 uppercase for non-Murda, largely mirror lowercase, except AEIOU, and HR
            A: 'ꦄ',
            B: 'ꦧ',
            C: 'ꦕ',
            D: 'ꦢ',
            E: 'ꦌ',
            F: 'ꦥ꦳',
            G: 'ꦒ',
            H: 'ꦲ',
            I: 'ꦆ',
            J: 'ꦗ',
            K: 'ꦏ',
            L: 'ꦭ',
            M: 'ꦩ',
            N: 'ꦤ',
            O: 'ꦎ',
            P: 'ꦥ',
            Q: '꧀',
            R: 'ꦫ',
            S: 'ꦱ',
            T: 'ꦠ',
            U: 'ꦈ',
            V: 'ꦮ꦳',
            W: 'ꦮ',
            X: 'ꦼ',
            Y: 'ꦪ',
            Z: 'ꦰ' // Sa Mahaprana
            // test: ABaCaDaEFaGaHaJaKaLaMaNaOPaRaSaTaUVaWaXYaZa
        };
        const soundMap2 = {
            // 26 uppercase for Murda (notice for J, Q, R, and Z)
            A: 'ꦄ',
            B: 'ꦨ',
            C: 'ꦖ',
            D: 'ꦣ',
            E: 'ꦌ',
            F: 'ꦦ꦳',
            G: 'ꦓ',
            H: 'ꦲ꦳',
            I: 'ꦆ',
            J: 'ꦙ',
            K: 'ꦑ',
            L: 'ꦭ',
            M: 'ꦩ',
            N: 'ꦟ',
            O: 'ꦎ',
            P: 'ꦦ',
            Q: 'ꦐ',
            R: 'ꦬ',
            S: 'ꦯ',
            T: 'ꦡ',
            U: 'ꦈ',
            V: 'ꦮ꦳',
            W: 'ꦮ',
            X: 'ꦼ',
            Y: 'ꦪ',
            Z: 'ꦰ' // Sa mahaprana
            // test: ABaCaDaEFaGaHaJaKaLaMaNaOPaQaRaSaTaUVaWaXaYaZa
        };
        const soundMap3 = {
            // 26 lowercase + 35 special, same for both Murda or non-Murda
            a: 'ꦲ',
            b: 'ꦧ',
            c: 'ꦕ',
            d: 'ꦢ',
            e: 'ꦲꦺ',
            f: 'ꦥ꦳',
            g: 'ꦒ',
            h: 'ꦃ',
            i: 'ꦲꦶ',
            j: 'ꦗ',
            k: 'ꦏ',
            l: 'ꦭ',
            m: 'ꦩ',
            n: 'ꦤ',
            o: 'ꦲꦺꦴ',
            p: 'ꦥ',
            q: '꧀',
            r: 'ꦂ',
            s: 'ꦱ',
            t: 'ꦠ',
            u: 'ꦲꦸ',
            v: 'ꦮ꦳',
            w: 'ꦮ',
            x: 'ꦲꦼ',
            y: 'ꦪ',
            z: 'ꦗ꦳',
            È: 'ꦌ',
            É: 'ꦌ',
            Ê: 'ꦄꦼ',
            Ě: 'ꦄꦼ',
            Ĕ: 'ꦄꦼ',
            è: 'ꦲꦺ',
            é: 'ꦲꦺ',
            ê: 'ꦲꦼ',
            ě: 'ꦲꦼ',
            ĕ: 'ꦲꦼ',
            ə: 'ꦲꦼ',
            ɔ: 'ꦲ',
            å: 'ꦲ',
            ô: 'ꦲ',
            â: 'ꦲꦴ',
            ā: 'ꦲꦴ',
            ī: 'ꦲꦷ',
            ū: 'ꦲꦹ',
            ō: 'ꦲꦼꦴ',
            Ñ: 'ꦚ',
            ñ: 'ꦚ',
            ɲ: 'ꦚ',
            Ŋ: 'ꦔ',
            ŋ: 'ꦔ',
            Ṇ: 'ꦟ',
            ṇ: 'ꦟ',
            Ḍ: 'ꦝ',
            ḍ: 'ꦝ',
            Ṭ: 'ꦛ',
            ṭ: 'ꦛ',
            ś: 'ꦯ',
            Ṣ: 'ꦰ',
            ṣ: 'ꦰ',
            Ṛ: 'ꦽ',
            ṛ: 'ꦽ' // idem
            // test: Èè.Éé.Êê.Ěě.Ĕĕ.Ṛṛ.ôâāīūōåɔə
            // test: ḌaḍaṆaṇaṢaṣaṬaṭaŊaŋaÑañaɲaśa
        };
        let soundMap;
        // var modeMurda = document.getElementsByName("murda");
        // for (var rad in modeMurda) {
        //   if (modeMurda[rad].checked)
        //     murda = modeMurda[rad].value;
        // }
        if (this.murda)
            soundMap = { ...soundMap2, ...soundMap3 };
        // if(murda == "tidak")
        else
            soundMap = { ...soundMap1, ...soundMap3 };
        const h_shift = this.GetShift(str);
        let core = str;
        if (h_shift.CoreSound == null) {
            if (soundMap[str.charAt(0)])
                core = soundMap[str.charAt(0)];
            return {
                CoreSound: core,
                len: 1
            };
        }
        else {
            return h_shift;
        }
    }
    ResolveCharacterSound(c) {
        const str = c.toString();
        if (isDigit(c)) {
            return '' + ('꧇' + (parseInt(c) - 0));
        }
        else if (isHR(str[0])) {
            return '' + this.GetCoreSound(str).CoreSound; // layar dan wignyan
        }
        else if (isCJ(str[1])) {
            return '' + this.GetCoreSound(str).CoreSound + '꧀'; // anuswara
        }
        else if (isConsonant(str[0])) {
            return '' + this.GetCoreSound(str).CoreSound + '꧀';
        }
        else {
            // if (isVowel(str[0])) {
            return '' + this.GetCoreSound(str).CoreSound;
        }
    }
    GetSound(str) {
        str = SuperTrim(str);
        this.str2 = str.toLowerCase();
        if (str == null || str == '')
            return '';
        const SpecialSound = GetSpecialSound(str);
        if (SpecialSound != null && str.length == 1)
            return SpecialSound;
        if (str.length == 1)
            return this.ResolveCharacterSound(str[0]);
        else {
            const core_sound = this.GetCoreSound(str);
            // return "1"+core_sound.CoreSound+"2";
            let matra = '';
            let konsonan = '';
            if (core_sound.len >= 1) {
                matra = this.GetMatra(str.substring(core_sound.len)); // xeiou (pepet, taling, suku, taling tarung, wulu, dll.)
                /* if () {
      
                            } else {
      
                            } */
            }
            else {
                matra = '';
            } // a/å/ɔ
            /* rules for some cluster like ngg- that have different behaviour depending if it's the start of a word or not.
                    TODO: find more elegant solution */
            if (this.str2.indexOf('nggr') == 0) {
                // nggr-
                if (this.vowelPrev)
                    konsonan = 'ꦁ​ꦒꦿ';
                // <vowel>nggr-, e.g. panggrahita
                // else if (matra = "")
                else
                    konsonan = 'ꦔ꧀ꦒꦿ'; // <nonvowel>nggr-, i.e. nggronjal
            }
            else if (this.str2.indexOf('nggl') == 0) {
                // nggl-, e.g. ngglantung
                konsonan = 'ꦔ꧀ꦒ꧀ꦭ';
            }
            else if (this.str2.indexOf('nggw') == 0) {
                // nggw-, e.g. munggwing
                konsonan = 'ꦔ꧀ꦒ꧀ꦮ';
            }
            else if (this.str2.indexOf('nggy') == 0) {
                // nggy-, e.g. anggyat
                konsonan = 'ꦔ꧀ꦒꦾ';
            }
            else if (this.str2.indexOf('ngg') == 0) {
                // ngg-
                if (this.vowelPrev)
                    konsonan = 'ꦁ​ꦒ';
                // <vowel>ngg-, e.g. tunggal
                // else if (spacePrev) konsonan = "​ꦔ꧀";//<space>ngg-, e.g. ditinggal nggambar (it has a zws)
                else
                    konsonan = 'ꦔ꧀ꦒ'; // <nonvowel>ngg-, i.e. nggambar
                // for cluster longer than 4 consonants, such as "ditinggalnggambar",
                // need to separate it by a space, "ditinggal nggambar" to be correct
            }
            else if (this.str2.indexOf('rlx') == 0) {
                // r lx, e.g. pasarlxgi
                konsonan = 'ꦂꦊ';
                matra = '';
            }
            else if (this.str2.indexOf('rrx') == 0) {
                // r rx
                konsonan = 'ꦂꦉ';
                matra = '';
            }
            else if (this.str2.indexOf('hlx') == 0) {
                // h lx
                if (this.vowelPrev) {
                    konsonan = 'ꦃꦊ';
                    matra = '';
                }
                else
                    konsonan = 'ꦲ꧀ꦭꦼ';
                matra = '';
            }
            else if (this.str2.indexOf('hrx') == 0) {
                // h rx
                if (this.vowelPrev) {
                    konsonan = 'ꦃꦉ';
                    matra = '';
                }
                else
                    konsonan = 'ꦲꦽ';
                matra = '';
            }
            else if (this.str2.indexOf('qlx') == 0) {
                // just pasangan la + pepet
                konsonan = '꧀ꦭꦼ';
                matra = '';
            }
            else if (this.str2.indexOf('qrx') == 0) {
                // just cakra keret
                konsonan = 'ꦽ';
                matra = '';
            }
            else if (core_sound.CoreSound == 'ꦂꦂꦮ') {
                // -rw-
                if (this.vowelPrev)
                    konsonan = 'ꦂꦮ';
                // -rw- -- arwana
                else
                    konsonan = 'ꦫ꧀ꦮ'; // rw- -- rwa/rwi/rwab
            }
            else if (core_sound.CoreSound == 'ꦃꦃꦭ') {
                // -hl-
                if (this.vowelPrev)
                    konsonan = 'ꦃꦭ';
                // -hl-
                else
                    konsonan = 'ꦲ꧀ꦭ'; // hlam
            }
            else if (core_sound.CoreSound == 'ꦃꦃꦮ') {
                // -hw-
                if (this.vowelPrev)
                    konsonan = 'ꦃꦮ';
                // -hw-
                else
                    konsonan = 'ꦲ꧀ꦮ'; // hwab,hwan
            }
            else if (core_sound.CoreSound == 'ꦃꦲꦾ') {
                // -hy-
                if (this.vowelPrev)
                    konsonan = 'ꦃꦪ';
                // sembahyang
                else
                    konsonan = 'ꦲꦾ'; // hyang
                /* rules for some characters that change depends on the matra/vowel (e.g. lx and rx, and -rx) */
            }
            else if (findstr(core_sound.CoreSound, 'ꦾ') && matra == '꧀') {
                // pengkal
                konsonan = core_sound.CoreSound;
                matra = ''; // -y-
            }
            else if (findstr(core_sound.CoreSound, 'ꦿ') && matra == '꧀') {
                // cakra
                konsonan = core_sound.CoreSound;
                matra = ''; // -r-
            }
            else if (findstr(core_sound.CoreSound, 'ꦿ') && matra == 'ꦼ') {
                // cakra keret
                if ((str[0] == 'n' && str[1] == 'y') ||
                    ((str[0] == 't' || str[0] == 'd') && str[1] == 'h')) {
                    konsonan = this.GetCoreSound(str[0] + str[1]).CoreSound + 'ꦽ';
                    matra = ''; // nyrê-, thrê-, dhrê-
                }
                else if (str[0] == 'n' && str[1] == 'g') {
                    if (str[2] == 'g')
                        konsonan = 'ꦔ꧀ꦒꦽ';
                    else
                        konsonan = 'ꦔꦽ';
                    matra = ''; // nggrê-/ngrê-
                }
                else {
                    konsonan = this.GetCoreSound(str[0]).CoreSound + 'ꦽ';
                    matra = ''; // -rê-
                }
            }
            else if (findstr(core_sound.CoreSound, 'ꦭ') && matra == 'ꦼ') {
                // nga lelet
                if ((str[0] == 'n' && str[1] == 'y') ||
                    ((str[0] == 't' || str[0] == 'd') && str[1] == 'h')) {
                    konsonan = this.GetCoreSound(str[0] + str[1]).CoreSound + '꧀ꦭꦼ';
                    matra = ''; // nylê-, thlê-, dhlê-
                }
                else if (str[0] == 'n' && str[1] == 'g') {
                    if (str[2] == 'g')
                        konsonan = 'ꦔ꧀ꦒ꧀ꦭꦼ';
                    else
                        konsonan = 'ꦔ꧀ꦭꦼ';
                    matra = ''; // ngglê-/nglê-
                }
                else if (str[0] == 'l') {
                    konsonan = 'ꦊ';
                    matra = ''; // -lê-
                }
                else {
                    konsonan = this.GetCoreSound(str[0]).CoreSound + '꧀ꦭꦼ';
                    matra = ''; // -lê-
                }
            }
            else if (core_sound.CoreSound == 'ꦃ' && matra == '꧀') {
                // wignyan - 12 April
                konsonan = 'ꦲ'; // ha
            }
            else if (core_sound.CoreSound == 'ꦃ' && matra != '꧀') {
                // wignyan
                konsonan = 'ꦲ'; // ha
            }
            else if (core_sound.CoreSound == 'ꦂ' && matra == 'ꦼ') {
                // pa cerek
                konsonan = 'ꦉ';
                matra = ''; // rê
            }
            else if (core_sound.CoreSound == 'ꦂ' && matra == '꧀') {
                // layar
                konsonan = 'ꦫ'; // ra
            }
            else if (core_sound.CoreSound == 'ꦂ' && matra != '꧀') {
                // layar
                konsonan = 'ꦫ'; // ra
            }
            else if (core_sound.CoreSound == 'ꦁ​' && matra == '꧀') {
                // cecak
                konsonan = 'ꦁ​';
                matra = ''; // cecak
            }
            else if (core_sound.CoreSound == 'ꦁ​' && matra != '꧀') {
                // cecak
                konsonan = 'ꦔ'; // nga
            }
            else {
                konsonan = core_sound.CoreSound;
            }
            return '' + konsonan + matra;
        }
    }
    toLatin() {
        // var agt = navigator.userAgent.toLowerCase();
        // if (agt.indexOf("msie")!=-1) { //IE
        //    var range = document.selection.createRange()
        //    txt = range.text;
        //    if (txt == '') {
        //      var str = window.document.formText.editSrc.value;
        //    }else{
        //      var str = range.text;
        //    }
        // }
        // else {
        //   str = window.document.formText.editSrc.value;
        // }
        const ganti = (index, character, str) => str.substr(0, index) + character;
        const ganti2 = (index, character, str) => str.substr(0, index - 1) + character;
        const ganti3 = (index, character, str) => str.substr(0, index - 2) + character;
        //   const capitalize = (index: number, character: string, str: string) =>
        //     str.charAt(0).toUpperCase() + str.slice(1)
        let trans = this.str;
        const regexp_file = this.aksara2Latin();
        for (let i = 0, j = 0; i < this.str.length; i++) {
            if (!regexp_file[this.str[i]]) {
                // not Aksara Jawa
                trans = ganti(j, this.str[i], trans);
                j++;
            }
            else {
                if (this.str[i] == 'ꦴ' ||
                    this.str[i] == 'ꦶ' ||
                    this.str[i] == 'ꦸ' ||
                    this.str[i] == 'ꦺ' ||
                    this.str[i] == 'ꦼ') {
                    if (i > 2 && this.str[i - 1] == 'ꦲ' && this.str[i - 2] == 'ꦲ') {
                        // -hah-
                        if (this.str[i] == 'ꦴ')
                            trans = ganti3(j, 'ā', trans);
                        else if (this.str[i] == 'ꦶ')
                            trans = ganti3(j, 'ai', trans);
                        else if (this.str[i] == 'ꦸ')
                            trans = ganti3(j, 'au', trans);
                        else if (this.str[i] == 'ꦺ')
                            trans = ganti3(j, 'ae', trans);
                        else if (this.str[i] == 'ꦼ')
                            trans = ganti3(j, 'aě', trans);
                        // str[i] == "ꦶ" || str[i] == "ꦸ" || str[i] == "ꦺ" || str[i] == "ꦼ"
                    }
                    else if (i > 2 && this.str[i - 1] == 'ꦲ') {
                        // -h-
                        if (this.str[i] == 'ꦴ')
                            trans = ganti2(j, 'ā', trans);
                        else if (this.str[i] == 'ꦶ')
                            trans = ganti2(j, 'i', trans);
                        else if (this.str[i] == 'ꦸ')
                            trans = ganti2(j, 'u', trans);
                        else if (this.str[i] == 'ꦺ')
                            trans = ganti2(j, 'e', trans);
                        else if (this.str[i] == 'ꦼ')
                            trans = ganti2(j, 'ě', trans);
                    } /**/
                    else if (i > 0 &&
                        this.str[i] == 'ꦴ' &&
                        this.str[i - 1] == 'ꦺ') {
                        trans = ganti2(j, 'o', trans); // -o //2 aksara -> 1 huruf
                    }
                    else if (i > 0 && this.str[i] == 'ꦴ' && this.str[i - 1] == 'ꦻ') {
                        trans = ganti3(j, 'au', trans); // -au //2 aksara -> 2 huruf
                    }
                    else if (this.str[i] == 'ꦴ') {
                        trans = ganti(j, 'aa', trans); // -aa
                        j++;
                    }
                    else if (i > 0 &&
                        (this.str[i] == 'ꦶ' ||
                            this.str[i] == 'ꦸ' ||
                            this.str[i] == 'ꦺ' ||
                            this.str[i] == 'ꦼ') &&
                        (this.str[i - 1] == 'ꦄ' ||
                            this.str[i - 1] == 'ꦌ' ||
                            this.str[i - 1] == 'ꦆ' ||
                            this.str[i - 1] == 'ꦎ' ||
                            this.str[i - 1] == 'ꦈ')) {
                        trans = ganti(j, regexp_file[this.str[i]], trans);
                        j++;
                    }
                    else {
                        trans = ganti2(j, regexp_file[this.str[i]], trans);
                    }
                }
                else if (this.str[i] == 'ꦽ' ||
                    this.str[i] == 'ꦾ' ||
                    this.str[i] == 'ꦿ' ||
                    this.str[i] == 'ꦷ' ||
                    this.str[i] == 'ꦹ' ||
                    this.str[i] == 'ꦻ' ||
                    this.str[i] == 'ꦇ' ||
                    this.str[i] == 'ꦍ') {
                    // 1 aksara -> 2 huruf
                    trans = ganti2(j, regexp_file[this.str[i]], trans);
                    j++;
                }
                else if (this.str[i] == '꦳') {
                    // 2 aksara -> 2 huruf
                    if (i > 0 && this.str[i - 1] == 'ꦗ') {
                        if (i > 1 && this.str[i - 2] == '꧊') {
                            trans = ganti3(j, 'Za', trans);
                        }
                        else {
                            trans = ganti3(j, 'za', trans);
                        }
                    }
                    else if (i > 0 && this.str[i - 1] == 'ꦥ') {
                        if (i > 1 && this.str[i - 2] == '꧊') {
                            trans = ganti3(j, 'Fa', trans);
                        }
                        else {
                            trans = ganti3(j, 'fa', trans);
                        }
                    }
                    else if (i > 0 && this.str[i - 1] == 'ꦮ') {
                        if (i > 1 && this.str[i - 2] == '꧊') {
                            trans = ganti3(j, 'Va', trans);
                        }
                        else {
                            trans = ganti3(j, 'va', trans);
                        } // catatan, "va" biasanya ditulis sama dengan "fa" (dengan pa+cecak telu), variannya adalah wa+cecak telu.
                    }
                    else if (i > 0 && this.str[i - 1] == 'ꦲ') {
                        if (i > 1 && this.str[i - 2] == '꧊') {
                            trans = ganti3(j, 'Ḥa', trans);
                        }
                        else {
                            trans = ganti3(j, 'ḥa', trans);
                        }
                    }
                    else if (i > 0 && this.str[i - 1] == 'ꦏ') {
                        if (i > 1 && this.str[i - 2] == '꧊') {
                            trans = ganti3(j, 'Kha', trans);
                            j++;
                        }
                        else {
                            trans = ganti3(j, 'kha', trans);
                            j++;
                        }
                    }
                    else if (i > 0 && this.str[i - 1] == 'ꦢ') {
                        if (i > 1 && this.str[i - 2] == '꧊') {
                            trans = ganti3(j, 'Dza', trans);
                            j++;
                        }
                        else {
                            trans = ganti3(j, 'dza', trans);
                            j++;
                        }
                    }
                    else if (i > 0 && this.str[i - 1] == 'ꦱ') {
                        if (i > 1 && this.str[i - 2] == '꧊') {
                            trans = ganti3(j, 'Sya', trans);
                            j++;
                        }
                        else {
                            trans = ganti3(j, 'sya', trans);
                            j++;
                        }
                    }
                    else if (i > 0 && this.str[i - 1] == 'ꦒ') {
                        if (i > 1 && this.str[i - 2] == '꧊') {
                            trans = ganti3(j, 'Gha', trans);
                            j++;
                        }
                        else {
                            trans = ganti3(j, 'gha', trans);
                            j++;
                        }
                    }
                    else if (i > 0 && this.str[i - 1] == 'ꦔ') {
                        trans = ganti3(j, "'a", trans);
                    }
                    else {
                        trans = ganti2(j, regexp_file[this.str[i]], trans);
                    }
                }
                else if (this.str[i] == '꧀') {
                    trans = ganti2(j, regexp_file[this.str[i]], trans);
                }
                else if (this.str[i] == 'ꦏ' ||
                    this.str[i] == 'ꦐ' ||
                    this.str[i] == 'ꦒ' ||
                    this.str[i] == 'ꦕ' ||
                    this.str[i] == 'ꦗ' ||
                    this.str[i] == 'ꦟ' ||
                    this.str[i] == 'ꦠ' ||
                    this.str[i] == 'ꦡ' ||
                    this.str[i] == 'ꦢ' ||
                    this.str[i] == 'ꦣ' ||
                    this.str[i] == 'ꦤ' ||
                    this.str[i] == 'ꦥ' ||
                    this.str[i] == 'ꦧ' ||
                    this.str[i] == 'ꦩ' ||
                    this.str[i] == 'ꦪ' ||
                    this.str[i] == 'ꦫ' ||
                    this.str[i] == 'ꦬ' ||
                    this.str[i] == 'ꦭ' ||
                    this.str[i] == 'ꦮ' ||
                    this.str[i] == 'ꦯ' ||
                    this.str[i] == 'ꦰ' ||
                    this.str[i] == 'ꦱ' ||
                    this.str[i] == 'ꦉ' ||
                    this.str[i] == 'ꦊ' ||
                    this.str[i] == 'ꦁ' ||
                    this.str[i] == 'ꦲ' ||
                    this.str[i] == 'ꦑ' ||
                    this.str[i] == 'ꦓ' ||
                    this.str[i] == 'ꦖ' ||
                    this.str[i] == 'ꦙ' ||
                    this.str[i] == 'ꦡ' ||
                    this.str[i] == 'ꦣ' ||
                    this.str[i] == 'ꦦ' ||
                    this.str[i] == 'ꦨ') {
                    if (i > 0 && this.str[i - 1] == '꧊') {
                        if (this.str[i] == 'ꦐ') {
                            trans = ganti(j, 'Qa', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦧ' || this.str[i] == 'ꦨ') {
                            trans = ganti(j, 'Ba', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦕ' || this.str[i] == 'ꦖ') {
                            trans = ganti(j, 'Ca', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦢ' || this.str[i] == 'ꦣ') {
                            trans = ganti(j, 'Da', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦒ' || this.str[i] == 'ꦓ') {
                            trans = ganti(j, 'Ga', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦲ') {
                            if (i > 0 &&
                                (this.str[i - 1] == 'ꦼ' ||
                                    this.str[i - 1] == 'ꦺ' ||
                                    this.str[i - 1] == 'ꦶ' ||
                                    this.str[i - 1] == 'ꦴ' ||
                                    this.str[i - 1] == 'ꦸ' ||
                                    this.str[i - 1] == 'ꦄ' ||
                                    this.str[i - 1] == 'ꦌ' ||
                                    this.str[i - 1] == 'ꦆ' ||
                                    this.str[i - 1] == 'ꦎ' ||
                                    this.str[i - 1] == 'ꦈ' ||
                                    this.str[i - 1] == 'ꦿ' ||
                                    this.str[i - 1] == 'ꦾ' ||
                                    this.str[i - 1] == 'ꦽ')) {
                                trans = ganti(j, 'h' + regexp_file[this.str[i]], trans);
                                j += 2;
                            }
                            if (i > 0 && this.str[i - 1] == '꧊') {
                                trans = ganti(j, 'H' + regexp_file[this.str[i]], trans);
                                j += 2;
                            }
                            else {
                                trans = ganti(j, '@' + regexp_file[this.str[i]], trans);
                                j += 2;
                            }
                            // trans = ganti(j, "Ha", trans);j+=2;
                        }
                        else if (this.str[i] == 'ꦗ' || this.str[i] == 'ꦙ') {
                            trans = ganti(j, 'Ja', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦏ' || this.str[i] == 'ꦑ') {
                            trans = ganti(j, 'Ka', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦭ') {
                            trans = ganti(j, 'La', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦩ') {
                            trans = ganti(j, 'Ma', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦤ' || this.str[i] == 'ꦟ') {
                            trans = ganti(j, 'Na', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦥ' || this.str[i] == 'ꦦ') {
                            trans = ganti(j, 'Pa', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦫ' || this.str[i] == 'ꦬ') {
                            trans = ganti(j, 'Ra', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦱ' || this.str[i] == 'ꦯ') {
                            trans = ganti(j, 'Sa', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦠ' || this.str[i] == 'ꦡ') {
                            trans = ganti(j, 'Ta', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦮ') {
                            trans = ganti(j, 'Wa', trans);
                            j += 2;
                        }
                        else if (this.str[i] == 'ꦪ') {
                            trans = ganti(j, 'Ya', trans);
                            j += 2;
                        }
                        else {
                            ganti(j, regexp_file[this.str[i]], trans);
                            j += 3;
                        }
                    }
                    else if (i > 0 && this.str[i] == 'ꦲ' && this.str[i - 1] == 'ꦃ') {
                        // double hh
                        trans = ganti(j, 'a', trans);
                        j++;
                    }
                    else if (i > 0 && this.str[i] == 'ꦫ' && this.str[i - 1] == 'ꦂ') {
                        // double rr
                        trans = ganti(j, 'a', trans);
                        j++;
                    }
                    else if (i > 0 && this.str[i] == 'ꦔ' && this.str[i - 1] == 'ꦁ') {
                        // double ngng
                        trans = ganti(j, 'a', trans);
                        j++;
                    }
                    else if (i > 1 &&
                        this.str[i] == 'ꦕ' &&
                        this.str[i - 1] == '꧀' &&
                        this.str[i - 2] == 'ꦚ') {
                        // nyj & nyc
                        trans = ganti(j - 3, 'nca', trans);
                    }
                    else if (i > 1 &&
                        this.str[i] == 'ꦗ' &&
                        this.str[i - 1] == '꧀' &&
                        this.str[i - 2] == 'ꦚ') {
                        // nyj & nyc
                        trans = ganti(j - 3, 'nja', trans);
                    }
                    else if (this.str[i] == 'ꦲ' &&
                        (i == 0 ||
                            [
                                ' ',
                                '​',
                                '꧀',
                                '꦳',
                                'ꦴ',
                                'ꦶ',
                                'ꦷ',
                                'ꦸ',
                                'ꦹ',
                                'ꦺ',
                                'ꦻ',
                                'ꦼ',
                                'ꦽ',
                                'ꦾ',
                                'ꦿ'
                            ].indexOf(this.str[i - 1]) >= 0)) {
                        // ha, preceeded by space or zws or open vowel
                        trans = ganti(j, '_a', trans);
                        j += 2;
                    }
                    else if (this.str[i] == 'ꦑ' ||
                        this.str[i] == 'ꦓ' ||
                        this.str[i] == 'ꦖ' ||
                        this.str[i] == 'ꦙ' ||
                        this.str[i] == 'ꦡ' ||
                        this.str[i] == 'ꦣ' ||
                        this.str[i] == 'ꦦ' ||
                        this.str[i] == 'ꦨ') {
                        // bha, cha, dha, dll.
                        trans = ganti(j, regexp_file[this.str[i]], trans);
                        j += 3;
                    }
                    else {
                        // ba, ca, da, dll.
                        trans = ganti(j, regexp_file[this.str[i]], trans);
                        j += 2;
                    }
                }
                else if (this.str[i] == 'ꦔ' ||
                    this.str[i] == 'ꦘ' ||
                    this.str[i] == 'ꦚ' ||
                    this.str[i] == 'ꦛ' ||
                    this.str[i] == 'ꦜ' ||
                    this.str[i] == 'ꦝ' ||
                    this.str[i] == 'ꦞ' ||
                    this.str[i] == 'ꦋ') {
                    // nga, nya, tha, dha
                    if (i > 0 && this.str[i - 1] == '꧊') {
                        if (this.str[i] == 'ꦔ') {
                            trans = ganti(j, 'Nga', trans);
                            j += 3;
                        }
                        else if (this.str[i] == 'ꦚ' || this.str[i] == 'ꦘ') {
                            trans = ganti(j, 'Nya', trans);
                            j += 3;
                        }
                        else if (this.str[i] == 'ꦛ' || this.str[i] == 'ꦜ') {
                            trans = ganti(j, 'Tha', trans);
                            j += 3;
                        }
                        else if (this.str[i] == 'ꦝ' || this.str[i] == 'ꦞ') {
                            trans = ganti(j, 'Dha', trans);
                            j += 3;
                        }
                        else {
                            ganti(j, regexp_file[this.str[i]], trans);
                            j += 3;
                        }
                    }
                    else if (i > 0 && this.str[i] == 'ꦘ') {
                        trans = ganti(j, regexp_file[this.str[i]], trans);
                        j += 4;
                    }
                    else {
                        trans = ganti(j, regexp_file[this.str[i]], trans);
                        j += 3;
                    }
                }
                else if (this.str[i] == '꧊') {
                    // penanda nama diri -- made up for Latin back-compat
                    trans = ganti(j, '', trans);
                }
                else if ((this.str[i] == ' ', trans)) {
                    if (i > 0 && this.str[i - 1] == '꧀') {
                        // pangkon diikuti regular space = koma
                        trans = ganti(j, ', ', trans);
                        j += 2;
                    }
                    else {
                        trans = ganti(j, ' ', trans);
                        j++;
                    }
                }
                else if ((this.str[i] == '꧈', trans)) {
                    if (i > 0 && this.str[i - 1] == '꧀') {
                        // pangkon diikuti pada lingsa = titik
                        trans = ganti(j, '.', trans);
                        j++;
                    }
                    else {
                        // pada lingsa saja = koma
                        trans = ganti(j, ',', trans);
                        j++;
                    }
                }
                else {
                    trans = ganti(j, regexp_file[this.str[i]], trans);
                    j++;
                }
            }
        }
        trans = trans
            .split(' ')
            .map((v) => v.startsWith('_') ? v.replace('_', this.isHVokal ? '' : 'h') : v)
            .join(' ');
        return trans.toString();
    }
    aksara2Latin() {
        return {
            ꦏ: 'ka',
            ꦐ: 'qa',
            ꦑ: 'kʰa',
            ꦒ: 'ga',
            ꦓ: 'gʰa',
            ꦔ: 'nga',
            ꦕ: 'ca',
            ꦖ: 'cʰa',
            ꦗ: 'ja',
            ꦘ: 'jnya',
            ꦙ: 'jʰa',
            ꦚ: 'nya',
            ꦛ: 'tha',
            ꦜ: 'ṭʰa',
            ꦝ: 'dha',
            ꦞ: 'ḍʰa',
            ꦟ: 'ṇa',
            ꦠ: 'ta',
            ꦡ: 'ṭa',
            ꦢ: 'da',
            ꦣ: 'ḍa',
            ꦤ: 'na',
            ꦥ: 'pa',
            ꦦ: 'pʰa',
            ꦧ: 'ba',
            ꦨ: 'bʰa',
            ꦩ: 'ma',
            ꦪ: 'ya',
            ꦫ: 'ra',
            ꦬ: 'ṛa',
            ꦭ: 'la',
            ꦮ: 'wa',
            ꦯ: 'śa',
            ꦰ: 'ṣa',
            ꦱ: 'sa',
            ꦲ: 'ha',
            'ꦁ': 'ng',
            'ꦂ': 'r',
            'ꦃ': 'h',
            ꦄ: 'A',
            ꦅ: 'I',
            ꦆ: 'I',
            ꦇ: 'Ii',
            ꦈ: 'U',
            ꦉ: 'rê',
            ꦊ: 'lê',
            ꦋ: 'lêu',
            ꦌ: 'E',
            ꦍ: 'Ai',
            ꦎ: 'O',
            'ꦺꦴ': 'o',
            'ꦴ': 'a',
            'ꦶ': 'i',
            'ꦷ': 'ii',
            'ꦸ': 'u',
            'ꦹ': 'uu',
            'ꦺ': 'e',
            'ꦻ': 'ai',
            'ꦼ': 'ê',
            'ꦽ': 'rê',
            'ꦾ': 'ya',
            'ꦿ': 'ra',
            'ꦀ': '',
            '꦳': '​',
            '꧀': '​',
            '꧇': '​',
            '꧁': '—',
            '꧂': '—',
            '꧃': '–',
            '꧄': '–',
            '꧅': '–',
            '꧆': '',
            '꧈': ',',
            '꧉': '.',
            '꧊': 'qqq',
            '꧋': '–',
            '꧌': '–',
            '꧍': '–',
            ꧏ: '²',
            '꧐': '0',
            '꧑': '1',
            '꧒': '2',
            '꧓': '3',
            '꧔': '4',
            '꧕': '5',
            '꧖': '6',
            '꧗': '7',
            '꧘': '8',
            '꧙': '9',
            '꧞': '—',
            '꧟': '—',
            // "​": '#',//zero-width joiner
            '​': ' ',
            ' ': ' ' // regular space
        };
    }
}
