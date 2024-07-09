# FClone

Clone objects by dropping circular references 

[![Build Status](https://travis-ci.org/soyuka/fclone.svg?branch=master)](https://travis-ci.org/soyuka/fclone)

This module clones a Javascript object in safe mode (eg: drops circular values) recursively. Circular values are replaced with a string: `'[Circular]'`.

Ideas from [tracker1/safe-clone-deep](https://github.com/tracker1/safe-clone-deep). I improved the workflow a bit by:
- refactoring the code (complete rewrite)
- fixing node 6+
- micro optimizations
- use of `Array.isArray` and `Buffer.isBuffer`

Node 0.10 compatible, distributed files are translated to es2015.

## Installation

```bash
npm install fclone
# or
bower install fclone
```

## Usage

```javascript
const fclone = require('fclone');

let a = {c: 'hello'};
a.b = a;

let o = fclone(a);

console.log(o);
// outputs: { c: 'hello', b: '[Circular]' }

//JSON.stringify is now safe
console.log(JSON.stringify(o));
```

## Benchmarks

Some benchs:

```
fclone x 17,081 ops/sec ±0.71% (79 runs sampled)
fclone + json.stringify x 9,433 ops/sec ±0.91% (81 runs sampled)
util.inspect (outputs a string) x 2,498 ops/sec ±0.77% (90 runs sampled)
jsan x 5,379 ops/sec ±0.82% (91 runs sampled)
circularjson x 4,719 ops/sec ±1.16% (91 runs sampled)
deepcopy x 5,478 ops/sec ±0.77% (86 runs sampled)
json-stringify-safe x 5,828 ops/sec ±1.30% (84 runs sampled)
clone x 8,713 ops/sec ±0.68% (88 runs sampled)
Fastest is util.format (outputs a string)
```
