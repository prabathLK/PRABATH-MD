# fetch

Fetch url contents. Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.

[![Build Status](https://travis-ci.org/andris9/fetch.svg?branch=master)](https://travis-ci.org/andris9/fetch)

## Install

    npm install fetch

## Usage

See examples folder for a complete example

## Fetch from URL

`fetch.fetchUrl(url [, options], callback)`

Where

  * **url** is the url to fetch
  * **options** is an optional options object
  * **callback** is the callback to run - `callback(error, meta, body)`

Example

    var fetchUrl = require("fetch").fetchUrl;

    // source file is iso-8859-15 but it is converted to utf-8 automatically
    fetchUrl("http://kreata.ee/iso-8859-15.php", function(error, meta, body){
        console.log(body.toString());
    });

**NB** If the file has been marked with charset other than utf-8, it is converted automatically.

By default `iconv-lite` is used for charset conversion. If you want to use `node-iconv` module instead,
add `"iconv": "*"` to your package.json file, it will be picked up by `fetch` automatically.

## Streaming

`fetch.FetchStream(url [, options]) -> Stream`

Where

  * **url** is the url to fetch
  * **options** is an optional options object

With events:

  * **data** with a data chunk - `function(chunk){}`
  * **meta** with some information about the response `function(meta){}`
  * **end** when the receiving is ready
  * **error**

Example

    var FetchStream = require("fetch").FetchStream;

    var fetch = new FetchStream("http://google.com");

    fetch.on("data", function(chunk){
        console.log(chunk);
    });

## Options

Possible option values

 * **maxRedirects** how many redirects allowed, defaults to 10
 * **disableRedirects** set to true if redirects are not allowed, defaults to false
 * **headers** optional header fields, in the form of `{'Header-Field':'value'}`
 * **maxResponseLength** maximum allowd length for the file, the remainder is cut off. Defaults to `Infinity`
 * **method** defaults to GET
 * **payload** request body
 * **disableGzip** set to false, to disable content gzipping, needed for Node v0.5.9 which has buggy zlib
 * **cookies** an array of cookie definitions in the form of `['name=val']`
 * **cookieJar** for sharing cookies between requests, see below
 * **outputEncoding** valid for `fetchUrl`
 * **disableDecoding** valid for `fetchUrl`, set to true to disable automatic charset decoding to utf-8
 * **overrideCharset** valid for `fetchUrl`, set input encoding
 * **asyncDnsLoookup** use high performance asyncronous DNS resolution based on c-ares instead of a thread pool calling getaddrinfo(3)
 * **timeout** set a timeout in ms
 * **agentHttps** pass-through http.request agent parameter for https
 * **agentHttp** pass-through http.request agent parameter for http
 * **agent** pass-through http.request agent parameter as fallback, if agentHttps or agentHttp are not specified
 * **rejectUnauthorized** whether to reject self-signed certificates (`true`, default behavior), or ignore and allow them (`false`)


## Meta object

Meta object contains following fields:

  * **status** HTTP status code
  * **responseHeaders** response headers
  * **finalUrl** last url value, useful with redirects
  * **redirectCount** how many redirects happened
  * **cookieJar** CookieJar object for sharing/retrieving cookies

## Headers

Request headers can be set with `options.headers`

    options = {
        headers:{
            "X-My-Header": "This is a custom header field"
        }
    }

## User-Agent
User-Agent value can be set with `options.headers['User-Agent']` value. Defaults to `"FetchStream"`

    options = {
        headers: {
            "User-Agent": "MyUseragent/1.0"
        }
    }

## Cookies
Cookies can be set with `options.cookies` which takes an array with cookie definitions

    options = {
        cookie: ["name=value", "key=value; path=/; secure"]
    }

Paths, domain, expire and other cookie settings are honored, so try not to set cookies with expire dates in the past. If domain is not set, any domain will pass, same for paths.

**NB** Do not set cookie field directly in request header as it will be overwritten.

## Cookie sharing

Cookies can be shared between different requests, this can be achieved with `CookieJar`

    var fetch = require("fetch");

    var cookies = new fetch.CookieJar();

    // add one cookie for testing
    cookies.setCookie('alfa=beta; path=/;');

    // create a FetchStream with custom CookieJar
    var f = fetch.FetchStream("http://www.example.com/page1",{cookieJar: cookies});

    f.on("end", function(){
        // if cookies were set with the previos request, the data is
        // saved in 'cookieJar' and passed to the next request
        fetch.FetchStream("http://www.example.com/page1",{cookieJar: cookies});
    });


## Redirects

Redirects are on by default, use `options.disableRedirects` to disable. Maximum redirect count can be set with `options.maxRedirects` (defaults to 10)

    options = {
        disableRedirects: true
    }

    options = {
        maxRedirects: 100
    }

## Disable Gzip support

Gzip and Deflate support is automatically on. This is problematic in Node v0.5.9 and below since Zlib support on these versions is buggy with unpacking and tends to yield in error.

    options = {
        disableGzip: true
    }

## Piping to file

`FetchStream` is a readable Stream object and thus can be piped. For example stream URL contents directly to a file:

    var FetchStream = require("fetch").FetchStream,
        fs = require("fs"),
        out;

    out = fs.createWriteStream('file.html');
    new FetchStream("http://www.example.com/index.php").pipe(out);

## License

BSD
