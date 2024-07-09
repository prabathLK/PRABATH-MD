## 2.0.2 (Mar 20, 2021)

- Change default language to `en` ([#45](https://github.com/zlargon/google-tts/issues/45))
- Typescript: Remove type `Language` since API doesn't fully support language codes listed in the document

## 2.0.1 (Jan 6, 2021)

- Fix the vulnerabilities by upgrading the dependencies (#42, #44)

## 2.0.0 (Dec 8, 2020)

- Add new APIs (Please see the **Break Change** below)

  | Method              | Options (optional)                              | Return Type                                         | Handle Long Text |
  | ------------------- | ----------------------------------------------- | --------------------------------------------------- | :--------------: |
  | `getAudioUrl`       | `lang`, `slow`, `host`                          | `string`                                            |                  |
  | `getAudioBase64`    | `lang`, `slow`, `host`, `timeout`               | `Promise<string>`                                   |                  |
  | `getAllAudioUrls`   | `lang`, `slow`, `host`, `splitPunct`            | `{ shortText: string; url: string; }[]`             |        ✅        |
  | `getAllAudioBase64` | `lang`, `slow`, `host`, `timeout`, `splitPunct` | `Promise<{ shortText: string; base64: string; }[]>` |        ✅        |

- Support new Google TTS API to get audio Base64 text ([#35](https://github.com/zlargon/google-tts/issues/35))
- Support long text input: `getAllAudioUrls` and `getAllAudioBase64` ([#30](https://github.com/zlargon/google-tts/issues/30))
- Support changing the `host` in option ([#16](https://github.com/zlargon/google-tts/issues/16))
- Support Typescript
- Add dependency [axios](https://github.com/axios/axios)

### **Break Change from 0.x.x to 2.x.x**

`googleTTS()` is changed to `googleTTS.getAudioUrl()`.

```js
const googleTTS = require('google-tts-api');

// Before version 0.0.6
// Original googleTTS is a promise function
const url = await googleTTS('Hello World', 'en', 1);

// After version 2.0.0
// Now googleTTS is an object with 4 new methods (getAudioUrl, getAudioBase64, getAllAudioUrls, getAllAudioBase64)
// googleTTS.getAudioUrl is a non-promise function
const url = googleTTS.getAudioUrl('Hello World', {
  lang: 'en-US',
  slow: false, // speed (number) is changed to slow (boolean)
  host: 'https://translate.google.com', // allow to change the host
});
```

## 0.0.6 (Dec 5, 2020)

- `timeout` parameter is deprecated.
- Remove dependency `isomorphic-fetch`.
- Fix the change of Google Translate API ([@freddiefujiwara](https://github.com/freddiefujiwara) in [#37](https://github.com/zlargon/google-tts/pull/37)). Read more in [#35](https://github.com/zlargon/google-tts/issues/35)

## 0.0.5 (Nov 8, 2020)

- Upgrade the dependencies and fix the vulnerability. ([#32](https://github.com/zlargon/google-tts/issues/32))
- Add retry mechanism to prevent fetching token key failed too frequently. ([#33](https://github.com/zlargon/google-tts/issues/33))

## 0.0.4 (Nov 29, 2018)

- Fix the change of Google Translate API ([@ncpierson](https://github.com/ncpierson) in [#19](https://github.com/zlargon/google-tts/pull/19))

## 0.0.3 (Sep 21, 2018)

- Add package-lock.lock file
- Fix the change of Google Translate API ([@ncpierson](https://github.com/ncpierson) in [#14](https://github.com/zlargon/google-tts/pull/14))

## 0.0.2 (Aug 25, 2017)

- Add yarn.lock file
- If length of input text is over than 200 characters, throw a `RangeError` with error messsage. ([#5](https://github.com/zlargon/google-tts/issues/5))
