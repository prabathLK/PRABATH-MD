# ytdl-mp3

An NPM package to facilitate downloading music from YouTube, including automatic retrieval of ID3 tags and album art via the iTunes public API.

## Installation

```shell
npm install -g ytdl-mp3
```

## Usage

### Command-Line

The easiest way to use ytdl-mp3 is through the command-line interface. Users must enter the URL of the YouTube video they wish to download. The title of the music video is then used to automatically retrieve ID3 tags (e.g., title, artist) and the associated cover art from iTunes. There is no need for the title of the YouTube video to follow a specific naming convention.

```
Usage: ytdl-mp3 [options] <url>

A NodeJS package and command-line tool for downloading music from YouTube, including automatic retrieval of ID3 tags and album art via iTunes.

Arguments:
url                     url of video to download

Options:
-V, --version           output the version number
-o --output-dir <path>  path to output directory
-n --no-get-tags        skip extracting/applying id3 tags
-v --verify-tags        verify id3 tags fetched from itunes
-h, --help              display help for command
```

### ESM

```javascript
import { Downloader } from 'ytdl-mp3';

const downloader = new Downloader({
  getTags: true,
});

await downloader.downloadSong('https://www.youtube.com/watch?v=7jgnv0xCv-k');
```

### CommonJS

```javascript
const { Downloader } = require('ytdl-mp3');

async function main() {
  const downloader = new Downloader({
    getTags: true,
  });
  await downloader.downloadSong('https://www.youtube.com/watch?v=7jgnv0xCv-k');
}

main();
```
