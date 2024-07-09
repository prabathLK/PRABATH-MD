# google-tts

Google TTS (Text-To-Speech) for node.js

[![][npm-img]][npm-url]

[![][dependency-img]][dependency-url]
[![][dependency-dev-img]][dependency-dev-url]
[![][install-size-img]][install-size-result]

[![][travis-img]][travis-url]
[![][coverage-img]][coverage-url]

## Installation

```bash
$ npm install --save google-tts-api
$ npm install -D typescript @types/node # Only for TypeScript
```

## Change Log

Please see [CHANGELOG](https://github.com/zlargon/google-tts/blob/master/CHANGELOG.md).

## Usage

| Method              | Options (all optional)                          | Return Type                                         | Handle Long Text |
| ------------------- | ----------------------------------------------- | --------------------------------------------------- | :--------------: |
| `getAudioUrl`       | `lang`, `slow`, `host`                          | `string`                                            |                  |
| `getAudioBase64`    | `lang`, `slow`, `host`, `timeout`               | `Promise<string>`                                   |                  |
| `getAllAudioUrls`   | `lang`, `slow`, `host`, `splitPunct`            | `{ shortText: string; url: string; }[]`             |        ✅        |
| `getAllAudioBase64` | `lang`, `slow`, `host`, `timeout`, `splitPunct` | `Promise<{ shortText: string; base64: string; }[]>` |        ✅        |

### Options (all optional)

| Option       | Type      | Default                      | Description                                                                                                                    |
| ------------ | --------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `lang`       | `string`  | en                           | See all avaiable language code at https://cloud.google.com/speech/docs/languages                                               |
| `slow`       | `boolean` | false                        | Use the slow audio speed if set `slow` to `true`                                                                               |
| `host`       | `string`  | https://translate.google.com | You can change the `host` if the default host could not work in your region (e.g. https://translate.google.com.cn).            |
| `timeout`    | `number`  | 10000 (ms)                   | (Only for `getAudioBase64` and `getAllAudioBase64`) Set timeout for the HTTP request.                                          |
| `splitPunct` | `string`  |                              | (Only for `getAllAudioUrls` and `getAllAudioBase64`) Set the punctuation to split the long text to short text. (e.g. "，、。") |

## Examples

### 1. `getAudioUrl(text, [option])`

```js
import * as googleTTS from 'google-tts-api'; // ES6 or TypeScript
const googleTTS = require('google-tts-api'); // CommonJS

// get audio URL
const url = googleTTS.getAudioUrl('Hello World', {
  lang: 'en',
  slow: false,
  host: 'https://translate.google.com',
});
console.log(url); // https://translate.google.com/translate_tts?...
```

### 2. `getAudioBase64(text, [option])`

```js
import * as googleTTS from 'google-tts-api'; // ES6 or TypeScript
const googleTTS = require('google-tts-api'); // CommonJS

// get base64 text
googleTTS
  .getAudioBase64('Hello World', {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
    timeout: 10000,
  })
  .then(console.log) // base64 text
  .catch(console.error);
```

### 3. `getAllAudioUrls(text, [option])` (For text longer than 200 characters)

```js
import * as googleTTS from 'google-tts-api'; // ES6 or TypeScript
const googleTTS = require('google-tts-api'); // CommonJS

const results = googleTTS.getAllAudioUrls('LONG_TEXT_...', {
  lang: 'en',
  slow: false,
  host: 'https://translate.google.com',
  splitPunct: ',.?',
});
console.log(results);
// [
//   { shortText: '...', url: '...' },
//   { shortText: '...', url: '...' },
//   ...
// ];
```

### 4. `getAllAudioBase64(text, [option])` (For text longer than 200 characters)

```js
import * as googleTTS from 'google-tts-api'; // ES6 or TypeScript
const googleTTS = require('google-tts-api'); // CommonJS

googleTTS
  .getAllAudioBase64('LONG_TEXT_...', {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
    timeout: 10000,
    splitPunct: ',.?',
  })
  .then(console.log)
  // [
  //   { shortText: '...', base64: '...' },
  //   { shortText: '...', base64: '...' },
  //   ...
  // ];
  .catch(console.error);
```

[More Examples](https://github.com/zlargon/google-tts/tree/master/example)

## License

MIT

[npm-url]: https://nodei.co/npm/google-tts-api
[npm-img]: https://nodei.co/npm/google-tts-api.png
[install-size-img]: https://packagephobia.com/badge?p=google-tts-api
[install-size-result]: https://packagephobia.com/result?p=google-tts-api
[dependency-url]: https://david-dm.org/zlargon/google-tts
[dependency-img]: https://img.shields.io/david/zlargon/google-tts.svg
[dependency-dev-url]: https://david-dm.org/zlargon/google-tts#info=devDependencies
[dependency-dev-img]: https://img.shields.io/david/dev/zlargon/google-tts.svg
[travis-url]: https://travis-ci.com/zlargon/google-tts
[travis-img]: https://img.shields.io/travis/com/zlargon/google-tts
[coverage-url]: https://coveralls.io/github/zlargon/google-tts
[coverage-img]: https://img.shields.io/coveralls/github/zlargon/google-tts
