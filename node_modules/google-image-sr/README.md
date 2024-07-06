<p align="center">
    <p align="center">
    <h1 align="center">Google Image SR
    <h5 align="center">Easy & Beginner friendly google-images scraper made with ❤️ and typescript.
</p>
</p>
<p align="center">
<a href="https://github.com/TrishCX/Google-Image-Sr" target="_blank">
    <img src="http://forthebadge.com/images/badges/built-with-love.svg"/>
  </a>
</p>

  <p align="center">
<p align="center">
  <a href="https://github.com/TrishCX/Google-Image-Sr" target="_blank">
    <img src="https://img.shields.io/npm/v/google-image-sr.svg" alt="Build Status">
  </a>
  <a href="https://github.com/TrishCX/Google-Image-Sr" target="_blank">
    <img src="https://img.shields.io/badge/License-Boost_1.0-lightblue.svg" alt="Codecov" />
  </a>
  <a href="https://github.com/TrishCX/Google-Image-Sr" target="_blank">
    <img src="https://img.shields.io/badge/License-ISC-blue.svg" alt="License">
  </a>
  
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/google-image-sr" target="_blank">
    <img src="https://img.shields.io/npm/dt/google-image-sr.svg" />
  </a>
  
</p>

# Options

- "Include" Only filter out results from the specified domain.
- "safe" Only get safe results in return.
- "userAgent" The user agent to use while making calls.

# 🔗 Prerequisites

- NodeJS 16 +

# ❔Installation

```console
$ npm install google-image-sr
```

## Import

```typescript
import search from "google-image-sr";
```

## Example

```ts
import search from "google-image-sr";
(async () => {
  const query = "Anime";
  const response = await search(query);
  console.log(response);
})(); // Anonymous arrow function.
```

## Output

```ts
[
  {
    title: 'Strongest Anime Characters ...',
    url: 'https://www.fortressofsolitude.co.za/the-15-most-powerful-anime-characters-of-all-time/',
    image: 'https://www.fortressofsolitude.co.za/wp-content/uploads/2022/08/most-powerful-anime-characters.jpeg'
  },
  {
    title: 'The anime Haikyuu!! would have already ...',
    url: 'https://en.datosjam.net.pe/anime/the-anime-haikyuu-would-have-already-confirmed-a-fifth-season/',
    image: 'https://en.datosjam.net.pe/wp-content/uploads/2022/08/The-anime-Haikyuu-would-have-already-confirmed-a-fifth-season.jpg'
  },
  {
    title: 'Death Note (TV Series 2006–2007) - IMDb',
    url: 'https://www.imdb.com/title/tt0877057/',
    image: 'https://m.media-amazon.com/images/M/MV5BNjRiNmNjMmMtN2U2Yi00ODgxLTk3OTMtMmI1MTI1NjYyZTEzXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg'
  },
  {
    title: 'Top 10 Anime of 2022 - YouTube',
    url: 'https://www.youtube.com/watch?v\\u003dCk4uC3pI7jk',
    image: 'https://i.ytimg.com/vi/Ck4uC3pI7jk/maxresdefault.jpg'
  },
  {
    title: 'How to draw and color anime hair | Art ...',
    url: 'https://www.clipstudio.net/how-to-draw/archives/161517',
    image: 'https://i.ytimg.com/vi/aAl87Vo4rlI/maxresdefault.jpg'
  },
  {
    title: 'NieR: Automata Ver1.1a TV anime to ...',
    url: 'https://www.gematsu.com/2022/12/nier-automata-ver1-1a-tv-anime-to-begin-airing-january-7-2023-promotion-file-008-trailer',
    image: 'https://www.gematsu.com/wp-content/uploads/2022/12/NieR-Automata-PV_12-25-22.jpg'
  },
  {
    title: 'Best Anime of 2019: Top New Anime ...',
    url: 'https://www.thrillist.com/entertainment/nation/best-anime-2019',
    image: 'https://assets3.thrillist.com/v1/image/2855064/828x1500/flatten;scale;webp=auto;jpeg_quality=60.jpg'
  },
  {
    title: 'Anime girl with bear white / black hood ...',
    url: 'https://puzzlefactory.com/manga-anime-puzzle/248565-anime-girl-with-bear-white-black-hood-jigsaw-puzzle',
    image: 'https://assets.puzzlefactory.com/puzzle/248/565/original.jpg'
  },
  {
    title: 'The best anime on Netflix right now ...',
    url: 'https://ew.com/tv/best-anime-on-netflix/',
    image: 'https://imagesvc.meredithcorp.io/v3/mm/image?url=https://static.onecms.io/wp-content/uploads/sites/6/2020/09/18/Blue-Exorcist.jpg'
  },
  {
    title: 'Jujutsu Kaisen (Anime) | Jujutsu Kaisen ...',
    url: 'https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Kaisen_(Anime)',
    image: 'https://static.wikia.nocookie.net/jujutsu-kaisen/images/8/88/Anime_Key_Visual_2.png/revision/latest?cb=20201212034001'
  },
  {
    title: '30 Best Anime Movies of All Time ...',
    url: 'https://jw-webmagazine.com/best-anime-movies/',
    image: 'https://jw-webmagazine.com/wp-content/uploads/2020/04/chihiro042-1.jpg'
  },
  {
    title: '10 Best Anime of 2023 - Top Anime to Watch',
    url: 'https://www.cosmopolitan.com/entertainment/tv/g42624799/best-anime-2023/',
    image: 'https://hips.hearstapps.com/hmg-prod/images/best-anime-2023-1-1674595243.png?crop=0.505xw:1.00xh;0.460xw,0&resize=1200:*'
  },
  {
    title: "The Best Anime To Watch If You're An ...",
    url: 'https://www.looper.com/622093/the-best-anime-to-watch-if-youre-an-anime-newbie/',
    image: 'https://www.looper.com/img/gallery/the-best-anime-to-watch-if-youre-an-anime-newbie/intro-1633148302.jpg'
  },
  {
    title: "Naruto' Anime Getting Four New Episodes ...",
    url: 'https://hypebeast.com/2023/3/naruto-anime-four-new-episodes-boruto-anime-ending-part-i-info',
    image: 'https://image-cdn.hypb.st/https://hypebeast.com/image/2023/03/naruto-anime-four-new-episodes-boruto-anime-ending-part-i-info-000.jpg?w=960&cbr=1&q=90&fit=max'
  },
  {
    title: 'Netflix Orders Anime Series Based On ...',
    url: 'https://deadline.com/2023/02/netflix-anime-series-japanese-manga-pluto-voice-cast-1235260159/',
    image: 'https://deadline.com/wp-content/uploads/2023/02/Pluto_S1_Sneak-Peek_Thumb_16X9_Publicity.jpeg'
  },
  {
    title: 'Best Anime Just Added to Crunchyroll ...',
    url: 'https://www.denofgeek.com/tv/best-anime-added-to-crunchyroll/',
    image: 'https://www.denofgeek.com/wp-content/uploads/2022/05/Crunchyroll.jpeg?resize=768,432'
  }]
    ... 55 more items
```

# 🔗 Links

- [Github](https://github.com/TrishCX)
- [Repository](https://github.com/TrishCX/Google-Image-Sr)

# License

ISC
