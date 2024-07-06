# Scraper Module

This module provides a collection of functions for various scraping tasks. You can use these functions to download content from different sources, search for specific information, stalk user profiles, utilize artificial intelligence models, fetch random images, convert text to images or GIFs, and perform various image manipulation tasks. Below is an overview of the available functions.

## Installation

You can install this module via npm or yarn:

### npm
```bash
npm i @danitech/scraper
```

### yarn
```bash
yarn add @danitech/scraper
```

## Usage

### CommonJs (CJS) Sintax

To use this module with CommonJS syntax, you can import the entire module or specific functions like this:

```javascript
// Import the entire module
const scraper = require('@danitech/scraper');
```

### ECMAScript Modules (ESM) Syntax

To use this module with ESM syntax, you can import the entire module or specific functions like this:

```javascript
// Import the entire module
import * as scraper from '@danitech/scraper';
```

### Displays all function list

```javascript
const data = scraper;
console.log(data);
```

### Example: YouTube video downloader

```javascript
scraper.downloader.youtube_video('https://youtu.be/rKt_RuVmBkA')
  .then(response => {
    if (!response.ok) {
      throw new Error("Request failed!");
    }
    return response.json();
  })
  .then(data => {
    if (!data) {
      return console.log({
        status: "Error",
        code: 404,
        message: "Data not found!"
      });
    } else {
      return console.log({
        status: "Success",
        code: 200,
        author: 'Dani Techno.',
        data: data.data
      });
    }
  })
  .catch(error => {
    console.log(error);
    return console.log({
      error: "An error occurred."
    });
  }
);
```

### Result

```bash
{
  status: 'Success',
  code: 200,
  author: 'Dani Techno.',
  data: {
    title: 'How to build a REST API using Node.js + Express.js - Dani Tech.',
    thumbnail: 'https://i.ytimg.com/vi/rKt_RuVmBkA/maxresdefault.jpg',
    duration: '00:18:43',
    vid_360p: 'https://rr2---sn-gjo-w43l.googlevideo.com/videoplayback?expire=1694857292&ei=7CMFZdWVKO2N_9EP5KSY0Aw&ip=91.240.71.162&id=o-ACuVhFZ19ZkCKIrgScTFxqZEtuThUoZoYFWBpl9azTdo&itag=22&source=youtube&requiressl=yes&mh=Mk&mm=31%2C29&mn=sn-gjo-w43l%2Csn-ab5sznzd&ms=au%2Crdu&mv=u&mvi=2&pl=24&spc=UWF9f9yQuPWJNYrn3r9gtOyYCTtwHTk&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=1123.242&lmt=1685400278204618&mt=1694833858&fvip=4&fexp=24007246&c=ANDROID&txp=6218224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgfqW3Ix5EMAglkvilLahNP1Na4t52mKloaqUPm2MmTgYCIHtBAY9pCEDZvMm8_EGIqvkkIOskDxB27_qI2FCTmnII&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl&lsig=AG3C_xAwRQIhAONgo2riuCtP9ZfZb4h2_HDFoDwYjz0j95kxFwRPQwtRAiAoSzGFQq-ld1II7Use33D57u3PZIAbbejZIrjzCrnC2w%3D%3D&title=How+to+build+a+REST+API+using+Node.js+++Express.js+-+Dani+Tech.',
    vid_720p: 'https://rr2---sn-gjo-w43l.googlevideo.com/videoplayback?expire=1694857292&ei=7CMFZdWVKO2N_9EP5KSY0Aw&ip=91.240.71.162&id=o-ACuVhFZ19ZkCKIrgScTFxqZEtuThUoZoYFWBpl9azTdo&itag=18&source=youtube&requiressl=yes&mh=Mk&mm=31%2C29&mn=sn-gjo-w43l%2Csn-ab5sznzd&ms=au%2Crdu&mv=u&mvi=2&pl=24&spc=UWF9f9yQuPWJNYrn3r9gtOyYCTtwHTk&vprv=1&svpuc=1&mime=video%2Fmp4&gir=yes&clen=39898381&ratebypass=yes&dur=1123.242&lmt=1685399563608355&mt=1694833858&fvip=4&fexp=24007246&c=ANDROID&txp=6219224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgQVOUxQJ8sLAoPtAp-MIHBLb0RLaslIALxkCjRYKXcngCIBjwdUvDBX55iz0bA48PjvmVNDTQHDRO0tRYFwl8tWbS&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl&lsig=AG3C_xAwRQIhAONgo2riuCtP9ZfZb4h2_HDFoDwYjz0j95kxFwRPQwtRAiAoSzGFQq-ld1II7Use33D57u3PZIAbbejZIrjzCrnC2w%3D%3D&title=How+to+build+a+REST+API+using+Node.js+++Express.js+-+Dani+Tech.'
  }
}
```

