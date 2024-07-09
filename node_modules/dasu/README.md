[![npm](https://img.shields.io/npm/v/dasu.svg?maxAge=3600)](https://www.npmjs.com/package/dasu)
[![npm](https://img.shields.io/npm/dm/dasu.svg?maxAge=3600)](https://www.npmjs.com/package/dasu)
[![npm](https://img.shields.io/npm/l/dasu.svg?maxAge=3600)](https://www.npmjs.com/package/dasu)
![macos](https://github.com/talmobi/dasu/workflows/macos/badge.svg)
![windows](https://github.com/talmobi/dasu/workflows/windows/badge.svg)
![ubuntu](https://github.com/talmobi/dasu/workflows/ubuntu/badge.svg)

# 出す　ー　dasu
## The same xhr API for both client and server

Simple to use:
```javascript
var dasu = require('dasu')
var req = dasu.req

// same params as Node's require('http').request
var params = {
  method: 'GET',
  protocol: 'http',
  hostname: 'uinames.com',
  port: 80,
  path: '/api/',
}

req(params, function (err, res, data) {
  console.log(res.statusCode)
  console.log(res.headers)
  var json = JSON.parse(data)
  console.log(json)
  // eg: {"name":"Milica","surname":"Maslo","gender":"female","region":"Slovakia"}
})


// turn auto-follow redirects off
dasu.follow = false

// force mode 'node', 'browser', 'auto'
// (useful with Electron etc)
dasu.mode = 'auto' // uses window.XMLHttpRequest if available
```

## Test in browser
https://runkit.com/talmobi/runkit-npm-dasu

## About
Using XMLHttpRequest or Node's http libraries under the hood, **dasu** aims to streamline your basic xhr for both contexts. It provides the familiar structure to Node's http library (http://devdocs.io/node/http#http_http_request_options_callback)


## Why
Test your client side request/fetch/xhr logic on the server side with the same api you're using on the client.

## Alternatives
https://github.com/visionmedia/superagent


## Install
from npm
```
npm install --save dasu
```

from source
```
git clone https://github.com/talmobi/dasu
cd dasu
npm install
```


## Test
```
git clone https://github.com/talmobi/dasu
cd dasu
npm install
npm test
```
