# Synchronous `crypto.subtle.digest`

Synchronously return a digest generated from the given hash function and data.

## Installation

```sh
npm install --save crypto-digest-sync
```

## Usage

```js
const digestSync = require('crypto-digest-sync')

const arrayBufferToHex = require('array-buffer-to-hex')
const encodeUtf8 = require('encode-utf8')

const input = encodeUtf8('Hello, World!')
const hash = digestSync('SHA-256', input)

console.log(arrayBufferToHex(hash))
//=> dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f
```

## API

### `digestSync(algo: string, buffer: ArrayBuffer): ArrayBuffer`

Synchronously return a digest generated from the hash function `algo` and the data in the `buffer`.

Currently the only supported algorithm is `'SHA-256'`.

## Direct require

If you only need a single algorithm, you can require that file directly and thus skipping the loading of the other ones. Append a slash followed by the name of the hash function (in lower case without dashes) to the require statement.

Example:

```js
const sha256 = require('crypto-digest-sync/sha256')

const arrayBufferToHex = require('array-buffer-to-hex')
const encodeUtf8 = require('encode-utf8')

const input = encodeUtf8('Hello, World!')
const hash = sha256(input)

console.log(arrayBufferToHex(hash))
//=> dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f
```
