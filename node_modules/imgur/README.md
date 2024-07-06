<h1 align="center" style="border-bottom: none;">imgur</h1>
<h3 align="center">Unofficial JavaScript library for the Imgur.com API</h3>
<p align="center">
  <a href="https://www.npmjs.com/package/imgur">
    <img alt="npm version" src="https://img.shields.io/npm/v/imgur/latest.svg">
  </a>
  <a href="https://github.com/keneucker/imgur/actions?query=workflow%3ATests+branch%3Amain">
    <img alt="Build states" src="https://github.com/keneucker/imgur/workflows/Tests/badge.svg">
  </a>
</p>
<p align="center">
  <a href="https://github.com/keneucker/imgur/discussions">
    <img alt="Join the community on GitHub Discussions" src="https://img.shields.io/badge/Join%20the%20community-on%20GitHub%20Discussions-blue">
  </a>
</p>

## Installation

```shell
npm install imgur
```

## Usage

### Migrating to version 2

Version 2 of the imgur api drops automatic support for filesystem usage. For uploading files from a filesystem, please see the examples using `createReadStream`.

### Import and instantiate with credentials:

```ts
// ESModule syntax
import { ImgurClient } from 'imgur';

// CommonJS syntax
const { ImgurClient } = require('imgur');

// browser script include
const client = new imgur({ clientId: env.CLIENT_ID });

// if you already have an access token acquired
const client = new ImgurClient({ accessToken: process.env.ACCESS_TOKEN });

// or your client ID
const client = new ImgurClient({ clientId: process.env.CLIENT_ID });

// all credentials with a refresh token, in order to get access tokens automatically
const client = new ImgurClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
});
```

If you don't have any credentials, you'll need to:

