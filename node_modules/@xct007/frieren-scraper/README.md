<div align="center">
  <img src="https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/nickelodeon-dora-the-explorer-swiper-no-swiping-fox-ivof-miaol.jpg"/>
</div>


Table of Contents
=================

  * [Target](#target)
  * [Progress](#progress)
  * [Usage](#usage)
    * [Installations](#installations)
    * [Example](#example-use)
      * [Downloader](#downloader)
      * [Anime/comic](#animecomic)
      * [Searching](#searching)
      * [Maker](#maker)
      * [Nsfw](#nsfw)
    * [Error handling](#error-handling)

## Target

You decide, you can open issues what website/app and data to be scrapped.

<details>
<summary>Website</summary>
  
- [x] Doujindesu
- [x] Otakudesu
- [x] Youtube
- [x] Anoboy
- [x] Komiku.id
- [x] Danbooru
- [x] Apkmody.io
- [x] PhotoFunia
- [ ] Hentai.tv
- [x] bokepsin
- [x] nhentai.to
- [x] xvideos.com
- [x] 9apps.com
- [x] hentaihaven.xxx

</details>

<details>
  <summary>App</summary>
  
- [x] [Status Video Wa Indonesia](https://play.google.com/store/apps/details?id=com.videostatus.indonesia)
- [x] [Unsplash](https://play.google.com/store/apps/details?id=com.aqteam.photofree)
- [x] [Downloader for tiktok](https://play.google.com/store/apps/details?id=com.downloaderfor.tiktok)
  - `App use rapid Api.`
- [x] [SuperDownloader](https://play.google.com/store/apps/details?id=com.music.downloader.downloadid)

</details>


## Progress

<details>
  <summary>Anime/comic</summary>
  
- [x] Doujindesu
  - [x] latest
  - [x] search
  - [x] detail
- [x] Otakudesu
  - [x] latest
  - [x] search
  - [x] detail
- [x] Anoboy
  - [x] latest
  - [x] search
  - [x] detail
- [x] Komiku.id
  - [x] latest
  - [x] search
  - [x] detail
- [ ] Hentai.tv
  - [ ] etc.
- [x] nhentai.to
  - [x] search
  - [x] detail

</details>

<details>
  <summary> Downloader </summary>
  
- [x] Youtube
  - [x] search
    - [x] videos
  - [x] dowload
- [x] Status Video Wa Indonesia
  - [x] popular
  - [x] search
- [x] Instagram
  - [x] [v1](https://downloadgram.org)
  - [x] [v2](https://indown.io)
- [x] Tiktok
  - [x] [v1](https://play.google.com/store/apps/details?id=com.downloaderfor.tiktok)
- [x] Facebook
  - [x] [v1](https://getmyfb.com)
- [ ] ZippyShare. [reference](https://github.com/superXdev/zippyshare-downloader)
  - [x] download
- [x] Pinterest
  - [x] [v1](https://pinterestvideo.com)

</details>

<details>
  <summary> Searching </summary>

- [x] Unsplash
  - [x] search
- [x] Danbooru
  - [x] search
- [x] Music
  - [x] search
- [x] Apkmody
  - [x] search
  - [x] detail
- [x] 9apps.com
  - [x] search
  - [x] detail

</details>

<details>
  <summary>Maker</summary>
  
- [x] PhotoFunia
  - [x] text
    - [x] 1 param.
    - [ ] 2 param
  - [x] image
    - [x] Buffer
- [x] Image Diffusion.
  - [x] stable
  - [ ] anime
- [x] h5.tu.qq.com
  - [x] From image url

</details>

<details>
  <summary> Nsfw</summary>

- [x] Bokepsin
  - [x] latest
  - [x] search
  - [x] detail
- [x] xvideos
  - [x] search
  - [x] detail
- [x] hentaihaven
  - [x] search
  - [x] detail

</details>


## Usage

#### Installations.

Using GitHub version to test latest fix/update.

```bash
npm install github:xct007/frieren-scraper
```

### Notice.

Package name changed to `@xct007/frieren-scraper`

## Example use

### Downloader

#### Youtube

```js
import { youtube } from "@xct007/frieren-scraper";

// searching videos
const ArrObj = await youtube.search("rose gone mv");
console.log(ArrObj);

// fetch download url;
const Obj = await youtube.download("https://www.youtube.com/watch?v=xxx");
console.log(Obj);
```

#### Tiktok

```js
import { tiktok } from "@xct007/frieren-scraper";

// v1. fetch detail/download url
const Obj = await tiktok.v1("https://TIKTOK_URL");
console.log(Obj);

// others version will added soon.
```

#### Instagram

```js
import { instagram } from "@xct007/frieren-scraper";

// fetch direct download url
const Obj = await instagram.download("https://instagram_URL");
console.log(Obj);
```

#### Facebook.

```js
import { facebook } from "@xct007/frieren-scraper";

// v1. fetch direct download url
const Obj = await facebook.v1("https://FACEBOOK_URL");
console.log(Obj);

// others version will added soon.
```

#### Story WhatsApp Videos.

```js
import { storyWa } from "@xct007/frieren-scraper";

// fetch popular videos
const ArrObj = await storyWa.popular();
console.log(ArrObj);

// search videos by query
const ArrObj = await storyWa.search("query");
console.log(ArrObj);
```

#### ZippyShare. (Not working)

```js
import { zippyshare } from "@xct007/frieren-scraper";

// fetch direct download url
const Obj = await zippyshare.download("https://ZIPPYSHARE_URL");
console.log(Obj);
```

#### Pinterest.

```js
import { pinterest } from "@xct007/frieren-scraper";

// v1. fetch direct download url
const Obj = await pinterest.v1("https://PINTEREST_URL");
console.log(Obj);

// others version will added soon.
```

### Anime/comic.

#### Komiku.id.

```js
import { komikuId } from "@xct007/frieren-scraper";

// fetch latest comic
const ArrObj = await komikuId.latest();
console.log(ArrObj);

// search comic by query
const ArrObj = await komikuId.search("query");
console.log(ArrObj);

// fetch comic/chapter detail by url.
const Obj = await komikuId.detail("https://KOMIKUID_URL");
console.log(Obj);
```

#### Otakudesu.

```js
import { otakudesu } from "@xct007/frieren-scraper";

// fetch latest anime
const ArrObj = await otakudesu.latest();
console.log(ArrObj);

// search anime by query
const ArrObj = await otakudesu.search("query");
console.log(ArrObj);

// fetch anime detail by url
const Obj = await otakudesu.detail("https://OTAKUDESU_URL");
console.log(Obj);
```

#### Anoboy.

```js
import { anoboy } from "@xct007/frieren-scraper";

// fetch latest anime
const ArrObj = await anoboy.latest();
console.log(ArrObj);

// search anime by query
const ArrObj = await anoboy.search("query");
console.log(ArrObj);

// fetch anime detail by url
const Obj = await anoboy.search("https://ANOBOY_URL");
console.log(Obj);
```

#### Doujindesu.

```js
import { doujindesu } from "@xct007/frieren-scraper";

// fetch latest doujin
const ArrObj = await doujindesu.latest();
console.log(ArrObj);

// search doujin by query
const ArrObj = await doujindesu.search("query");
console.log(ArrObj);

// fetch doujin detail by url
const Obj = await doujindesu.detail("https://DOUJINDESU_URL");
console.log(Obj);
```

### Searching

#### Unsplash.

```js
import { unsplash } from "@xct007/frieren-scraper";

// Search images by query
const ArrObj = await unsplash.search("query");
console.log(ArrObj);
```

#### Danbooru.

```js
import { danbooru } from "@xct007/frieren-scraper";

// Search images by query
const ArrObj = await danbooru.search("query");
console.log(ArrObj);
```

#### Music.

```js
import { music } from "@xct007/frieren-scraper";

// Search music and audio url by query.
// more short query, more results found.
const ArrObj = await music.search("query");
console.log(ArrObj);
```

#### Apkmody.

```js
import { apkmody } from "@xct007/frieren-scraper";

// search apps/games
const ArrObj = await apkmody.search("query");
console.log(ArrObj);

// fetch direct download url
// High memory usage. LOL
const Obj = await apkmody.download("https://APKMODY_URL");
console.log(Obj);
```

#### 9Apps.

```js
import { nineApps } from "@xct007/frieren-scraper";

// search apps/games
const ArrObj = await nineApps.search("query");
console.log(ArrObj);

// fetch detail/direct download url
const Obj = await nineApps.download("https://9apps.com/...");
console.log(Obj);
```

### Maker.

#### PhotoFunia.

```js
import { photofunia } from "@xct007/frieren-scraper";

// get list all effects key.
const ArrObj = await photofunia.listEffects();
console.log(ArrObj);

// Generate text on image by key
const key = "balloon".
const Obj = await photofunia.create(key, {
  type: "text", // pass type as text.
  input: "Text should generate"
});
console.log(Obj);

// Image filter
const key = "the-frame".
const Obj = await photofunia.create(key, {
  type: "image", // pass type as image.
  // input only accept Buffer
  input: fs.readFileSync("./path_image.jpg") // LOL af
});
console.log(Obj);
```

#### Image Diffusion.

```js
import { diffusion } from "@xct007/frieren-scraper";
import { writeFileSync } from "fs";

// stable diffusion.
const prompt = "1girl, blush, looking to viewer, warm smile,";
const seed = 123456789; // (optional). default random.

const Obj = await diffusion.stable(prompt, seed);
console.log(Obj);
/*
  {
    process_time: Number,
    seed: "String",
    ext: "String",
    mimetype: "String",
    base64Img: "String" // encodedBase64
  }
*/

// example save to disk
const saveFilename = `./image.${Obj.ext}`;

const buffer = Buffer.from(Obj.base64Img, "base64");

writeFileSync(saveFilename, buffer);

// Anime diffusion will be added
// if this repo star reach >= 50.
```

### Nsfw

#### Bokepsin

```js
import { bokepsin } from "@xct007/frieren-scraper";

// Get latest
const ArrObj = await bokepsin.latest();
console.log(ArrObj);

// search
const ArrObj = await bokepsin.search("query");
console.log(ArrObj);

// detail
const Obj = await bokepsin.latest("URL");
console.log(ArrObj);
```

#### Nhentai

```js
import { nhentai } from "@xct007/frieren-scraper";

// thumbnail/images url cannot be fetched

// search
const ArrObj = await nhentai.search("write your dream word");
console.log(ArrObj);

// detail
const id = 123456
const ArrObj = await nhentai.detail(id);
console.log(ArrObj);

```

#### Xvideos

```js
import { xvideos } from "@xct007/frieren-scraper";

// search
const ArrObj = await xvideos.search("mom");
console.log(ArrObj);

// detail
const url = "https://xvideos..."
const ArrObj = await xvideos.detail(url);
console.log(ArrObj);

```

#### HentaiHaven

```js
import { hentaiHaven } from "@xct007/frieren-scraper";

// search
const ArrObj = await hentaiHaven.search("your mum");
console.log(ArrObj);

// detail
const Obj = await hentaiHaven.detail("https://hentaihaven/your_mum");
console.log(Obj);

```

### Error Handling

There is probably no need to use statement try/catch, it is already handle.

```js
import { youtube } from "@xct007/frieren-scraper";

youtube.download("YOUTUBE_URL").then((Obj) => {
  if (Obj.error) {
    // Error
    console.log(Obj.);
    /*
      {
        "error": true,
        "message": ""
      }
    */
  } else {
    // ...Your code
    console.log(Obj);
  }
});

// Promise
const Obj = await youtube.download("YOUTUBE_URL");

if (Obj.error) {
  // Error
  console.log(Obj);
  /*
    {
      "error": true,
      "message": ""
    }
  */
} else {
  // ...Your code.
  console.log(Obj);
}
```

### Note.

This repository project is a learning exercise, and as such it utilizes references from other open source repositories. No commercial use is intended, and all efforts have been made to ensure proper attribution has been given to any referenced libraries and code.