### Example: Base64 Encode

```javascript
const base64Encode = (text) => {
  return scraper.tools.base64_encode(text);
};

console.log('Result: ', base64Encode('Dani'));
```

### Result

```bash
Result:  RGFuaQ==
```

### Example: Base64 Decode

```javascript
const base64Decode = (text) => {
  return scraper.tools.base64_decode(text);
};

console.log('Result: ', base64Decode('RGFuaQ=='));
```

### Result

```bash
Result:  Dani
```

## List of usable functions

### Downloader Functions

- `downloader.youtube_video`: Download YouTube videos.
- `downloader.facebook`: Download content from Facebook.
- `downloader.twitter`: Download content from Twitter.
- `downloader.instagram`: Download content from Instagram.
- `downloader.tiktok`: Download TikTok videos.
- `downloader.tiktok_v2`: Download TikTok videos using v2 API.
- `downloader.google_drive`: Download content from Google Drive.

### Searcher Functions

- `searcher.lyrics`: Search for song lyrics.
- `searcher.soundcloud`: Search for content on SoundCloud.
- `searcher.emoji`: Search for emojis.
- `searcher.stackoverflow`: Search for information on Stack Overflow.

### Stalker Functions

- `stalker.tiktok`: Stalk TikTok user profiles.
- `stalker.github_user`: Stalk GitHub user profiles.
- `stalker.github_repo`: Stalk GitHub repositories.
- `stalker.github_show_all_repo`: Stalk all repositories of a GitHub user.
- `stalker.npmjs_package`: Stalk NPM packages.
- `stalker.ip`: Stalk IP addresses.

### Artificial Intelligence Functions

- `artificial_intelligence.chatgpt_3`: Utilize OpenAI's ChatGPT-3 model.
- `artificial_intelligence.chatgpt_35`: Utilize OpenAI's ChatGPT-3.5 model.
- `artificial_intelligence.chatty_ai`: Use the Chatty AI model.
- `artificial_intelligence.bard`: Use Google's Bard AI model.
- `artificial_intelligence.midjourney`: Use the MidJourney AI model.
- `artificial_intelligence.anime_filter`: Apply an anime filter to images.

### Random Image Functions

#### Anime SFW

This section contains various functions to fetch safe-for-work (SFW) anime images. You can use these functions to retrieve anime images suitable for all audiences. Below is a list of available functions:

