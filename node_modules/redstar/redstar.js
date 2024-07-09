var fs = require( 'fs' )
var path = require( 'path' )
var minimatch = require( 'minimatch' )

function log () {
  // console.log.apply( this, arguments )
}

function glob ( pattern, opts, callback ) {
  var filesFound = {}
  var dirsFound = {}
  opts = opts || {}

  var errors = []
  var _dirsOnly = ( pattern[ pattern.length - 1 ] === path.sep )

  var dirPattern = pattern.slice( 0, pattern.lastIndexOf( path.sep ) )
  if ( dirPattern[ dirPattern.length - 1 ] !== path.sep ) dirPattern += path.sep

  log( 'dirPattern: ' + dirPattern )
  log( 'dirsOnly: ' + _dirsOnly )

  if ( typeof opts === 'function' ) {
    callback = opts
    opts = {}
  }

  var globstar = false

  if ( pattern.indexOf( '**' ) >= 0 ) globstar = true

  var ignoreList = ( opts.ignore || opts.ignored || [] )

  if ( !( ignoreList instanceof Array ) ) ignoreList = [ ignoreList ]

  if ( !opts.ignoreDefaults ) {
    // ignore node_modules
    ignoreList.push( '**/node_modules/**' )
    ignoreList.push( 'node_modules' )

    // ignore dotfiles
    ignoreList.push( '**/.*' )
    ignoreList.push( '.git' )
  }

  var MAX_DEPTH = ( opts.depth || 7 )

  var firstStarIndex = pattern.indexOf( '*' )

  var root = ( pattern.slice( 0, firstStarIndex ) || '.' )

  log( 'root: ' + root )

  // yolo into the disk
  yolo( root, 1, MAX_DEPTH )

  var callbacks = 1
  var callbacksFinished = 0

  var _timeout
  function finishCallback () {
    callbacksFinished++

    clearTimeout( _timeout )
    _timeout = setTimeout( function () {
      log( callbacks + ' /  ' + callbacksFinished )
      if ( callbacks === callbacksFinished ) {
        // we're done!
        var files = Object.keys( filesFound )
        var dirs = Object.keys( dirsFound )

        var err = null
        if ( errors.length > 0 ) {
          err = errors
          errors.forEach( function ( e ) {
            log( e )
          } )
        }

        log( 'finished! files found: ' + files.length )
        callback( err, files, dirs )
      }
    }, 1 )
  }

  function add () {
    callbacks++
  }

  function yolo ( dirpath, depth, MAX_DEPTH ) {
    if ( !MAX_DEPTH ) MAX_DEPTH = 6

    log( 'yoloing ' + depth + ' / ' + MAX_DEPTH )

    add()
    fs.readdir( dirpath, function ( err, files ) {
      finishCallback()

      if ( err ) {
        return errors.push( err )
      }

      files.forEach( function ( file ) {
        log( 'path: ' + file )
        var filepath = path.join( dirpath, file )
        file = filepath

        add()
        fs.stat( file, function ( err, stats ) {
          finishCallback()

          if ( err ) {
            return errors.push( { path: file, err: err } )
          }

          for ( var i = 0; i < ignoreList.length; i++ ) {
            var ignorePattern = ignoreList[ i ]
            var shouldIgnore = minimatch( file, ignorePattern )
            if ( shouldIgnore ) return
          }

          if ( stats.isDirectory() ) {
            log( 'dir: ' + file )

            var dir = file
            if ( dir[ dir.length - 1 ] !== path.sep ) dir += path.sep

            var matches = minimatch( dir, dirPattern )

            if ( matches ) {
              dirsFound[ file ] = file
              log( 'found dir match: ' + file )

              if ( _dirsOnly ) {
                filesFound[ file ] = file
              }
            }

            // TODO yolo level deeper
            if ( globstar ) {
              if ( depth < MAX_DEPTH ) {
                yolo( file, depth + 1 )
              } else {
                log( 'MAX_DEPTH reached: ' + depth + ' / ' + MAX_DEPTH )
              }
            }
          } else if ( stats.isFile() ) {
            if ( _dirsOnly ) return

            log( 'file: ' + file )

            var matches = minimatch( file, pattern )

            if ( matches ) {
              filesFound[ file ] = file
              log( 'found match: ' + file )
            }
          }
        } )
      } )
    } )
  }
}

glob.hasMagic = function ( pattern ) {
  return ( pattern.indexOf( '*' ) >= 0 )
}

module.exports = glob

// glob( 'test/tmp/**.css', function ( files ) {
//   console.log( files )
// } )
