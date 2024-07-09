// used to read keyboard input while at the same time
// reading piped stdin input and printing to stdout
const keypress = require( 'keypress' )
const ttys = require( 'ttys' )

const stdin = ttys.stdin
const stdout = ttys.stdout

// get printed width of text
// ex. 漢字 are 4 characters wide but still
// only 2 characters in length
const stringWidth = require( 'string-width' )

// print/render to the terminal
const clc = require( 'cli-color' )

// available filtering modes ( fuzzy by default )
const modes = [ 'fuzzy', 'normal' ]

module.exports = queryUser

// helper to only get user input
module.exports.getInput = getInput

function getInput ( label, callback )
{
  const opts = {
    label: label,
    list: [],
    nolist: true // don't print list/matches
  }

  return queryUser( opts, callback )
}

function queryUser ( opts, callback )
{
  /* opts should reference same object at all times
   * as it will be returned as an api as well that the
   * user can use.
   *
   * a few functions will be added to opts that will
   * work as an API to the user to ex. update the list
   * at a later time.
   *
   * we do it like this instead of return a separate api
   * object in order to support promises when a callback
   * fn is omitted.
   */
  const _opts = opts

  if ( Array.isArray( _opts ) ) {
    _opts.list = _opts
    _opts.mode = 'fuzzy'
  }

  if ( typeof _opts !== 'object' ) {
    // in JavaScript arrays are also a typeof 'object'
    throw new TypeError( 'arg0 has to be an array or an object' )
  }

  _opts.list = _opts.list || []
  _opts.mode = _opts.mode || 'fuzzy'

  const promise = new Promise( function ( resolve, reject ) {
    let originalList = _opts.list || []
    let _list = prepareList( originalList )

    let _input = ''

    // user defined vertical scrolling
    let scrollOffset = 0

    _opts.update = function ( list ) {
      originalList = list
      _opts.list = originalList
      _list = prepareList( originalList )
      render()
    }

    _opts.stop = function () {
      finish()
    }

    // prepare provided list for internal searching/sorting
    function prepareList ( newList ) {
      const list = newList.map( function ( value, index ) {
        return {
          originalValue: value, // text
          originalIndex: index
        }
      } )
      return list
    }

    function finish ( result ) {
      if ( finish.done ) return
      finish.done = true

      stdout.removeListener( 'resize', handleResize )

      stdin.removeListener( 'keypress', handleKeypress )

      stdin.setRawMode && stdin.setRawMode( false )
      stdin.pause()

      if ( !result ) {
        // quit, exit, cancel, abort
        buffer = undefined

        result = {
          selected: undefined,

          // common alternatives for the same thing
          query: buffer,
          search: buffer,
          input: buffer
        }
      }

      if ( callback ) {
        callback( result )
      }

      resolve( result )
    }

    // make `process.stdin` begin emitting "keypress" events
    keypress( stdin )

    // selected index relative to currently matched results
    // (filtered subset of _list)
    let selectedIndex = 0

    // input buffer
    let buffer = ''

    // input cursor position ( only horizontal )
    // relative to input buffer
    let cursorPosition = 0

    // number of items printed on screen, usually ~7
    let _printedMatches = 0

    let _matches = []
    let _selectedItem

    const MIN_HEIGHT = 6

    function getMaxWidth () {
      const mx = stdout.columns - 7
      return Math.max( 0, mx )
    }

    stdout.on( 'resize', handleResize )

    function handleResize () {
      clearTimeout( handleResize.timeout )
      handleResize.timeout = setTimeout( function () {
        cleanDirtyScreen()
        render()
      }, 1 )
    }

    const debug = false

    function handleKeypress ( chunk, key ) {
      debug && console.log( 'chunk: ' + chunk )

      key = key || { name: '' }

      const name = String( key.name )

      debug && console.log( 'got "keypress"', key )

      if ( key && key.ctrl && name === 'c' ) {
        cleanDirtyScreen()
        return finish()
      }

      if ( key && key.ctrl && name === 'z' ) {
        cleanDirtyScreen()
        return finish()
      }

      if ( key && key.ctrl && name === 'l' ) {
        // return stdout.write( clc.reset )
      }

      const view_height = _printedMatches || 10

      if ( key.ctrl ) {
        switch ( name ) {
          case 'h': // backspace
            // ignore
            break

          case 'b': // jump back 1 word
            {
              const slice = buffer.slice( 0, cursorPosition )
              const m = slice.match( /\S+\s*$/ ) // last word
              if ( m && m.index > 0 ) {
                // console.log( m.index )
                cursorPosition = m.index
              } else {
                cursorPosition = 0
              }
            }
            return render()
            break

          case 'j': // down
          case 'n': // down
            selectedIndex += 1
            return render()
            break
          case 'k': // up
          case 'p': // up
            selectedIndex -= 1
            return render()
            break

          case 'l': // right
            // ignore
            break

          case 's':
            // TODO ctrl-s support? switch between match modes?
            {
              // cleanDirtyScreen()
              let i = modes.indexOf( _opts.mode )
              _opts.mode = modes[ ++i % modes.length ]
            }
            return render()
            break

          case 'f': // jump forward 1 word
            {
              const slice = buffer.slice( cursorPosition )
              const m = slice.match( /^\S+\s*/ ) // first word
              if ( m && m.index >= 0 && m[ 0 ] && m[ 0 ].length >= 0 ) {
                // console.log( m.index )
                cursorPosition += ( m.index + m[ 0 ].length )
              } else {
                cursorPosition = buffer.length
              }
            }
            return render()
            break

          case 'd': // down
            // basically intended as page-down
            selectedIndex += view_height
            return render()
            break

          case 'u': // up
            // basically intended as page-up
            selectedIndex -= view_height
            return render()
            break

          case 'a': // beginning of line
            cursorPosition = 0
            return render()
            break

          case 'e': // end of line
            cursorPosition = buffer.length
            return render()
            break

          case 'w': // clear word
            {
              const a = buffer.slice( 0, cursorPosition )
              const b = buffer.slice( cursorPosition )
              const m = a.match( /\S+\s*$/ ) // last word
              if ( m && m.index > 0 ) {
                // console.log( m.index )
                cursorPosition = m.index
                buffer = a.slice( 0, cursorPosition ).concat( b )
              } else {
                cursorPosition = 0
                buffer = b
              }
            }
            return render()
            break

          case 'q': // quit
            cleanDirtyScreen()
            return finish()
        }
      }

      // usually ALT key
      if ( key.meta ) {
        switch ( name ) {
          case 'n': // left arrow key
            scrollOffset--
            return render()

          case 'p': // right arrow key
            scrollOffset++
            return render()
        }
      }

      if ( key.ctrl ) return
      if ( key.meta ) return

      switch ( name ) {
        case 'backspace': // ctrl-h
          {
            const a = buffer.slice( 0, cursorPosition - 1 )
            const b = buffer.slice( cursorPosition )
            buffer = a.concat( b )

            cursorPosition--
            if ( cursorPosition < 0 ) {
              cursorPosition = 0
            }
          }
          return render()
          break

        case 'left': // left arrow key
          cursorPosition--
          if ( cursorPosition < 0 ) cursorPosition = 0
          return render()
          break

        case 'right': // right arrow key
          cursorPosition++
          if ( cursorPosition > buffer.length ) {
            cursorPosition = buffer.length
          }
          return render()
          break

        // text terminals treat ctrl-j as newline ( enter )
        // ref: https://ss64.com/bash/syntax-keyboard.html
        case 'down': // ctrl-j
        case 'enter':
          selectedIndex += 1
          return render()

        case 'up':
          selectedIndex -= 1
          return render()

        case 'esc':
        case 'escape':
          cleanDirtyScreen()
          return finish()

        // hit return key ( aka enter key ) ( aka ctrl-m )
        case 'return': // ctrl-m
          cleanDirtyScreen()

          function transformResult ( match ) {
            return {
              value: match.originalValue,
              index: match.originalIndex
            }
          }

          const result = {
            selected: _selectedItem && transformResult( _selectedItem ) || undefined,

            // common alternatives for the same thing
            query: buffer,
            search: buffer,
            input: buffer
          }

          return finish( result )
      }

      if ( chunk && chunk.length === 1 ) {
        let c = ''
        if ( key.shift ) {
          c = chunk.toUpperCase()
        } else {
          c = chunk
        }

        if ( c ) {
          const a = buffer.slice( 0, cursorPosition )
          const b = buffer.slice( cursorPosition )
          buffer = a.concat( c, b )

          cursorPosition++
          if ( cursorPosition > buffer.length ) {
            cursorPosition = buffer.length
          }
        }

        render()
      }
    }

    stdin.setEncoding( 'utf8' )
    stdin.on( 'keypress', handleKeypress )

    const clcBgGray = clc.bgXterm( 236 )
    const clcFgArrow = clc.xterm( 198 )
    const clcFgBufferArrow = clc.xterm( 110 )
    const clcFgGreen = clc.xterm( 143 )
    // const clcFgMatchGreen = clc.xterm( 151 )
    const clcFgModeStatus = clc.xterm( 110 )
    const clcFgMatchGreen = clc.xterm( 107 )

    // get matches based on the search mode
    function getMatches ( mode, filter, text )
    {
      switch ( mode.trim().toLowerCase() ) {
        case 'normal':
          return textMatches( filter, text )

        case 'fuzzy':
        default:
          // default to fuzzy matching
          return fuzzyMatches( filter, text )
      }
    }

    // get matched list based on the search mode
    function getList ( mode, filter, list )
    {
      // default to fuzzy matching
      switch ( mode.trim().toLowerCase() ) {
        case 'normal':
          return textList( filter, list )

        case 'fuzzy':
        default:
          // default to fuzzy matching
          return fuzzyList( filter, list )
      }
    }

    function fuzzyMatches ( fuzz, text )
    {
      fuzz = fuzz.toLowerCase()
      text = text.toLowerCase()

      let tp = 0 // text position/pointer
      let matches = []

      // nothing to match with
      if ( !fuzz ) return matches

      for ( let i = 0; i < fuzz.length; i++ ) {
        const f = fuzz[ i ]

        for ( ; tp < text.length; tp++ ) {
          const t = text[ tp ]
          if ( f === t ) {
            matches.push( tp )
            tp++
            break
          }
        }
      }

      return matches
    }

    function fuzzyList ( fuzz, list )
    {
      const results = []

      for ( let i = 0; i < list.length; i++ ) {
        const item = list[ i ]

        const originalIndex = item.originalIndex
        const originalValue = item.originalValue

        // get rid of unnecessary whitespace that only takes of
        // valuable scren space
        const normalizedItem = originalValue.split( /\s+/ ).join( ' ' )

        /* matches is an array of indexes on the normalizedItem string
         * that have matched the fuzz
         */
        const matches = fuzzyMatches( fuzz, normalizedItem )

        if ( matches.length === fuzz.length ) {
          /* When the matches.length is exacly the same as fuzz.length
           * it means we have a fuzzy match -> all characters in
           * the fuzz string have been found on the normalizedItem string.
           * The matches array holds each string index position
           * of those matches on the normalizedItem string.
           * ex. fuzz = 'foo', normalizedItem = 'far out dog', matches = [0,4,9]
           */

          let t = normalizedItem

          results.push( {
            originalIndex: originalIndex,
            originalValue: originalValue,
            matchedIndex: results.length,
            original: item,
            text: t // what shows up on terminal/screen
          } )
        }
      }

      return results
    }

    function textMatches ( filter, text )
    {
      filter = filter.toLowerCase() // ex. foo
      text = text.toLowerCase() // ex. dog food is geat

      let tp = 0 // text position/pointer
      let matches = []

      // nothing to match with
      if ( !filter ) return matches

      // source pointer ( first index of matched text )
      const sp = text.indexOf( filter )
      if ( sp >= 0 ) {
        // end pointer ( last index of matched text )
        const ep = sp + filter.length
        for ( let i = sp; i < ep; i++ ) {
          matches.push( i )
        }
      }

      return matches
    }

    function textList ( filter, list )
    {
      const results = []

      for ( let i = 0; i < list.length; i++ ) {
        const item = list[ i ]

        const originalIndex = item.originalIndex
        const originalValue = item.originalValue

        // get rid of unnecessary whitespace that only takes of
        // valuable scren space
        const normalizedItem = originalValue.split( /\s+/ ).join( ' ' )

        /* matches is an array of indexes on the normalizedItem string
         * that have matched the fuzz
         */
        const matches = textMatches( filter, normalizedItem )

        if ( matches.length === filter.length ) {
          /* When the matches.length is exacly the same as filter.length
           * it means we have a fuzzy match -> all characters in
           * the filter string have been found on the normalizedItem string.
           * The matches array holds each string index position
           * of those matches on the normalizedItem string.
           * ex. filter = 'foo', normalizedItem = 'dog food yum', matches = [4,5,6]
           */

          let t = normalizedItem

          results.push( {
            originalIndex: originalIndex,
            originalValue: originalValue,
            matchedIndex: results.length,
            original: item,
            text: t // what shows up on terminal/screen
          } )
        }
      }

      return results
    }

    function colorIndexesOnText ( indexes, text, clcColor )
    {
      const paintBucket = [] // characters to colorize at the end

      for ( let i = 0; i < indexes.length; i++ ) {
        const index = indexes[ i ]
        paintBucket.push( { index: index, clc: clcColor || clcFgMatchGreen } )
      }

      // copy match text colorize it based on the matches
      // this variable with the colorized ANSI text will be
      // returned at the end of the function
      let t = text

      // colorise in reverse because invisible ANSI color
      // characters increases string length
      paintBucket.sort( function ( a, b ) {
        return b.index - a.index
      } )

      for ( let i = 0; i < paintBucket.length; i++ ) {
        const paint = paintBucket[ i ]
        const index = Number( paint.index )

        // skip fuzzy chars that have shifted out of view
        if ( index < 0 ) continue
        if ( index > t.length ) continue

        const c = paint.clc( t[ index ] )
        t = t.slice( 0, index ) + c + t.slice( index + 1 )
      }

      // return the colorized match text
      return t
    }

    function trimOnIndexes ( indexes, text )
    {
      let t = text
      indexes = (
        indexes.map( function ( i ) { return Number( i ) } )
      )
      indexes.sort() // sort indexes

      // the last ( right-most ) index/character we want to be
      // visible on screen as centered as possible until there are
      // no more text to be shown to the right of it
      const lastIndex = indexes[ indexes.length - 1 ]

      const maxLen = getMaxWidth() - 2 // terminal width + padding

      /* we want to show the user the last characters that matches
       * as those are the most relevant
       * ( and ignore earlier matches if they go off-screen )
       *
       * use the marginRight to shift the matched text left until
       * the last characters that match are visible on the screen
       */
      const marginRight = Math.ceil( stdout.columns * 0.4 )

      // how wide the last index would be printed currently
      const lastMatchLength = stringWidth( t.slice( 0, lastIndex ) )

      // how much to shift left to get last index to get into
      // marginRight range (almost center)
      let shiftLeft = ( marginRight - lastMatchLength )

      // [1] but not too much if there is no additional text
      // const delta = ( stringWidth( t ) - lastMatchLength )
      // if ( Math.abs( shiftLeft ) > delta ) shiftLeft = -Math.floor( delta * .5 )

      let startIndex = 0
      let shiftAmount = 0

      if ( shiftLeft < 0 ) {
        // we need to shift left so that the matched text in view
        while ( shiftAmount > shiftLeft ) {
          startIndex++
          shiftAmount = -stringWidth( t.slice( 0, startIndex ) )
          if ( startIndex >= t.length ) {
            break // shouldn't happen because of [1]
          }
        }

        startIndex = startIndex + scrollOffset
        if ( startIndex < 0 ) {
          startIndex = 0
        }

        t = t.slice( startIndex )
      }

      // console.log( 't.length: ' + t.length )
      // console.log( 'shiftLeft: ' + shiftLeft )
      // console.log( 'shiftamount: ' + shiftAmount )
      // console.log( 'startindex: ' + startIndex )

      // normalize excessive lengths to avoid too much while looping
      // if ( t.length > ( maxLen * 2 + 20 ) ) t = t.slice( 0, maxLen * 2 + 20 )

      /* Cut off from the end of the (visual) line until
       * it fits on the terminal width screen.
       */
      const tlen = t.length
      let endIndex = t.length
      while ( stringWidth( t ) > maxLen ) {
        t = t.slice( 0, --endIndex )
        if ( t.length <= 0 ) break
      }

      if ( startIndex > 0 ) {
        t = '...' + t
      }

      if ( endIndex < tlen ) {
        t = t + '...'
      }

      return {
        text: t,
        startOffset: startIndex ? ( startIndex - '...'.length ) : startIndex
      }
    }

    function cleanDirtyScreen ()
    {
      const width = stdout.columns
      const writtenHeight = Math.max(
        MIN_HEIGHT,
        2 + _printedMatches
      )

      stdout.write( clc.move( -width ) )

      for ( let i = 0; i < writtenHeight; i++ ) {
        stdout.write( clc.erase.line )
        stdout.write( clc.move.down( 1 ) )
      }

      stdout.write( clc.move.up( writtenHeight ) )
    }

    function render ()
    {
      const width = stdout.columns || clc.windowSize.width
      const height = stdout.rows || clc.windowSize.height
      // console.log( 'window height: ' + height )
      // !debug && stdout.write( clc.erase.screen )
      // stdout.write( clc.move.to( 0, height ) )

      cleanDirtyScreen()

      // calculate matches
      _matches = [] // reset matches
      const words = buffer.split( /\s+/ ).filter( function ( word ) { return word.length > 0 } )
      for ( let i = 0; i < words.length; i++ ) {
        const word = words[ i ]
        let list = _list // fuzzy match against all items in list
        if ( i > 0 ) {
          // if we already have matches, fuzzy match against
          // those instead (combines the filters)
          list = _matches
        }
        const matches = getList( _opts.mode, word, list )
        _matches = matches
      }

      // special case no input ( show all with no matches )
      if ( words.length === 0 ) {
        const matches = getList( _opts.mode, '', _list )
        _matches = matches
      }

      if ( selectedIndex >= _matches.length ) {
        // max out at end of filtered/matched results
        selectedIndex = _matches.length - 1
      }

      if ( selectedIndex < 0 ) {
        // min out at beginning of filtered/matched results
        selectedIndex = 0
      }

      const inputLabel = _opts.label || clcFgBufferArrow( '> ' )
      const inputLabels = inputLabel.split( '\n' )
      const lastInputLabel = inputLabels[ inputLabels.length - 1 ]
      const inputLabelHeight = inputLabels.length - 1

      if ( render.init ) {
        stdout.write( clc.move.up( inputLabelHeight ) )
      } else {
        // get rid of dirt when being pushed above MIN_HEIGHT
        // from the bottom of the terminal
        cleanDirtyScreen()
      }
      render.init = true

      // print input label
      stdout.write( inputLabel )

      stdout.write( buffer )

      // do not print the list at all when `nolist` is set
      // this is used when we only care about the input query
      if ( !_opts.nolist ) {
        stdout.write( '\n' )

        /* Here we color the matched items text for terminal
        * printing based on what characters were found/matched.
        *
        * Since each filter is separated by space we first
        * combine all matches from all filters(words).
        *
        * If we want to only color based on the most recent
        * filter (last word) then just use the matches from the
        * last word.
        */
        for ( let i = 0; i < _matches.length; i++ ) {
          const match = _matches[ i ]

          const words = buffer.split( /\s+/ ).filter( function ( word ) { return word.length > 0 } )

          const indexMap = {} // as map to prevent duplicates indexes
          for ( let i = 0; i < words.length; i++ ) {
            const word = words[ i ]
            const matches = getMatches( _opts.mode, word, match.text )
            matches.forEach( function ( i ) {
              indexMap[ i ] = true
            } )
          }

          // trim and position text ( horizontally ) based on
          // last word/filter that matched ( most relevant )
          const lastWord = words[ words.length - 1 ] || ' '
          const lastIndexes = getMatches( _opts.mode, lastWord, match.text )
          const { text, startOffset } = trimOnIndexes( lastIndexes, match.text )
          match.text = text

          if ( words.length === 0 ) continue

          const indexes = (
            Object.keys( indexMap )
            .map( function ( i ) { return Number( i ) - startOffset } )
          )
          indexes.sort() // sort indexes

          // transform the text to a colorized version
          match.text = colorIndexesOnText( indexes, match.text /*, clcFgGreen */ )
        }

        // print matches length vs original list length
        const n = _matches.length
        stdout.write( '  ' )
        stdout.write( clcFgGreen( n + '/' + _list.length ) )

        // TODO print mode
        stdout.write( ' ' + clcFgModeStatus( _opts.mode + ' mode' ) )

        // show mode switch suggestion
        let suggestionColor = clc.blackBright
        if ( n === 0 || n === _opts.list.length ) {
          suggestionColor = clc.yellowBright
        }
        stdout.write( suggestionColor( ' ctrl-s to switch' ) )
        stdout.write( ' ' + clc.magenta( `[${ scrollOffset > 0 ? '+' : '' }${ scrollOffset }]` ) )

        stdout.write( '\n' )

        // select first item in list by default ( empty fuzzy search matches first
        // item.. )
        if ( !_selectedItem ) {
          _selectedItem = _matches[ 0 ]
        }

        // print the matches
        _printedMatches = 0

        // max lines to use for printing matched results
        const maxPrintedLines = Math.min( _matches.length, MIN_HEIGHT )

        let paddingBottom = 2 // 1 extra padding at the bottom when scrolling down
        if ( _matches.length <= MIN_HEIGHT ) {
          // no extra padding at the bottom since there is no room for it
          // - othewise first match is cut off and will not be visible
          paddingBottom = 1
        }

        // first matched result to print
        const startIndex = Math.max( 0, selectedIndex - maxPrintedLines + paddingBottom )

        // last matched result to print
        const endIndex = Math.min( maxPrintedLines + startIndex, _matches.length )

        // print matches
        for ( let i = startIndex; i < endIndex; i++ ) {
          _printedMatches++

          const match = _matches[ i ]

          const item = match.text

          const itemSelected = (
            ( selectedIndex === i )
          )

          if ( itemSelected ) {
            _selectedItem = match
            stdout.write( clcBgGray( clcFgArrow( '> ' ) ) )
            stdout.write( clcBgGray( item ) )
            stdout.write( '\n' )
          } else {
            stdout.write( clcBgGray( ' ' ) )
            stdout.write( ' ' )
            stdout.write( item )
            stdout.write( '\n' )
          }
        }

        // move back to cursor position after printing matches
        stdout.write( clc.move.up( 2 + _printedMatches ) )
      }

      if ( _printedMatches < 1 ) {
        // clear selected item when nothing matches
        _selectedItem = undefined
      }

      // if ( inputLabelHeight > 0 ) stdout.write( clc.move.up( inputLabelHeight ) )

      // reset cursor left position
      stdout.write( clc.move( -stdout.columns ) )

      const cursorOffset = stringWidth( buffer.slice( 0, cursorPosition ) )

      const cursorLeftPadding = stringWidth( lastInputLabel )

      // set cursor left position
      stdout.write( clc.move.right( cursorLeftPadding + cursorOffset ) )
    }

    stdin.setRawMode && stdin.setRawMode( true )
    stdin.resume()

    render()
  } )

  if ( !callback ) {
    return promise
  }

  return _opts
}

// quick debugging, only executes when run with `node main.js`
if ( require.main === module ) {
  ;( async function () {
    const r = await getInput( 'Name: ' )
    console.log( r.query )
  } )()
}
