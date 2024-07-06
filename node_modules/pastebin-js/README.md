pastebin-js
===========



> Update 2020-11-05 --- I consider this package to be **deprecated**. Please install [pastebin-ts](https://www.npmjs.com/package/pastebin-ts) for an up to date wrapper for Pastebin! Active development on the current package is halted



[![NPM](https://nodei.co/npm/pastebin-js.svg?downloads=true&stars=true)](https://nodei.co/npm/pastebin-js/)

[![Build Status](https://travis-ci.org/j3lte/pastebin-js.svg?branch=master)](https://travis-ci.org/j3lte/pastebin-js)
[![DAVID](https://david-dm.org/j3lte/pastebin-js.svg)](https://david-dm.org/j3lte/pastebin-js)
[![npm version](https://badge.fury.io/js/pastebin-js.svg)](http://badge.fury.io/js/pastebin-js)
[![Development Dependency Status](https://david-dm.org/j3lte/pastebin-js/dev-status.svg?theme=shields.io)](https://david-dm.org/j3lte/pastebin-js#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/j3lte/pastebin-js/badges/gpa.svg)](https://codeclimate.com/github/j3lte/pastebin-js)

NodeJS module to access the Pastebin API

```js
var PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI('devkey');
```


## Features

* getPaste : get a raw paste
* createAPIuserKey : get a userkey for the authenticated user
* listUserPastes : get a list of the pastes from the authenticated user
* getUserInfo : get a list of info from the authenticated user
* listTrendingPastes : get a list of the trending pastes on Pastebin
* createPaste : create a paste
* createPasteFromFile : read a file (UTF8) and paste it
* deletePaste : delete a paste created by the user

## Example

```js
var PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI({
      'api_dev_key' : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      'api_user_name' : 'PastebinUserName',
      'api_user_password' : 'PastebinPassword'
    });

pastebin
    .createPasteFromFile("./uploadthistopastebin.txt", "pastebin-js test", null, 1, "N")
    .then(function (data) {
        // we have successfully pasted it. Data contains the id
        console.log(data);
    })
    .fail(function (err) {
        console.log(err);
    });
```

## API

**PastebinAPI()** : Constructor.

```js
var PastebinAPI = require('pastebin-js');

// Without any parameter you can only use getPaste!
var pastebin = new PastebinAPI();

// Provide a developer key as string, this key can be found when logged in.
// This can be found here: http://pastebin.com/api#1
var pastebin = new PastebinAPI('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

// Provide an object containing the api_dev_key, api_user_name and api_user_password
pastebin = new PastebinAPI({
                'api_dev_key' : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                'api_user_name' : 'PastebinUserName',
                'api_user_password' : 'PastebinPassword'
               });
```

## GET

**pastebin.getPaste(pasteID)** : get a raw paste, providing the ``pasteID``

```js
pastebin
  .getPaste('76b2yNRt')
  .then(function (data) {
    // data contains the raw paste
    console.log(data);
  })
  .fail(function (err) {
    // Something went wrong
    console.log(err);
  })
```

**pastebin.getPaste(pasteID, isPrivate)** : get a private paste. Set ``isPrivate`` to ``true``. You will need to provide a username & password in your config!

**pastebin.getUserInfo()** : gets the userinfo

**pastebin.listUserPastes(limit)** : gets a list of pastes from the user. ``limit`` is optional, from 1 - 100 (default: 50)

**pastebin.listTrendingPastes()** : gets a list of trending pastes on Pastebin

## POST

**pastebin.createPaste(text, title, format, privacy, expiration)** : creates a paste. ``text`` is required, other
arguments are optional. For ``format``, ``privacy`` and ``expiration``, have a look at **lib/config.js** for the allowed input.
If ``privacy`` is set to **2** or **3**, you will need to provide a username && password in the constructor (Pastebin requires a api_user_key)

```js
pastebin
  .createPaste("Test from pastebin-js", "pastebin-js")
  .then(function (data) {
    // paste successfully created, data contains the id
    console.log(data);
  })
  .fail(function (err) {
    // Something went wrong
    console.log(err);
  })
```

**pastebin.createPasteFromFile(filename, title, format, privacy, expiration)** : tries to read the file provided in ``filename`` (UTF-8) and paste it. Works the same as previous method.

You can also use an object as the first parameter:

```js
pastebin
    .createPaste({
        text: "This is a private paste",
        title: "Private",
        format: null,
        privacy: 2,
        expiration: '10M'
    })

pastebin
    .createPasteFromFile({
        filename: "./filename.txt",
        title: "Public text file listed under my username",
        format: null,
        privacy: 3,
        expiration: '10M'
    })

```

### Privacy

The ``.createPaste`` and ``.createPasteFromFile`` use privacy levels that are listed on the [Pastebin API](http://pastebin.com/api#7), with one extra added. The following levels are available:

```
    0 = Public, anonymous
    1 = Unlisted, anonymous
    2 = Private, user
    3 = Public, user
```

Keep this in mind when you want to create a paste. Level 2 and 3 are posted under your username on Pastebin (and will need a Username and Password in the constructor, see above)

## DELETE

**pastebin.deletePaste(pasteID)** : Tries to delete a paste, created by the user

## Synchronous support

pastebin-js now has synchronous support as well. The following methods are available:

```
    .getPasteSync(id, callback)
    .createPasteSync(text, title, format, privacy, expiration, callback)
    .createPasteSync(object, callback)
    .createPasteFromFileSync(filename, title, format, privacy, expiration, callback)
    .createPasteFromFileSync(object, callback)
    .deletePasteSync(pasteID, callback)
    .listUserPastesSync(limit, callback)
    .listTrendingPastesSync(callback)
    .getUserInfoSync(callback)
```

The callback will be called with two parameters: ```callback(err, data)```

## Bugs / issues

Please, if you find any bugs, or are a way better developer than I am (as in, you are thinking 'spaghetti' when looking at my
code), feel free to create an issue or provide me with some pull requests! This is my first full module ever written for
NodeJS.

## License

Copyright (c) 2013-2016 J.W. Lagendijk &lt;jwlagendijk@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
