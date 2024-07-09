# youtubedl-core

A lightweight and easy-to-use library for downloading videos from YouTube, powered by YouTube-DL and developed by the Eternity Community.

## Installation

To install youtubedl-core, simply run the following command:

```
npm install youtubedl-core
```

## Usage

To download a video, import the youtubedl-core library and use the `download` function:

```js
const youtubedl = require('youtubedl-core');

youtubedl.download('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  .then(info => {
    console.log('Download complete');
  })
  .catch(err => {
    console.error(err);
  });
```

You can also pass options to the download function, such as specifying the video quality or format:

```js
const youtubedl = require('youtubedl-core');

const options = {
  quality: 'highest',
  format: 'mp4'
};

youtubedl.download('https://www.youtube.com/watch?v=dQw4w9WgXcQ', options)
  .then(info => {
    console.log('Download complete');
  })
  .catch(err => {
    console.error(err);
  });
```

  For more information on the available options, see the [YouTube-DL documentation](https://github.com/ytdl-org/youtube-dl#options).

 ## About Eternity Community
 youtubedl-core is developed by the Eternity Community, a group of developers dedicated to creating high-quality open source software. We believe that software should be accessible to everyone, and strive to make our projects as user-friendly and easy-to-use as possible.

If you're interested in contributing to youtubedl-core or any of our other projects, please visit our [GitHub organization](https://github.com/EternityBots) and check out the contribution guidelines. We welcome all contributions, big and small!

## Thanks To
* [`Alι Aryan`](https://github.com/AliAryanTech/)