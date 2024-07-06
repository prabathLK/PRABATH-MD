import got from 'got';
export function getEncodedSnapApp(data) {
    return data.split('decodeURIComponent(escape(r))}(')[1]
        .split('))')[0]
        .split(',')
        .map(v => v.replace(/"/g, '').trim());
}
export function getDecodedSnapSave(data) {
    return data.split('getElementById("download-section").innerHTML = "')[1]
        .split('"; document.getElementById("inputData").remove(); ')[0]
        .replace(/\\(\\)?/g, '');
}
export function decryptSnapSave(data) {
    return getDecodedSnapSave(decodeSnapApp(...getEncodedSnapApp(data)));
}
export function stringifyCookies(cookies) {
    return cookies.map(cookie => {
        const [name, _value] = cookie.split('=');
        const [value] = _value.split(';');
        return `${name}=${value}`;
    }).join('; ');
}
export function parseCookies(cookieString) {
    const cookies = {};
    cookieString.split(';').forEach(cookie => {
        const [key, value] = cookie.split('=');
        cookies[key.trim()] = value.trim();
    });
    return cookies;
}
export async function getRenderedSnapSaveUrl(url) {
    while (true) {
        const json = await got(url).json();
        if (json.status !== 1)
            throw new Error(json.data.identifier);
        if (json.data.progress === 100) {
            return {
                file_size: json.data.file_size,
                file_path: json.data.file_path
            };
        }
    }
}
export function decodeSnapApp(...args) {
    let [h, u, n, t, e, r] = args;
    // @ts-ignore
    function decode(d, e, f) {
        const g = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
        let h = g.slice(0, e);
        let i = g.slice(0, f);
        // @ts-ignore
        let j = d.split('').reverse().reduce(function (a, b, c) {
            if (h.indexOf(b) !== -1)
                return a += h.indexOf(b) * (Math.pow(e, c));
        }, 0);
        let k = '';
        while (j > 0) {
            k = i[j % f] + k;
            j = (j - (j % f)) / f;
        }
        return k || '0';
    }
    r = '';
    for (let i = 0, len = h.length; i < len; i++) {
        let s = "";
        // @ts-ignore
        while (h[i] !== n[e]) {
            s += h[i];
            i++;
        }
        for (let j = 0; j < n.length; j++)
            s = s.replace(new RegExp(n[j], "g"), j.toString());
        // @ts-ignore
        r += String.fromCharCode(decode(s, e, 10) - t);
    }
    return decodeURIComponent(encodeURIComponent(r));
}
export function generateTokenYoutube4kdownloader(url) {
    function decode_max(url) {
        let link = url;
        let _url = url;
        for (let i = 0; 10 > i && (_url = decodeURIComponent(link),
            _url !== link);) {
            link = _url;
            i++;
        }
        return _url;
    }
    function convert(decoded, type, len) {
        decoded += '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        let enc_str = '';
        for (let c = 1; c <= len;) {
            enc_str = '';
            for (let i = 0; i < decoded.length; i++) {
                let char = decoded[i];
                let pos = chars.indexOf(char);
                if (pos === -1)
                    enc_str += char;
                else {
                    let enc_pos = 'enc' === type ? 'undefined' == typeof chars[pos + 5] ? 5 - (chars.length - pos) : pos + 5 : 'undefined' == typeof chars[pos - 5] ? chars['length'] + pos - 5 : pos - 5;
                    let enc_char = chars[enc_pos];
                    enc_str += enc_char;
                }
            }
            enc_str = enc_str.split('').reverse().join('');
            decoded = enc_str;
            c++;
        }
        return enc_str;
    }
    let decodedMax = decode_max(url);
    let token = convert(decodedMax, 'dec', 3);
    token = token.replace(/[^0-9a-z]/gi, '');
    token = token.substring(0, 15);
    return token;
}
/**
 * @returns is a kilobit
 */
export function parseFileSize(size) {
    const sized = parseFloat(size);
    return (isNaN(sized) ? 0 : sized) * (/GB/i.test(size)
        ? 1000000
        : /MB/i.test(size)
            ? 1000
            : /KB/i.test(size)
                ? 1
                : /bytes?/i.test(size)
                    ? 0.001
                    : /B/i.test(size)
                        ? 0.1
                        : 0);
}
