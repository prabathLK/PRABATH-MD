ttys
====
### Guaranteed read and write streams to the terminal


This micro module provides `tty.ReadStream` and `tty.WriteStream` instances to the
user's terminal, even when the regular `stdin` or `stdout` streams are already
being piped to other commands.

Installation
------------

Install with `npm`:

``` bash
$ npm install ttys
```


The setup
---------

Suppose you want to provide a `curl | node` command to your users.

The script could be something as simple as printing "Hello World" and exiting.

``` js
// script.js
console.log('Hello World')
```

Place that on your websever and have your users invoke the command:

``` bash
$ curl aweso.me/script.js | node
Hello World
```

Awesome!!!

The problem
-----------

Now suppose that you wanted to alter `script.js` to prompt the user for their
name, so that you can personalize it a little bit.

The problem is that `process.stdin` is used up because it gets piped from the curl
command, and ends before node runs the script. If you try to call
`process.stdin.resume()` and listen for "data" and "end" events, you will see that
the "end" event will be fired immediately.



The solution
------------

Using `ttys`, you can get guaranteed access to a `stdin` readable stream and
`stdout` writable stream. It's easy!

``` js
var ttys = require('ttys')
var readline = require('readline')

var i = readline.createInterface(ttys.stdin, ttys.stdout)
i.question('What is your name? ', function (name) {
  console.log('Hello %s', name)

  i.close()
  ttys.stdin.pause()
})
```

Now when your users run the script, then they will be prompted as you would
expect:

``` bash
$ curl aweso.me/script.js | node
What is your name? Nathan
Hello Nathan
```

That's it!


License
-------

(The MIT License)

Copyright (c) 2012 Nathan Rajlich &lt;nathan@tootallnate.net&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
