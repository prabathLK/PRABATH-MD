# buffer-url

Generate a usable url for a valid node style buffer


[![NPM](https://nodei.co/npm/buffer-url.png)](https://nodei.co/npm/buffer-url/)



## Usage

### `createUrl(buffer, mimetype?)` => String

Create a url that can be used as a `src` attribute of a `<video>`, `<audio>`
or `<image>` element from the binary `buffer` provided.  If the `mimetype`
has been provided, then this will be used to create teh buffer, but if
not the [`binary-type`](https://github.com/DamonOehlman/binary-type)
package will be used to help out.

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
