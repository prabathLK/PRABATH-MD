# biskviit
Yet another node module for handling http cookies. This module parses `Set-Cookie` header, stores the data to memory and returns valid value for `Cookie` header once needed based on the stored cookie data.

> **NB** Requires iojs or Node v4+ to support some ES6 features used by this module. Might work with older Node versions as well but not tested

## Usage

Install from npm

    npm install biskviit --save

Require as `Biskviit`

```javascript
var Biskviit = require('biskviit');
```

Create a cookie managing *biskviit* instance

```javascript
var biskviit = new Biskviit(options);
```

Where

  * **options** is an optional options object with the following properties:
    * **sessionTimeout** is the amount in seconds for default session length, used for cookies without an expire argument

**Example**

```javascript
var Biskviit = require('biskviit');
var biskviit = new Biskviit({
    sessionTimeout: 5 * 60 // expire cookies after 5 minutes
});
```

### set

To add new cookies to the storage use `set`

```javascript
biskviit.set(cookieString, url)
```

Where

  * **cookieString** is the value from the `Set-Cookie:` header
  * **url** is the currently open URL that sent the cookie header

**Example**

```javascript
biskviit.set('theme=light', 'http://example.com/');
biskviit.set('sessionToken=abc123; Expires=Wed, 09 Jun 2021 10:18:14 GMT', 'http://example.com/');
```

### get

To list all available cookies for a specified URL use `get`

```javascript
var cookiesString = biskviit.get(url);
```

Where

  * **url** is the URL the cookies are required for

**Example**

```javascript
var cookiesString = biskviit.get('http://example.com/');
// theme=light; sessionToken=abc123
```

### list

If you need to filter cookies as objects, use `list`

```javascript
var cookiesString = biskviit.list(url);
```

Where

  * **url** is the URL the cookies are required for

**Example**

```javascript
var cookiesString = biskviit.list('http://example.com/');
// [{key: 'theme', value: 'light', expires: ...}, {key: 'sessionToken', value: 'abc123', expires: ...}]
```

## License

**MIT**