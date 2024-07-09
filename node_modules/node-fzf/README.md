[![npm](https://img.shields.io/npm/v/node-fzf.svg?maxAge=3600&style=flat-square)](https://www.npmjs.com/package/node-fzf)
[![npm](https://img.shields.io/npm/dm/node-fzf.svg?maxAge=3600)](https://www.npmjs.com/package/node-fzf)
[![npm](https://img.shields.io/npm/l/node-fzf.svg?maxAge=3600&style=flat-square)](https://github.com/talmobi/node-fzf/blob/master/LICENSE)

#  node-fzf
[fzf](https://github.com/junegunn/fzf) inspired fuzzy CLI list selection 🎀

![](https://i.imgur.com/SFUV5nW.gif)

## Easy to use

#### CLI usage
```bash
npm install -g node-fzf

# by default (TTY mode) will glob list of current dir files
nfzf

# using pipes
find . | nfzf | xargs cat | less
alias merge="git branch | nfzf | xargs git merge"
alias checkout="git branch | nfzf | xargs git checkout"
```

#### API usage

##### promises
```js
const nfzf = require( 'node-fzf' )

// if you only care about r.query
// nfzf.getInput( label )

const opts = {
  list: [ 'whale', 'giraffe', 'monkey' ]
}

;( async function () {
  // opens interactive selection CLI
  // note! this messes with stdout so if you are
  // writing to stdout at the same time it will look a bit messy..
  const result = await nfzf( opts )

  const { selected, query } = result

  if( !selected ) {
    console.log( 'No matches for:', query )
  } else {
    console.log( selected.value ) // 'giraffe'
    console.log( selected.index ) // 1
    console.log( selected.value === opts.list[ selected.index ] ) // true
  }
} )()

// can also add more items later..
setInterval( function () {
  opts.list.push( 'foobar' )

  // an .update method has been attached to the object/array
  // that you gave to nfzf( ... )
  opts.update( list )
}, 1000 )
```

##### callbacks
```js
const nfzf = require( 'node-fzf' )

// if you only care about r.query
// nfzf.getInput( label, callback )

const list = [ 'whale', 'giraffe', 'monkey' ]

// opens interactive selection CLI
// note! this messes with stdout so if you are
// writing to stdout at the same time it will look a bit messy..
const api = nfzf( list, function ( result ) {
  const { selected, query } = result
  if( !selected ) {
    console.log( 'No matches for:', query )
  } else {
    console.log( selected.value ) // 'giraffe'
    console.log( selected.index ) // 1
    console.log( selected.value === list[ selected.index ] ) // true

    // the api is a reference to the same argument0 object
    // with an added .update method attached.
    console.log( list === api ) // true
    console.log( list.update === api.update ) // true
  }

} )

// can also add more items later..
setInterval( function () {
  list.push( 'foobar' )
  api.update( list )
}, 1000 )
```

#### Keyboard
```bash
<ctrl-j>,<ctrl-n>,down        scroll down
<ctrl-k>,<ctrl-p>,up          scroll up

<ctrl-d>                      scroll down by page size
<ctrl-u>                      scroll up by page size

<ctrl-a>                      jump to start of input
<ctrl-e>                      jump to end of input

<esc>,<ctrl-q>,<ctrl-c>       cancel

<return>,<ctrl-m>             trigger callback/promise with current selection and exit

<ctrl-w>                      delte last word from input

<ctrl-b>                      jump back a word
<ctrl-f>                      jump forward a word

<backspace>                   delete last input character

<ctrl-s>                      switch between modes (fuzzy, normal)
```

## About
[fzf](https://github.com/junegunn/fzf) inspired fuzzy CLI list selection thing for node.

## Why
easy fuzzy list selection UI for NodeJS CLI programs.

## How
Mostly [cli-color](https://github.com/medikoo/cli-color) for dealing with the terminal rendering
and [ttys](https://github.com/TooTallNate/ttys) to hack the ttys to simultaneously
read from non TTY stdin and read key inputs from TTY stdin -> So that we can get piped input while
also at the same time receive and handle raw keyboard input.

## Used by
[yt-play](https://github.com/talmobi/yt-play)

[yt-search](https://github.com/talmobi/yt-search)

## Alternatives
[fzf](https://github.com/junegunn/fzf) even though it doesn't work in NodeJS directly is all-in-all a better tool than this piece of crap :) Highly recommend~

[ipt](https://github.com/ruyadorno/ipt) - similar node based solution

## Test
```bash
npm test
```
