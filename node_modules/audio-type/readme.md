# audio-type [![test](https://github.com/audiojs/audio-type/actions/workflows/test.js.yml/badge.svg)](https://github.com/audiojs/audio-type/actions/workflows/test.js.yml) [![stable](https://img.shields.io/badge/stability-stable-brightgreen.svg)](http://github.com/badges/stability-badges) [![npm](https://img.shields.io/npm/v/audio-type.svg)](https://www.npmjs.com/package/audio-type) [![license](https://img.shields.io/npm/l/audio.svg)](https://www.npmjs.com/package/audio-type)

> Detect the audio type of a ArrayBuffer/Uint8Array

## Install

```sh
$ npm i audio-type
```

## Usage

##### Node.js

```js
import readChunk from 'read-chunk'; // npm install read-chunk
import audioType from 'audio-type';
var buffer = readChunk.sync('meow.wav', 0, 12);

audioType(buffer);
//=> wav
```

##### Browser

```js
import audioType from './audio-type.js'

var xhr = new XMLHttpRequest();
xhr.open('GET', 'meow.flac');
xhr.responseType = 'arraybuffer';

xhr.onload = function () {
	audioType(this.response);
	//=> flac
};

xhr.send();
```


## API

### audioType(buffer)

Returns: `'mp3'`, `'oga'`, `'flac'`, `'wav'`, `'m4a'`, `'opus'`, `'qoa'`

#### buffer

Type: `buffer` *(Node.js)*, `arrayBuffer`, `uint8array`

It only needs the first 12 bytes.

## License

MIT • <a href="https://github.com/krishnized/license/">ॐ</a>