- `random_image_anime_sfw.akira`: Get an image of the character Akira from an anime.
- `random_image_anime_sfw.asuna`: Fetch an image of the character Asuna from an anime.
- `random_image_anime_sfw.ana`: Retrieve an image of the character Ana from an anime.
- `random_image_anime_sfw.ayuzawa`: Fetch an image of the character Ayuzawa from an anime.
- `random_image_anime_sfw.boruto`: Retrieve an image of the character Boruto from an anime.
- `random_image_anime_sfw.chitanda`: Get an image of the character Chitanda from an anime.
- `random_image_anime_sfw.chitoge`: Fetch an image of the character Chitoge from an anime.
- `random_image_anime_sfw.cosplay`: Retrieve a random anime cosplay image.
- `random_image_anime_sfw.deidara`: Get an image of the character Deidara from an anime.
- `random_image_anime_sfw.doraemon`: Fetch an image of Doraemon, a popular anime character.
- `random_image_anime_sfw.elaina`: Retrieve an image of the character Elaina from an anime.
- `random_image_anime_sfw.emilia`: Get an image of the character Emilia from an anime.
- `random_image_anime_sfw.erza`: Fetch an image of the character Erza from an anime.
- `random_image_anime_sfw.fanart`: Retrieve a fanart image from the anime world.
- `random_image_anime_sfw.genshin`: Get an image related to the Genshin Impact game.
- `random_image_anime_sfw.gremory`: Fetch an image of the character Gremory from an anime.
- `random_image_anime_sfw.hestia`: Retrieve an image of the character Hestia from an anime.
- `random_image_anime_sfw.hinata`: Get an image of the character Hinata from an anime.
- `random_image_anime_sfw.husbu`: Fetch an image of your favorite anime husbando.
- `random_image_anime_sfw.waifu`: Get an image of your beloved anime waifu.
- `random_image_anime_sfw.icon`: Fetch an anime icon image.
- `random_image_anime_sfw.inori`: Get an image of the character Inori from an anime.
- `random_image_anime_sfw.isuzu`: Retrieve an image of the character Isuzu from an anime.
- `random_image_anime_sfw.itachi`: Get an image of the character Itachi from an anime.
- `random_image_anime_sfw.itori`: Fetch an image of the character Itori from an anime.
- `random_image_anime_sfw.kaga`: Retrieve an image of the character Kaga from an anime.
- `random_image_anime_sfw.kagura`: Get an image of the character Kagura from an anime.
- `random_image_anime_sfw.kaguya`: Fetch an image of the character Kaguya from an anime.
- `random_image_anime_sfw.kakasih`: Retrieve an image of the character Kakashi from an anime.
- `random_image_anime_sfw.kaneki`: Get an image of the character Kaneki from an anime.
- `random_image_anime_sfw.kaori`: Fetch an image of the character Kaori from an anime.
- `random_image_anime_sfw.keneki`: Retrieve an image of the character Keneki from an anime.
- `random_image_anime_sfw.kosaki`: Get an image of the character Kosaki from an anime.
- `random_image_anime_sfw.kotori`: Fetch an image of the character Kotori from an anime.
- `random_image_anime_sfw.kuriyama`: Retrieve an image of the character Kuriyama from an anime.
- `random_image_anime_sfw.kuroha`: Get an image of the character Kuroha from an anime.
- `random_image_anime_sfw.kurumi`: Fetch an image of the character Kurumi from an anime.
- `random_image_anime_sfw.loli`: Retrieve an image of a cute loli from an anime.
- `random_image_anime_sfw.madara`: Get an image of the character Madara from an anime.
- `random_image_anime_sfw.menus`: Fetch anime-related menus or food images.
- `random_image_anime_sfw.mikasa`: Retrieve an image of the character Mikasa from an anime.
- `random_image_anime_sfw.miku`: Get an image of the character Miku from an anime.
- `random_image_anime_sfw.minato`: Fetch an image of the character Minato from an anime.
- `random_image_anime_sfw.naruto`: Get an image of the character Naruto from an anime.
- `random_image_anime_sfw.natsukawa`: Retrieve an image related to Natsukawa from an anime.
- `random_image_anime_sfw.neko`: Get an image of adorable anime nekos.
- `random_image_anime_sfw.nekonime`: Fetch an image related to Nekonime anime.
- `random_image_anime_sfw.nezuko`: Retrieve an image of the character Nezuko from an anime.
- `random_image_anime_sfw.nishimiya`: Get an image of the character Nishimiya from an anime.
- `random_image_anime_sfw.onepiece`: Fetch an image related to the One Piece anime.
- `random_image_anime_sfw.pokemon`: Get an image related to the Pokémon world.
- `random_image_anime_sfw.rem`: Retrieve an image of the character Rem from an anime.
- `random_image_anime_sfw.rize`: Get an image of the character Rize from an anime.
- `random_image_anime_sfw.sagiri`: Fetch an image of the character Sagiri from an anime.
- `random_image_anime_sfw.sakura`: Retrieve an image of the character Sakura from an anime.
- `random_image_anime_sfw.sasuke`: Get an image of the character Sasuke from an anime.
- `random_image_anime_sfw.shina`: Fetch an image of the character Shina from an anime.
- `random_image_anime_sfw.shinka`: Retrieve an image of the character Shinka from an anime.
- `random_image_anime_sfw.shizuka`: Get an image of the character Shizuka from an anime.
- `random_image_anime_sfw.shota`: Fetch an image of adorable anime shotas.
- `random_image_anime_sfw.simp`: Get an image related to anime simp culture.
- `random_image_anime_sfw.tomori`: Retrieve an image of the character Tomori from an anime.
- `random_image_anime_sfw.toukachan`: Get an image of Toukachan from an anime.
- `random_image_anime_sfw.tsunade`: Fetch an image of the character Tsunade from an anime.
- `random_image_anime_sfw.yatogami`: Retrieve an image of the character Yatogami from an anime.
- `random_image_anime_sfw.yuki`: Get an image of the character Yuki from an anime.

