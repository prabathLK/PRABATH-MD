# is-standard-emoji

[![Build Status](http://img.shields.io/travis/Kikobeats/is-standard-emoji/master.svg?style=flat-square)](https://travis-ci.org/Kikobeats/is-standard-emoji)
[![Dependency status](http://img.shields.io/david/Kikobeats/is-standard-emoji.svg?style=flat-square)](https://david-dm.org/Kikobeats/is-standard-emoji)
[![Dev Dependencies Status](http://img.shields.io/david/dev/Kikobeats/is-standard-emoji.svg?style=flat-square)](https://david-dm.org/Kikobeats/is-standard-emoji#info=devDependencies)
[![NPM Status](http://img.shields.io/npm/dm/is-standard-emoji.svg?style=flat-square)](https://www.npmjs.org/package/is-standard-emoji)
[![Gittip](http://img.shields.io/gittip/Kikobeats.svg?style=flat-square)](https://www.gittip.com/Kikobeats/)

> Check if a word is a emoji shortcut.

## Install

```bash
npm install is-standard-emoji --save
```

If you want to use in the browser (powered by [Browserify](http://browserify.org/)):

```bash
bower install is-standard-emoji --save
```

and later link in your HTML:

```html
<script src="bower_components/is-standard-emoji/dist/is-standard-emoji.js"></script>
```

## Usage

```js
var isEmoji = require('is-standard-emoji');

isEmoji('🙌');   // => true
```

## Related

* [emojis-unicode](https://github.com/Kikobeats/emojis-unicode) – Complete list of standard Unicode codes that represent emojis.
* [emojis-keywords](https://github.com/Kikobeats/emojis-keywords) – Complete list of am emoji shortcuts.
* [emojis-list](https://github.com/Kikobeats/emojis-list) – Complete list of standard emojis.
* [is-emoji-keyword](https://github.com/Kikobeats/is-emoji-keyword) – Check if a word is a emoji shortcut.
* [trim-emoji](https://github.com/Kikobeats/trim-emoji) – Deletes ':' from the begin and the end of an emoji shortcut.

## License

MIT © [Kiko Beats](http://www.kikobeats.com)
