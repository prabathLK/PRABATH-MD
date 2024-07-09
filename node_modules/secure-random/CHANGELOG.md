1.1.2 / 2019-05-22
------------------
* make compatible for vue-cli

1.1.1 / 2014-06-30
------------------
* bugfix: `1.1.0` only checked for support of `window.msCrypto`, didn't actually add, this bugfix actually adds it

1.1.0 / 2014-06-30
------------------
* added support for `window.msCrypto` for Internet Explorer

1.0.0 / 2014-06-03
------------------
* added Travis-CI support
* added Testling support

* changed method default return type

old way:

```js
var data = secureRandom(10) //return Uint8Array by default
```

new way:

```js
var data = secureRandom(10) //returns Array by default
```

* added `Buffer` type
* added `randomArray()` method
* added `randomUint8Array()`
* added `randomBuffer()`

0.2.1 / 2014-03-20
------------------
* removed browserify hack, replaced with `package.json` setting. [weilu / #1](https://github.com/jprichardson/secure-random/pull/1)

0.2.0 / 2013-12-17
------------------
* explicitly force check for `window.crypto`

0.1.0 / 2013-12-08
------------------
* modified code so that Browserify doesn't include the Node.js `crypto` packabe client-side

0.0.1 / 2013-11-07
------------------
* initial release