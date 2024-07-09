# similarity

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

How similar are these two strings?

## Install

[npm][]:

```sh
npm install similarity
```

## Use

```js
var similarity = require('similarity')

similarity('food', 'food') // 1
similarity('food', 'fool') // 0.75
similarity('ding', 'plow') // 0
similarity('chicken', 'chick') // 0.714285714
similarity('ES6-Shim', 'es6 shim') // 0.875 (case insensitive)
similarity('ES6-Shim', 'es6 shim', {sensitive: true}) // 0.5 (case sensitive)
```

## API

### `similarity(left, right[, options])`

Get the similarity (`number`) between two values (`string`s),
where `0` is dissimilar, and `1` is equal.

*   `options.sensitive` (`boolean`, default: `false`)
    — Turn on (`true`) to treat casing differences as differences

## CLI

```txt
Usage: similarity [options] <word> <word>

How similar are these two strings?

Options:

  -h, --help           output usage information
  -v, --version        output version number
  -s, --sensitive      be sensitive to casing differences

Usage:

# output similarity
$ similarity sitting kitten
0.5714285714285714
$ similarity saturday sunday
0.625
```

## See also

Note: This module uses [Levenshtein distance][wiki] to measure similarity, but
there are many other algorithms for string comparison.
Here are a few:

*   [`clj-fuzzy`](https://github.com/Yomguithereal/clj-fuzzy)
    — Handy collection of algorithms dealing with fuzzy strings and phonetics
*   [`natural`](https://github.com/NaturalNode/natural)
    — General natural language facilities for node
*   [`string-similarity`](https://github.com/aceakash/string-similarity)
    — Finds degree of similarity between two strings, based on Dice’s
    coefficient
*   [`dice-coefficient`](https://github.com/words/dice-coefficient)
    — Sørensen–Dice coefficient
*   [`jaro-winkler`](https://github.com/jordanthomas/jaro-winkler)
    — The Jaro-Winkler distance metric

## License

[ISC][license] © [Zeke Sikelianos][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/words/similarity.svg

[build]: https://travis-ci.org/words/similarity

[coverage-badge]: https://img.shields.io/codecov/c/github/words/similarity.svg

[coverage]: https://codecov.io/github/words/similarity

[downloads-badge]: https://img.shields.io/npm/dm/similarity.svg

[downloads]: https://www.npmjs.com/package/similarity

[size-badge]: https://img.shields.io/bundlephobia/minzip/similarity.svg

[size]: https://bundlephobia.com/result?p=similarity

[npm]: https://www.npmjs.com

[license]: license

[author]: http://zeke.sikelianos.com

[wiki]: https://en.wikipedia.org/wiki/Levenshtein_distance
