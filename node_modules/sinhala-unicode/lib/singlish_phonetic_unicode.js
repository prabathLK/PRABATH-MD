var nvowels = 0,consonants = [],consonantsuni = [],vowels = [],vowelsuni = [],vowelmodifiersuni = [],specialconsonants = [],specialconsonantsuni = [],specialcharuni = [],specialchar = []
vowelsuni[0] = 'ඌ'; vowels[0] = 'oo'; vowelmodifiersuni[0] = 'ූ';
vowelsuni[1] = 'ඕ'; vowels[1] = 'o\\)'; vowelmodifiersuni[1] = 'ෝ';
vowelsuni[2] = 'ඕ'; vowels[2] = 'oe'; vowelmodifiersuni[2] = 'ෝ';
vowelsuni[3] = 'ආ'; vowels[3] = 'aa'; vowelmodifiersuni[3] = 'ා';
vowelsuni[4] = 'ආ'; vowels[4] = 'a\\)'; vowelmodifiersuni[4] = 'ා';
vowelsuni[5] = 'ඈ'; vowels[5] = 'aa'; vowelmodifiersuni[5] = 'ෑ';
vowelsuni[6] = 'ඈ'; vowels[6] = 'a\\)'; vowelmodifiersuni[6] = 'ෑ';
vowelsuni[7] = 'ඈ'; vowels[7] = 'ae'; vowelmodifiersuni[7] = 'ෑ';
vowelsuni[8] = 'ඊ'; vowels[8] = 'ii'; vowelmodifiersuni[8] = 'ී';
vowelsuni[9] = 'ඊ'; vowels[9] = 'i\\)'; vowelmodifiersuni[9] = 'ී';
vowelsuni[10] = 'ඊ'; vowels[10] = 'ie'; vowelmodifiersuni[10] = 'ී';
vowelsuni[11] = 'ඊ'; vowels[11] = 'ee'; vowelmodifiersuni[11] = 'ී';
vowelsuni[12] = 'ඒ'; vowels[12] = 'ea'; vowelmodifiersuni[12] = 'ේ';
vowelsuni[13] = 'ඒ'; vowels[13] = 'e\\)'; vowelmodifiersuni[13] = 'ේ';
vowelsuni[14] = 'ඒ'; vowels[14] = 'ei'; vowelmodifiersuni[14] = 'ේ';
vowelsuni[15] = 'ඌ'; vowels[15] = 'uu'; vowelmodifiersuni[15] = 'ූ';
vowelsuni[16] = 'ඌ'; vowels[16] = 'u\\)'; vowelmodifiersuni[16] = 'ූ';
vowelsuni[17] = 'ඖ'; vowels[17] = 'au'; vowelmodifiersuni[17] = 'ෞ';
vowelsuni[18] = 'ඇ'; vowels[18] = '/\a'; vowelmodifiersuni[18] = 'ැ';
vowelsuni[19] = 'අ'; vowels[19] = 'a'; vowelmodifiersuni[19] = '';
vowelsuni[20] = 'ඇ'; vowels[20] = 'a'; vowelmodifiersuni[20] = 'ැ';
vowelsuni[21] = 'ඉ'; vowels[21] = 'i'; vowelmodifiersuni[21] = 'ි';
vowelsuni[22] = 'එ'; vowels[22] = 'e'; vowelmodifiersuni[22] = 'ෙ';
vowelsuni[23] = 'උ'; vowels[23] = 'u'; vowelmodifiersuni[23] = 'ු';
vowelsuni[24] = 'ඔ'; vowels[24] = 'o'; vowelmodifiersuni[24] = 'ො';
vowelsuni[25] = 'ඓ'; vowels[25] = 'i'; vowelmodifiersuni[25] = 'ෛ';
nvowels = 26;
specialconsonantsuni[0] = 'ං'; specialconsonants[0] = /\\n/g;
specialconsonantsuni[1] = 'ඃ'; specialconsonants[1] = /\\h/g;
specialconsonantsuni[2] = 'ඞ'; specialconsonants[2] = /\\n/g;
specialconsonantsuni[3] = 'ඍ'; specialconsonants[3] = /\\r/g;
specialconsonantsuni[4] = 'ර්' + '\u200d'; specialconsonants[4] = /r/g;
specialconsonantsuni[5] = 'ර්' + '\u200d'; specialconsonants[5] = /\\r/g;
consonantsuni[0] = 'ඬ'; consonants[0] = 'nnd';
consonantsuni[1] = 'ඳ'; consonants[1] = 'nndh';
consonantsuni[2] = 'ඟ'; consonants[2] = 'nng';
consonantsuni[3] = 'ථ'; consonants[3] = 'th';
consonantsuni[4] = 'ධ'; consonants[4] = 'dh';
consonantsuni[5] = 'ඝ'; consonants[5] = 'gh';
consonantsuni[6] = 'ඡ'; consonants[6] = 'ch';
consonantsuni[7] = 'ඵ'; consonants[7] = 'ph';
consonantsuni[8] = 'භ'; consonants[8] = 'bh';
consonantsuni[9] = 'ඣ'; consonants[9] = 'jh';
consonantsuni[10] = 'ෂ'; consonants[10] = 'sh';
consonantsuni[11] = 'ඥ'; consonants[11] = 'gn';
consonantsuni[12] = 'ඤ'; consonants[12] = 'kn';
consonantsuni[13] = 'ළු'; consonants[13] = 'lu';
consonantsuni[14] = 'ඛ'; consonants[14] = 'kh';
consonantsuni[15] = 'ඨ'; consonants[15] = 'th';
consonantsuni[16] = 'ඪ'; consonants[16] = 'dh';
consonantsuni[17] = 'ශ'; consonants[17] = 's';
consonantsuni[18] = 'ද'; consonants[18] = 'd';
consonantsuni[19] = 'ච'; consonants[19] = 'c';
consonantsuni[20] = 'ත'; consonants[20] = 't';
consonantsuni[21] = 'ට'; consonants[21] = 't';
consonantsuni[22] = 'ක'; consonants[22] = 'k';
consonantsuni[23] = 'ඩ'; consonants[23] = 'd';
consonantsuni[24] = 'න'; consonants[24] = 'n';
consonantsuni[25] = 'ප'; consonants[25] = 'p';
consonantsuni[26] = 'බ'; consonants[26] = 'b';
consonantsuni[27] = 'ම'; consonants[27] = 'm';
consonantsuni[28] = '‍ය'; consonants[28] = '\\u005c' + 'y';
consonantsuni[29] = '‍ය'; consonants[29] = 'y';
consonantsuni[30] = 'ය'; consonants[30] = 'y';
consonantsuni[31] = 'ජ'; consonants[31] = 'j';
consonantsuni[32] = 'ල'; consonants[32] = 'l';
consonantsuni[33] = 'ව'; consonants[33] = 'v';
consonantsuni[34] = 'ව'; consonants[34] = 'w';
consonantsuni[35] = 'ස'; consonants[35] = 's';
consonantsuni[36] = 'හ'; consonants[36] = 'h';
consonantsuni[37] = 'ණ'; consonants[37] = 'n';
consonantsuni[38] = 'ළ'; consonants[38] = 'l';
consonantsuni[39] = 'ඛ'; consonants[39] = 'k';
consonantsuni[40] = 'ඝ'; consonants[40] = 'g';
consonantsuni[41] = 'ඵ'; consonants[41] = 'p';
consonantsuni[42] = 'ඹ'; consonants[42] = 'b';
consonantsuni[43] = 'ෆ'; consonants[43] = 'f';
consonantsuni[44] = 'ග'; consonants[44] = 'g';
consonantsuni[45] = 'ර'; consonants[45] = 'r';
specialcharuni[0] = 'ෲ'; specialchar[0] = 'ruu';
specialcharuni[1] = 'ෘ'; specialchar[1] = 'ru';
module.exports = (text) => {
    var s, r, v;
    for (var i = 0; i < specialconsonants.length; i++)
        text = text.replace(specialconsonants[i], specialconsonantsuni[i]);
    for (var i = 0; i < specialcharuni.length; i++) {
        for (var j = 0; j < consonants.length; j++) {
            s = consonants[j] + specialchar[i];
            v = consonantsuni[j] + specialcharuni[i];
            r = new RegExp(s, "g");
            text = text.replace(r, v);
        }
    }
    for (var j = 0; j < consonants.length; j++) {
        for (var i = 0; i < vowels.length; i++) {
            s = consonants[j] + "r" + vowels[i];
            v = consonantsuni[j] + "්‍ර" + vowelmodifiersuni[i];
            r = new RegExp(s, "g");
            text = text.replace(r, v);
        }
        s = consonants[j] + "r";
        v = consonantsuni[j] + "්‍ර";
        r = new RegExp(s, "g");
        text = text.replace(r, v);
    }
    for (var i = 0; i < consonants.length; i++) {
        for (var j = 0; j < nvowels; j++) {
            s = consonants[i] + vowels[j];
            v = consonantsuni[i] + vowelmodifiersuni[j];
            r = new RegExp(s, "g");
            text = text.replace(r, v);
        }
    }
    for (var i = 0; i < consonants.length; i++) {
        r = new RegExp(consonants[i], "g");
        text = text.replace(r, consonantsuni[i] + "්");
    }
    for (var i = 0; i < vowels.length; i++) {
        r = new RegExp(vowels[i], "g");
        text = text.replace(r, vowelsuni[i]);
    }
    return text
}