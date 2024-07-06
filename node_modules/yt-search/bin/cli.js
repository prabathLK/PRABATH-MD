#!/usr/bin/env node

var fs = require( 'fs' )
var path = require( 'path' )

var ytSearch = require(
  path.join( __dirname, '../dist/yt-search.js' )
)

var argv = require( 'minimist' )( process.argv.slice( 2 ) )

var pjson = require( path.join( __dirname, '../package.json' ) )

if ( argv.v || argv.V || argv.version ) {
  console.log( pjson.name + ': ' + pjson.version )
  process.exit()
}

var query = argv._.join( ' ' )

if ( !query ) {
  console.log( 'No search query given. Exiting.' )
  return process.exit( 1 )
}

ytSearch(
  query,
  function ( err, r ) {
    if ( err ) throw err

    var list = []
    var videos = r.videos

    for ( var i = 0; i < videos.length; i++ ) {
      var song = videos[ i ]
      // console.log( song.title + ' : ' + song.duration )

      var title = song.title

      var text = (
        title +
        ' ($t)'.replace( '$t', song.timestamp ) +
        ' | ' + song.videoId + ' | ' + song.views
      )

      list.push( text )
    }

    var nfzf = require( 'node-fzf' )
    nfzf( list, function ( r ) {
      if ( !r.selected ) {
        process.exit( 1 )
      }

      // console.log( r.selected.value )

      const video = videos[ r.selected.index ]

      if ( argv[ 'v' ] || argv[ '--id' ] ) {
        console.log( video.videoId )
      } else {
        console.log( video.url )
      }

      process.exit()
    } )
  }
)
