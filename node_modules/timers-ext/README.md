[![Build status][build-image]][build-url]
[![Tests coverage][cov-image]][cov-url]
[![npm version][npm-image]][npm-url]

# timers-ext

## Timers extensions

### Installation

    $ npm install timers-ext

To port it to Browser or any other (non CJS) environment, use your favorite CJS bundler. No favorite yet? Try: [Browserify](http://browserify.org/), [Webmake](https://github.com/medikoo/modules-webmake) or [Webpack](http://webpack.github.io/)

### API

#### MAX*TIMEOUT *(timers-ext/max-timeout)\_

Maximum possible timeout value in milliseconds. It equals to maximum positive value for 32bit signed integer, so _2³¹ (2147483647)_, which makes it around 24.9 days

#### delay(fn[, timeout]) _(timers-ext/delay)_

Returns function which when invoked will call _fn_ function after specified
_timeout_. If _timeout_ is not provided [nextTick](https://github.com/medikoo/next-tick/#next-tick) propagation is used.

#### once(fn[, timeout]) _(timers-ext/once)_

Makes sure to execute _fn_ function only once after a defined interval of time (debounce). If _timeout_ is not provided [nextTick](https://github.com/medikoo/next-tick/#next-tick) propagation is used.

```javascript
var nextTick = require("next-tick");
var logFoo = function () { console.log("foo"); };
var logFooOnce = require("timers-ext/once")(logFoo);

logFooOnce();
logFooOnce(); // ignored, logFoo will be logged only once
logFooOnce(); // ignored

nextTick(function () {
  logFooOnce(); // Invokes another log (as tick passed)
  logFooOnce(); // ignored
  logFooOnce(); // ignored
});
```

#### validTimeout(timeout) _(timers-ext/valid-timeout)_

Validates timeout value.  
For `NaN` resolved _timeout_ `0` is returned.
If _timeout_ resolves to a number:

- for _timeout < 0_ `0` is returned
- for _0 >= timeout <= [MAX_TIMEOUT](#max_timeout-timers-extmax-timeout)_, `timeout` value is returned
- for _timeout > [MAX_TIMEOUT](#max_timeout-timers-extmax-timeout)_ exception is thrown

### Tests

    $ npm test

## Security contact information

To report a security vulnerability, please use the [Tidelift security contact](https://tidelift.com/security). Tidelift will coordinate the fix and disclosure.

[build-image]: https://github.com/medikoo/timers-ext/workflows/Integrate/badge.svg
[build-url]: https://github.com/medikoo/timers-ext/actions?query=workflow%3AIntegrate
[cov-image]: https://img.shields.io/codecov/c/github/medikoo/timers-ext.svg
[cov-url]: https://codecov.io/gh/medikoo/timers-ext
[npm-image]: https://img.shields.io/npm/v/timers-ext.svg
[npm-url]: https://www.npmjs.com/package/timers-ext
