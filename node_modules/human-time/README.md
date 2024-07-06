human
=====

show seconds in a human-readable form

Usage
-----

This repository comes with a couple of implementations of the base algorithm in
different languages.  You can use any by simply dropping the logic into your
source code.

Node.JS
-------

You can install the javascript version of this with

    npm install human-time

and use it like

``` js
var human = require('human-time');

human(754);
// => "12 minutes ago"

human(new Date(Date.now() + 5 * 1000))
// => "5 seconds from now"

human(new Date(Date.now() - 5 * 1000))
// => "5 seconds ago"
```

Example (C)
-----------

compile

    make

run

    $ ./human 65
    1 minute
    $ ./human 600
    10 minutes

With the C example, you can optionally pass `-s` to get a suffix

    $ ./human 57483
    15 hours
    $ ./human -s 57483
    15 hours from now
    $ ./human -s -57483
    15 hours ago

License
-------

MIT