#### Anime NSFW

This section contains functions to fetch not-safe-for-work (NSFW) anime images. Please note that the content retrieved using these functions may not be suitable for all audiences, and it's essential to use them responsibly and in appropriate contexts. Below is a list of available functions:

- `random_image_anime_nsfw.ahegao`: Get an NSFW image with the "ahegao" expression.
- `random_image_anime_nsfw.ass`: Fetch an NSFW image featuring anime characters' posterior.
- `random_image_anime_nsfw.bdsm`: Retrieve an NSFW image with BDSM themes.
- `random_image_anime_nsfw.blowjob`: Get an NSFW image featuring a blowjob scene.
- `random_image_anime_nsfw.cuckold`: Fetch an NSFW image with cuckold themes.
- `random_image_anime_nsfw.cum`: Retrieve an NSFW image featuring cum scenes.
- `random_image_anime_nsfw.eba`: Get an NSFW image from the "eba" category.
- `random_image_anime_nsfw.ero`: Fetch an NSFW "ero" image.
- `random_image_anime_nsfw.femdom`: Retrieve an NSFW image with femdom themes.
- `random_image_anime_nsfw.foot`: Get an NSFW image featuring feet fetish themes.
- `random_image_anime_nsfw.gangbang`: Fetch an NSFW image featuring gangbang scenes.
- `random_image_anime_nsfw.gifs`: Retrieve NSFW animated GIFs.
- `random_image_anime_nsfw.glasses`: Get an NSFW image featuring anime characters with glasses.
- `random_image_anime_nsfw.hentai`: Fetch an NSFW hentai image.
- `random_image_anime_nsfw.jahy`: Get an NSFW image featuring the character Jahy.
- `random_image_anime_nsfw.manga`: Retrieve NSFW manga images.
- `random_image_anime_nsfw.masturbation`: Get an NSFW image featuring masturbation scenes.
- `random_image_anime_nsfw.megumin`: Fetch an NSFW image featuring the character Megumin.
- `random_image_anime_nsfw.neko`: Retrieve an NSFW image featuring anime nekos.
- `random_image_anime_nsfw.nekonime`: Get an NSFW image related to Nekonime anime.
- `random_image_anime_nsfw.loli`: Fetch an NSFW loli image.
- `random_image_anime_nsfw.orgy`: Get an NSFW image featuring orgy scenes.
- `random_image_anime_nsfw.panties`: Fetch an NSFW image featuring panties.
- `random_image_anime_nsfw.pussy`: Retrieve an NSFW image featuring explicit content.
- `random_image_anime_nsfw.tentacles`: Get an NSFW image featuring tentacles themes.
- `random_image_anime_nsfw.thighs`: Fetch an NSFW image featuring thigh fetish themes.
- `random_image_anime_nsfw.yuri`: Get an NSFW image featuring yuri themes.
- `random_image_anime_nsfw.zettai`: Retrieve an NSFW image with "zettai ryouiki" (absolute territory) themes.

With these functions, users can access NSFW anime content. However, it's crucial to use them responsibly and ensure that the content is appropriate for the intended audience and context.

### Converter Functions

- `converter.text_to_image`: Convert text to an image.
- `converter.text_to_gif`: Convert text to a GIF.

### Maker Functions

These functions allow you to apply various effects to images:

- `maker.enhance`
- `maker.beautiful`
- `maker.blur`
- `maker.facepalm`
- `maker.invert`
- `maker.rainbow`
- `maker.trigger`
- `maker.wanted`
- `maker.wasted`
- `maker.darkness`
- `maker.pixelate`

### Tools Functions

- `tools.get_temp_mail`: Get a temporary email address.
- `tools.get_temp_mail_inbox`: Access the inbox of a temporary email address.
- `tools.screenshot_website`: Take a screenshot of a website.
- `tools.style_text`: Style text.
- `tools.base64_encode`: Encode data in Base64 format.
- `tools.base64_decode`: Decode Base64-encoded data.
- `tools.base32_encode`: Encode data in Base32 format.
- `tools.base32_decode`: Decode Base32-encoded data.

Feel free to explore and use these functions as needed for your scraping tasks. Refer to the individual function documentation for usage details.
