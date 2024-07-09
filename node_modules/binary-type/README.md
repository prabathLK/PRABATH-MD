# binary-type

A simple package that provides the ability to check if a buffer matches
a specific mimetype, and secondly the ability to guess a mimetype given
a buffer.


[![NPM](https://nodei.co/npm/binary-type.png)](https://nodei.co/npm/binary-type/)

[![Build Status](https://img.shields.io/travis/DamonOehlman/binary-type.svg?branch=master)](https://travis-ci.org/DamonOehlman/binary-type) 

## Reference

### `matches(mimetype, buffer) => Boolean`

Return true if the supplied `buffer` has a binary file signature that
matches what is expected for the specified `mimetype`.

### `guess(buffer) => String`

Run the supplied `buffer` through the various known mimetypes to attempt
to determine it's mimetype (returned as a string value if found).

__NOTE:__ Only a few file signatures have been implemented at this stage,
but feel free to issue a pull request if you require additional types. A
good resource of binary file signatures can be found at the following url:

<http://www.garykessler.net/library/file_sigs.html>

## License(s)

### ISC

Copyright (c) 2015, Damon Oehlman <damon.oehlman@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
