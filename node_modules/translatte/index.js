const querystring = require('querystring');
const languages = require('./languages');
const proxy_check = require('proxy-check');
const tunnel = require('tunnel');
const token = require('./token');
const got = require('got');

const translatte = async (text, opts) => {
    opts = opts || {};
    opts = JSON.parse(JSON.stringify(opts));

    let result = {
        text: '',
        raw: '',
        from: {
            language: {
                didYouMean: false,
                iso: ''
            },
            text: {
                autoCorrected: false,
                value: '',
                didYouMean: false
            }
        },
        proxy: '',
        agent: '',
        service: {google_free: true}
    };

    let errors = [
        'The language «[lang]» is not supported',
        'Text must not exceed 5000 bytes',
        'The server returned an empty response',
        'Could not get token from google',
        'Text translation request failed'
    ];

    if (opts.from && !languages.isSupported(opts.from)) {
        return Promise.reject({message: errors[0].replace('[lang]', opts.from)});
    }

    if (opts.to && !languages.isSupported(opts.to)) {
        return Promise.reject({message: errors[0].replace('[lang]', opts.to)});
    }

    let bytes = languages.utf8Length(text);
    opts.client = opts.client || 't';
    opts.tld = opts.tld || 'com';
    opts.from = languages.getCode(opts.from || 'auto');
    opts.to = languages.getCode(opts.to || 'en');
    opts.services = opts.services || {google_free: true};
    let services = Object.keys(opts.services);

    opts.priority = opts.priority
        ? typeof opts.priority === 'string'
            ? [opts.priority]
            : opts.priority.filter(p => services.indexOf(p) + 1)
        : services;

    if (opts.priority.length > 1) {
        let all_index = opts.priority.length - 1;
        let err_services = {};
        return opts.priority.reduce((p, priority, index) => {
            return p.then(prev => {
                return new Promise((resolve, reject) => {
                    if (prev) return resolve(prev);
                    translatte(text, {...opts, priority}).then(t => {
                        if (!t || !t.text) {
                            err_services[priority] = errors[2];
                            return all_index === index
                                ? reject(err_services)
                                : resolve();
                        }
                        return resolve(t);
                    }).catch(e => {
                        err_services[priority] = typeof e === 'object' && (e[priority] || e.message)
                            ? e[priority] || e.message
                            : e;
                        return all_index === index
                            ? reject(err_services)
                            : resolve();
                    });
                });
            });
        }, Promise.resolve());
    }

    let priority = opts.priority[0];

    if (bytes > 5000) {
        let chars = Math.ceil(text.length / Math.ceil(bytes / 4700)) + 100;
        let plain = ' ' + text + ' ';
        let texts = [];
        let j = 0;
        ['.', ',', ' '].forEach(separator => {
            if (!plain) return;
            let split = plain.split(separator);
            for (let i = 0, l = split.length; i < l; i++) {
                if (!texts[j]) texts[j] = [];
                if ((texts[j].join(separator) + split[i]).length < chars) {
                    texts[j].push(split[i]);
                    plain = split.slice(i+1).join(separator);
                } else {
                    if (!texts[j].length) break;
                    texts[j].push('');
                    texts[++j] = [];
                    if ((texts[j].join(separator) + split[i]).length < chars) {
                        texts[j].push(split[i]);
                        plain = split.slice(i+1).join(separator);
                    } else {
                        break;
                    }
                }
            }
            texts = texts.map(function (t) {
                if (!t) return;
                if (typeof t === 'object') {
                    return t.join(separator).trim();
                } else if (typeof t === 'string') {
                    return t.trim();
                }
            }).filter(Boolean);
        });
        if (!texts || !texts.length) return Promise.reject({[priority]: errors[1]});
        return texts.reduce((p, item) => {
            return p.then(prev => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        translatte(item, opts).then(t => {
                            if (!t || !t.text) return reject(errors[2]);
                            t.text = prev && prev.text ? prev.text + ' ' + t.text : t.text;
                            return resolve(t);
                        }).catch(e => reject(e));
                    }, 1000);
                });
            });
        }, Promise.resolve());
    }

    if (priority === 'google_v3') {
        if (Array.isArray(opts.services['google_v3'])) {
            opts.services['google_v3'] = opts
                .services['google_v3'][Math.floor(Math.random() * opts
                .services['google_v3'].length)];
        }
        result.service = {google_v3: opts.services['google_v3']};
        let url = 'https://translation.googleapis.com/v3beta1/projects/' +
            opts.services['google_v3']['project-id'] + '/locations/global:translateText';
        try {
            const {body} = await got(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + opts.services['google_v3']['token'],
                    'Content-type': 'application/json'
                },
                body: {
                    source_language_code: opts.from,
                    target_language_code: opts.to,
                    contents: [text]
                },
                json: true,
                timeout: 10000,
                retry: 0
            });
            for (const translation of body.translations) {
                result.text += result.text
                    ? ' ' + translation.translations.translatedText
                    : translation.translations.translatedText;
            }
        } catch (e) {
            return Promise.reject({google_v3: e.message || e});
        }
        return Promise.resolve(result);
    }

    if (priority === 'microsoft_v3') {
        if (!opts.services['microsoft_v3']) return Promise.resolve(result);
        if (Array.isArray(opts.services['microsoft_v3'])) {
            opts.services['microsoft_v3'] = opts
                .services['microsoft_v3'][Math.floor(Math.random() * opts
                .services['microsoft_v3'].length)];
        }
        result.service = {microsoft_v3: opts.services['microsoft_v3']};
        let url = 'https://api.cognitive.microsofttranslator.com/translate?' +
            querystring.stringify({
                'api-version': '3.0',
                from: opts.from === 'auto' ? '' : opts.from,
                to: opts.to
            });
        try {
            const {body} = await got(url, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': opts.services['microsoft_v3']['key'],
                    'Ocp-Apim-Subscription-Region': opts.services['microsoft_v3']['location']
                        ? opts.services['microsoft_v3']['location'].replace(/[^a-z]/ig, '').toLowerCase()
                        : 'global',
                    'Content-type': 'application/json'
                },
                body: [{text}],
                json: true,
                timeout: 10000,
                retry: 0
            });
            for (const translation of body) {
                if (translation.detectedLanguage && translation.detectedLanguage.language) {
                    result.from.language.iso = translation.detectedLanguage.language;
                }
                result.text += result.text
                    ? ' ' + translation.translations[0].text
                    : translation.translations[0].text;
            }
        } catch (e) {
            return Promise.reject({microsoft_v3: e.message || e});
        }
        return Promise.resolve(result);
    }

    if (priority === 'yandex_v1') {
        if (!opts.services['yandex_v1']) return Promise.resolve(result);
        if (Array.isArray(opts.services['yandex_v1'])) {
            opts.services['yandex_v1'] = opts
                .services['yandex_v1'][Math.floor(Math.random() * opts
                .services['yandex_v1'].length)];
        }
        result.service = {yandex_v1: opts.services['yandex_v1']};
        let url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?' +
            querystring.stringify({
                key: opts.services['yandex_v1']['key'],
                lang: opts.from && opts.from !== 'auto'
                    ? opts.from + '-' + opts.to
                    : opts.to,
                text: text
            });
        try {
            const {body} = await got(url, {json: true, timeout: 10000, retry: 0});
            for (const translation of body.text) {
                result.text += result.text
                    ? ' ' + translation
                    : translation;
            }
        } catch (e) {
            return Promise.reject({yandex_v1: e.message || e});
        }
        return Promise.resolve(result);
    }

    if (priority === 'yandex_v2') {
        if (!opts.services['yandex_v2']) return Promise.resolve(result);
        if (Array.isArray(opts.services['yandex_v2'])) {
            opts.services['yandex_v2'] = opts
                .services['yandex_v2'][Math.floor(Math.random() * opts
                .services['yandex_v2'].length)];
        }
        result.service = {yandex_v2: opts.services['yandex_v2']};
        let url = 'https://translate.api.cloud.yandex.net/translate/v2/translate';
        try {
            const {body} = await got(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Api-Key ' + opts.services['yandex_v2']['key'],
                    'Content-type': 'application/json'
                },
                body: {
                    sourceLanguageCode: opts.from,
                    targetLanguageCode: opts.to,
                    texts: [text]
                },
                json: true,
                timeout: 10000,
                retry: 0
            });
            for (const translation of body.translations) {
                result.text += result.text
                    ? ' ' + translation.text
                    : translation.text;
            }
        } catch (e) {
            return Promise.reject({yandex_v2: e.message || e});
        }
        return Promise.resolve(result);
    }

    let proxy = {};
    let translate = {};

    opts.agents = opts.agents
        ? typeof opts.agents === 'string'
            ? opts.agents.split(',').map(p => p.trim())
            : opts.agents
        : [];
    opts.proxies = opts.proxies
        ? typeof opts.proxies === 'string'
            ? opts.proxies.split(',').map(p => p.trim())
            : opts.proxies
        : [];

    if (opts.agents.length) {
        let a = opts.agents[Math.floor(Math.random() * opts.agents.length)];
        result.agent = a;
        opts.headers = {
            'User-Agent': a
        };
    }
    if (opts.proxies.length) {
        let p = opts.proxies[Math.floor(Math.random() * opts.proxies.length)];
        result.proxy = p;
        if (p.indexOf('@') + 1) {
            proxy.proxyAuth = p.split('@')[0];
            proxy.host = (p.split('@')[1]).split(':')[0];
            proxy.port = (p.split('@')[1]).split(':')[1];
        } else {
            proxy.host = p.split(':')[0];
            proxy.port = p.split(':')[1];
        }
    }

    opts.proxy = proxy.host
        ? opts.headers
            ? {agent: tunnel.httpsOverHttp({proxy, headers: opts.headers})}
            : {agent: tunnel.httpsOverHttp({proxy})}
        : {};

    const translate_string = () => {
        return new Promise(async (resolve, reject) => {
            let t = await token.get(text, opts);

            if (!t) return reject({google_free: errors[3]});

            let url = 'https://translate.google.' + opts.tld + '/translate_a/single?' +
                querystring.stringify({
                    [t.name]: t.value,
                    client: opts.client,
                    sl: opts.from,
                    tl: opts.to,
                    hl: opts.to,
                    dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
                    ie: 'UTF-8',
                    oe: 'UTF-8',
                    otf: 1,
                    ssel: 0,
                    tsel: 0,
                    kc: 7,
                    q: text
                });

            try {
                translate = await got(url, {...opts.proxy, json: true, timeout: 10000, headers: opts.headers, retry: 0});
            } catch (e) {
                return reject({google_free: errors[4]});
            }

            result.raw = opts.raw
                ? JSON.stringify(translate.body)
                : '';

            let body = translate.body;

            body[0].forEach(obj => {
                if (obj[0]) {
                    result.text += obj[0];
                }
            });

            if (body[2] === body[8][0][0]) {
                result.from.language.iso = body[2];
            } else {
                result.from.language.didYouMean = true;
                result.from.language.iso = body[8][0][0];
            }

            if (body[7] && body[7][0]) {
                let str = body[7][0];

                str = str.replace(/<b><i>/g, '[');
                str = str.replace(/<\/i><\/b>/g, ']');

                result.from.text.value = str;

                if (body[7][5] === true) {
                    result.from.text.autoCorrected = true;
                } else {
                    result.from.text.didYouMean = true;
                }
            }

            return result.text
                ? resolve(result)
                : reject({google_free: errors[2]});
        });
    };

    if (opts && opts.proxy && opts.proxy.agent) {
        return proxy_check(result.proxy).then(() => {
            return translate_string();
        }).catch(() => {
            return Promise.reject({google_free: result.proxy});
        });
    } else {
        return translate_string();
    }
};

module.exports = translatte;
module.exports.languages = languages;