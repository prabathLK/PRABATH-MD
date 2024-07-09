<div align=center>

# Spotifydl-Core

<img src="https://img.icons8.com/nolan/256/spotify.png" alt="Never gonna give up, never gonna let you down"/>

### A simple package to download music tracks from spotify 🎵
</div>

## Installation 

```sh
> npm i spotifydl-core
```

## Intialization 

You need to intialize the `Spotify` Class before acessing the methods inside it.

```js
const Spotify = require('spotifydl-core').default
//import Spotify from 'spotifydl-core'

const credentials = {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret'
}
const spotify = new Spotify(credentials)
```

## Methods 
> **NOTE: Only some methods are shown here. Checkout the [docs](https://alensaito1.github.io/spotifydl-core/) for a more in-depth documentation**

**Get Track ⏭️**
```JS
await spotify.getTrack(track_url) 

// For Example: track_url = 'https://open.spotify.com/track/1Ub6VfiTXgyV8HnsfzrZzC?si=4412ef4ebd8141ab'

// Input: url of the track, Type: string
```
**Download Track/Song ⬇️**
```JS
await spotify.downloadTrack(track_url, file_name)

// For Example: track_url = 'https://open.spotify.com/track/1Ub6VfiTXgyV8HnsfzrZzC?si=4412ef4ebd8141ab' & file_name = 'song.mp3'

// Input: url of the track and name of the filename, Both Type: string

// It'll return buffer (promise) if you don't provide any filename

```

**Get Artist 👩‍🎤🧑‍🎤**
```JS
await spotify.getArtist(artist_url)

// For Example: artist_url = 'https://open.spotify.com/artist/3B9O5mYYw89fFXkwKh7jCS'

// Input: url of the artist, Type: string
```

**Get Album 💽**
```JS
await spotify.getAlbum(album_url)

// For Example: album_url = 'https://open.spotify.com/album/3u3WsbVPLT0fXiClx9GYD9?si=pfGAdL3VRiid0M3Ln_0DNg'

// Input: url of the album, Type: string
```

**Get Playlist 🎧**

```JS
await spotify.getPlylist(playlist_url)

// Input: url of the playlist, Type: string
```

**Download an Entire playlist**

```JS
await spotify.downloadPlaylist(playlist_url)

//It'll return an array containing the Buffer of the songs in the playlist
```

## Usage Example
```JS
const fs = require('fs-extra') 
// Initialization and Authentication 
const Spotify = require('spotifydl-core').default // Import the library 
const spotify = new Spotify({ // Authentication
    clientId: 'acc6302297e040aeb6e4ac1fbdfd62c3', // <-- add your own clientId 
    clientSecret: '0e8439a1280a43aba9a5bc0a16f3f009', // <-- add your own clientSecret 
})
/* To learn more about clientId and Secret  , 
visit https://developer.spotify.com/documentation/general/guides/app-settings/ 
*/

// Declaring the respective url in 'links' object 
const links = {
    artist: 'https://open.spotify.com/artist/7ky9g1jEjCsjNjZbYuflUJ?si=2To3fmc-T9KuyyrQ-Qp5KQ', // Url of the artist you want to gather info about
    album: 'https://open.spotify.com/album/3u3WsbVPLT0fXiClx9GYD9?si=pfGAdL3VRiid0M3Ln_0DNg', // Url of the album you want to gather info about
    song: 'https://open.spotify.com/track/1Ub6VfiTXgyV8HnsfzrZzC?si=4412ef4ebd8141ab' // Url of the song you want to gather info about or download
};

// Engine 
(async () => {
    const data = await spotify.getTrack(links.song) // Waiting for the data 🥱
    console.log('Downloading: ', data.name, 'by:', data.artists.join(' ')) // Keep an eye on the progress
    const song = await spotify.downloadTrack(links.song) // Downloading goes brr brr 
    fs.writeFileSync('song.mp3', song) // Let's write the buffer to the woofer (i mean file, hehehe) 
})()

//spotify.verifyCredentials().then(() => Promise.all([spotify.getTrack(links.song), spotify.getAlbum(links.album), spotify.getArtistAlbums(links.artist)]).then(console.log))
```

# 🙇‍ Special Thanks

- Swapnil Soni: [Spotify-dl](https://github.com/SwapnilSoni1999/spotify-dl)
- Fent: [Ytdl-core](https://github.com/fent/node-ytdl-core)
