# levenshtein-edit-distance

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

[Levenshtein edit distance][wiki] (by [Vladimir Levenshtein][vlad]).
No cruft.
Real fast.

## Install

[npm][]:

```sh
npm install levenshtein-edit-distance
```

## API

```js
var levenshtein = require('levenshtein-edit-distance')

levenshtein('levenshtein', 'levenshtein') // => 0
levenshtein('sitting', 'kitten') // => 3
levenshtein('gumbo', 'gambol') // => 2
levenshtein('saturday', 'sunday') // => 3

// Case sensitive!
levenshtein('DwAyNE', 'DUANE') !== levenshtein('dwayne', 'DuAnE') // => true

// Insensitive
levenshtein('DwAyNE', 'DUANE', true) === levenshtein('dwayne', 'DuAnE', true) // => true

// Order insensitive
levenshtein('aarrgh', 'aargh') === levenshtein('aargh', 'aarrgh') // => true
```

## CLI

```txt
Usage: levenshtein-edit-distance [options] word word

Levenshtein edit distance. No cruft. Real fast.

Options:

  -h, --help           output usage information
  -v, --version        output version number
  -i, --insensitive    ignore casing

Usage:

# output distance
$ levenshtein-edit-distance sitting kitten
# 3

# output distance from stdin
$ echo "saturday,sunday" | levenshtein-edit-distance
# 3
```

## Related

*   [`levenshtein.c`](https://github.com/wooorm/levenshtein.c)
    — C API
*   [`levenshtein`](https://github.com/wooorm/levenshtein)
    — C CLI
*   [`levenshtein-rs`](https://github.com/wooorm/levenshtein-rs)
    — Rust API
*   [`stemmer`](https://github.com/words/stemmer)
    — Porter stemming algorithm
*   [`lancaster-stemmer`](https://github.com/words/lancaster-stemmer)
    — Lancaster stemming algorithm
*   [`double-metaphone`](https://github.com/words/double-metaphone)
    — Double Metaphone implementation
*   [`soundex-code`](https://github.com/words/soundex-code)
    — Fast Soundex implementation
*   [`dice-coefficient`](https://github.com/words/dice-coefficient)
    — Sørensen–Dice coefficient
*   [`syllable`](https://github.com/words/syllable)
    — Syllable count in an English word

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/words/levenshtein-edit-distance.svg

[build]: https://travis-ci.org/words/levenshtein-edit-distance

[coverage-badge]: https://img.shields.io/codecov/c/github/words/levenshtein-edit-distance.svg

[coverage]: https://codecov.io/github/words/levenshtein-edit-distance

[downloads-badge]: https://img.shields.io/npm/dm/levenshtein-edit-distance.svg

[downloads]: https://www.npmjs.com/package/levenshtein-edit-distance

[size-badge]: https://img.shields.io/bundlephobia/minzip/levenshtein-edit-distance.svg

[size]: https://bundlephobia.com/result?p=levenshtein-edit-distance

[npm]: https://www.npmjs.com

[license]: license

[author]: https://wooorm.com

[wiki]: https://en.wikipedia.org/wiki/Levenshtein_distance

[vlad]: https://en.wikipedia.org/wiki/Vladimir_Levenshtein