1. [Create an Imgur account](https://imgur.com/register)
1. [Register an application](https://api.imgur.com/#registerapp)

### **⚠️ For brevity, the rest of the examples will leave out the import and/or instantiation step.**

### Upload one or more images and videos

```ts
// upload multiple images via fs.createReadStream (node)
const response = await client.upload({
  image: createReadStream('/home/kai/dank-meme.jpg'),
  type: 'stream',
});
console.log(response.data);
```

If you want to provide metadata, such as a title, description, etc., then pass an object instead of a string:

```ts
// upload image via url
const response = await client.upload({
  image: 'https://i.imgur.com/someImageHash',
  title: 'Meme',
  description: 'Dank Meme',
});
console.log(response.data);
```

Acceptable key/values match what [the Imgur API expects](https://apidocs.imgur.com/#c85c9dfc-7487-4de2-9ecd-66f727cf3139):

| Key             | Description                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `image`         | A string, stream, or buffer that is a URL pointing to a remote image or video (up to 10MB)                                          |
| `album`         | The id of the album you want to add the media to. For anonymous albums, album should be the deletehash that is returned at creation |
| `type`          | The type of the media that's being transmitted; `stream`, `base64` or `url`                                                         |
| `name`          | The name of the media. This is automatically detected, but you can override                                                         |
| `title`         | The title of the media                                                                                                              |
| `description`   | The description of the media                                                                                                        |
| `disable_audio` | `1` will remove the audio track from a video file                                                                                   |

### Upload and track progress of uploads

Instances of `ImgurClient` emit `uploadProgress` events so that you can track progress with event listeners.

```ts
const client = new ImgurClient({ accessToken: process.env.ACCESS_TOKEN });

client.on('uploadProgress', (progress) => console.log(progress));
await client.upload('/home/kai/cat.mp4');
```

The progress object looks like the following:

```ts
{
  percent: 1,
  transferred: 577,
  total: 577,
  id: '/home/user/trailer.mp4'
}
```

| Key           | Description                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `percent`     | 0 to 1, measures the percentage of upload (e.g., 0, 0.5, 0.8, 1). Basically `transferred / total` |
| `transferred` | total number of bytes transferred thus far                                                        |
| `total`       | total number of bytes to be transferred                                                           |
| `id`          | unique id for the media being transferred; useful when uploading multiple things concurrently     |

### Delete an image

Requires an image hash or delete hash, which are obtained in an image upload response

```ts
client.deleteImage('someImageHash');
```

### Update image information

Update the title and/or description of an image

```ts
client.updateImage({
  imageHash: 'someImageHash',
  title: 'A new title',
  description: 'A new description',
});
```

Update multiple images at once:

```ts
client.updateImage({
  imageHash: 'someImageHash',
  title: 'A new title',
  description: 'A new description',
});
```

Favorite an image:

```ts
client.favoriteImage('someImageHash');
```

### Get gallery images

```ts
client.getGallery({
  section: 'hot',
  sort: 'viral',
  mature: false,
});
```

`getGallery()` accepts an object of type `GalleryOptions`. The follow options are available:

| Key              | Required | Description                                                                                                                                                                                                              |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `section`        | required | `hot` \| `top` \| `user`                                                                                                                                                                                                 |
| `sort`           | optional | `viral` \| `top` \| `time` \| `rising` (only available with user section). Defaults to viral                                                                                                                             |
| `page`           | optional | `number` - the data paging number                                                                                                                                                                                        |
| `window`         | optional | Change the date range of the request if the section is `top`. Accepted values are `day` \| `week` \| `month` \| `year` \| `all`. Defaults to `day`                                                                       |
| `showViral`      | optional | `true` \| `false` - Show or hide viral images from the `user` section. Defaults to `true`                                                                                                                                |
| `mature`         | optional | `true` \| `false` - Show or hide mature (nsfw) images in the response section. Defaults to `false`. NOTE: This parameter is only required if un-authed. The response for authed users will respect their account setting |
| `album_previews` | optional | `true` \| `false` - Include image metadata for gallery posts which are albums                                                                                                                                            |

### Get subreddit gallery images

```ts
client.getSubredditGallery({
  subreddit: 'wallstreetbets',
  sort: 'time',
});
```

`getSubredditGallery()` accepts an object of type `SubredditGalleryOptions`. The follow options are available:

| Key         | Required | Description                                                                                                                                         |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `subreddit` | required | A valid subreddit name                                                                                                                              |
| `sort`      | optional | `time` \| `top` - defaults to time                                                                                                                  |
| `page`      | optional | `number` - the data paging number                                                                                                                   |
| `window`    | optional | Change the date range of the request if the section is `top`. Accepted values are `day` \| `week` \| `month` \| `year` \| `all`. Defaults to `week` |

### Search the gallery

```ts
client.searchGallery({
  query: 'title: memes',
});
```

`searchGallery()` accepts an object of type `SearchGalleryOptions`. The follow options are available:

| Key            | Required | Description                                                           |
| -------------- | -------- | --------------------------------------------------------------------- | ------ | ------- | ------ | ------------------------- |
| `query` or `q` | required | Query string                                                          |
| `sort`         | optional | `time` \| `viral` \| `top` - defaults to time                         |
| `page`         | optional | `number` - the data paging number                                     |
| `window`       | optional | Change the date range of the request if the sort is `top` -- to `day` | `week` | `month` | `year` | `all`, defaults to `all`. |

Additionally, the following advanced search query options can be set (NOTE: if any of the below are set in the options, the `query` option is ignored and these will take precedent):

| Key         | Required | Description                                                                                                                                                                                                        |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q_all`     | optional | Search for all of these words (and)                                                                                                                                                                                |
| `q_any`     | optional | Search for any of these words (or)                                                                                                                                                                                 |
| `q_exactly` | optional | Search for exactly this word or phrase                                                                                                                                                                             |
| `q_not`     | optional | Exclude results matching this string                                                                                                                                                                               |
| `q_type`    | optional | Show results for any file type, `jpg` \| `png` \| `gif` \| `anigif` (animated gif) \| `album`                                                                                                                      |
| `q_size_px` | optional | Size ranges, `small` (500 pixels square or less) \| `med` (500 to 2,000 pixels square) \| `big` (2,000 to 5,000 pixels square) \| `lrg` (5,000 to 10,000 pixels square) \| `huge` (10,000 square pixels and above) |

### Get album info

```ts
const album = await client.getAlbum('XtMnA');
```
