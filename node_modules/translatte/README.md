# A free and unlimited translate for NodeJS.

<p align="center"><img src="https://raw.githubusercontent.com/extensionsapp/translatte/master/translatte_md.png" alt="TRANSLATTE, npm package translate for NodeJS" title="TRANSLATTE, npm package translate for NodeJS"></p>

### Installation
```
npm i translatte
```

### Usage

Translate string to German:

```javascript
const translatte = require('translatte');

translatte('Do you speak Russian?', {to: 'de'}).then(res => {
    console.log(res.text);
}).catch(err => {
    console.error(err);
});
// Ihr sprecht auf Russisch?
```

Translate string to English using proxy:

```javascript
const translatte = require('translatte');

translatte('Вы говорите по-русски?', {
    from: 'ru',
    to: 'en',
    agents: [
        'Mozilla/5.0 (Windows NT 10.0; ...',
        'Mozilla/4.0 (Windows NT 10.0; ...',
        'Mozilla/5.0 (Windows NT 10.0; ...'
    ],
    proxies: [
        'LOGIN:PASSWORD@192.0.2.100:12345',
        'LOGIN:PASSWORD@192.0.2.200:54321'
    ]
}).then(res => {
    console.log(res);
}).catch(err => {
    console.error(err);
});
// { text: 'Do you speak Russian?', 
//   from: { 
//     language: { 
//       didYouMean: false, 
//       iso: 'ru' 
//     }, 
//     text: { 
//       autoCorrected: false, 
//       value: '', 
//       didYouMean: false 
//     } 
//   },
//   raw: '' }
```

## API

### translatte(text, options)

#### text

Type: `string`

The text to be translated.

#### options

Type: `object`

##### from

Type: `string` Default: `auto`

The `text` language. Must be `auto` or one of the codes/names (not case sensitive) contained in [languages.js](https://github.com/extensionsapp/translatte/blob/master/languages.js).

##### to

Type: `string` Default: `en`

The language in which the text should be translated. Must be one of the codes/names (not case sensitive) contained in [languages.js](https://github.com/extensionsapp/translatte/blob/master/languages.js).

##### raw

Type: `boolean` Default: `false`

If `true`, the returned object will have a `raw` property with the raw response (`string`) from Google Translate.

##### agents

Type: `array` Default: `[]`

An `array` of strings specifying the user-agent `['Mozilla/5.0 ...', 'Mozilla/4.0 ...']`. One random result will be selected.

##### proxies

Type: `array` Default: `[]`

An `array` of strings `LOGIN:PASSWORD@IP:PORT` specifying the proxies `['LOGIN:PASSWORD@192.0.2.100:12345', 'LOGIN:PASSWORD@192.0.2.200:54321']`. One random result will be selected.

##### tld

Type: `string` Default: `com`

TLD for Google translate host to be used in API calls: `https://translate.google.[tld]`

##### client

Type: `string` Default: `t`

Query parameter client used in API calls. Can be `t|gtx`.

#### priority

Type: `array` Default: `['google_free']`

Array of priority services.

#### services

Type: `object` Default: `{"google_free": true}`

Objects in order of priority, if one of the services does not perform the translation, it proceeds to the next.

**Supported services:**
- `{"google_free": true}`
  - <a href="https://translate.google.com/" target="_blank">Google Translate</a>, this service works by default. It is completely free and has no limits.
- `{"google_v3": {"project-id": "XXX", "token": "YYY"}}`
  - <a href="https://cloud.google.com/translate/docs/quickstart-client-libraries-v3" target="_blank">Google Cloud</a>, requires registration and credit card details. 500,000 characters per month are issued free of charge, then $20 for every million characters.
- `{"microsoft_v3": {"key": "XXX", "location": "global"}}`
  - <a href="https://azure.microsoft.com/en-us/pricing/details/cognitive-services/translator-text-api/" target="_blank">Microsoft Azure</a>, requires registration and credit card details. Free of charge 2,000,000 characters per month, then $10 for every million characters.
- `{"yandex_v1": {"key": "XXX"}}`
  - <a href="https://translate.yandex.ru/developers/keys" target="_blank">Yandex Translate</a>, requires registration. Free of charge 10,000,000 characters per month.
- `{"yandex_v2": {"key": "XXX"}}`
  - <a href="https://cloud.yandex.ru/docs/translate/" target="_blank">Yandex Cloud</a>, requires registration and credit card details. $15 for every million characters.

### Returns an `object`:

- `text` *(string)* – The translated text.
- `from` *(object)*
  - `language` *(object)*
    - `didYouMean` *(boolean)* - `true` if the API suggest a correction in the source language
    - `iso` *(string)* - The [code of the language](https://github.com/extensionsapp/translatte/blob/master/languages.js) that the API has recognized in the `text`
  - `text` *(object)*
    - `autoCorrected` *(boolean)* – `true` if the API has auto corrected the `text`
    - `value` *(string)* – The auto corrected `text` or the `text` with suggested corrections
    - `didYouMean` *(boolean)* – `true` if the API has suggested corrections to the `text`
- `raw` *(string)* - If `options.raw` is true, the raw response from Google Translate servers. Otherwise, `''`.
- `proxy` *(string)* – The proxy that were used in the request.
- `agent` *(string)* – The agent that were used in the request.
- `service` *(object)* – The service that were used in the request.

Note that `res.from.text` will only be returned if `from.text.autoCorrected` or `from.text.didYouMean` equals to `true`. In this case, it will have the corrections delimited with brackets (`[ ]`):

``` js
translate('I spea Dutch').then(res => {
    console.log(res.from.text.value);
    //=> I [speak] Dutch
}).catch(err => {
    console.error(err);
});
```
Otherwise, it will be an empty `string` (`''`).

### Errors an `object`:

Errors in the name of each `services`.

```json
{
  "google_free": "Could not get token from google",
  "google_v3": "Response code 403 (Forbidden)",
  "microsoft_v3": "Response code 403 (Forbidden)",
  "yandex_v1": "Response code 403 (Forbidden)",
  "yandex_v2": "Response code 403 (Forbidden)"
}
```

If the proxy server `LOGIN:PASSWORD@192.0.2.100:12345` is inactive.

```json
{
  "google_free": "LOGIN:PASSWORD@192.0.2.100:12345"
}
```

If the error is not related to `services`.

```json
{
  "message": "The language «foo» is not supported"
}
```

**2020 ExtensionsApp**