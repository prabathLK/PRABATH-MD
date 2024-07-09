## Penginstalan
> npm install dandi-api
>
> npm uninstall dandi-api
>

## ```Function```
```js
const ds = require('dandi-api')
ds : {
  Yta: [AsyncFunction: anonymous],
  Ytv: [AsyncFunction: anonymous],
  Tiktok: [AsyncFunction: downloader],
  Instagram: [AsyncFunction: downloader],
  Facebook: [Function (anonymous)],
  Twitter: [AsyncFunction: downloader],
  SoundCloud: [AsyncFunction: downloader],
  Imgur: [AsyncFunction: downloader],
  Imdb: [AsyncFunction: downloader],
  Anime: [Function: anime],
  Manga: [Function: manga],
  Character: [Function: character],
  JadwalBola: [Function: jadwalbola],
  JadwalTv: [Function: jadwaltv],
  JadwalSholat: [Function: jadwalsholat],
  Pinterest: [Function: pinterest],
  Film: [Function: film],
  Wattpad: [Function: wattpad],
  WattpadUser: [Function: wattpaduser],
  Webtoons: [Function: webtoons],
  Mangatoons: [Function: mangatoons],
  Drakor: [Function: drakor],
  Telesticker: [AsyncFunction (anonymous)],
  StickerSearch: [Function: stickersearch],
  ListSurah: [Function: listsurah],
  Surah: [Function: surah],
  TafsirSurah: [Function: tafsirsurah],
  KompasNews: [Function: kompasnews],
  Covid: [AsyncFunction: covid],
  Shoope: [AsyncFunction: Shoope],
  Gempa: [AsyncFunction: Gempa],
  GSMArena: [AsyncFunction: GSMArena],
  Emoji: [AsyncFunction: Emoji],
  Wikipedia: [AsyncFunction: Wikipedia],
  RandomCerpen: [AsyncFunction: RandomCerpen],
  Mediafire: [AsyncFunction (anonymous)],
  Mangatoon: [AsyncFunction (anonymous)],
  IgStalk: [AsyncFunction (anonymous)],
  SfileDown: [AsyncFunction (anonymous)],
  SfileSearch: [Function (anonymous)],
  ResepSearch: [AsyncFunction (anonymous)],
  ResepRead: [AsyncFunction (anonymous)],
  SearchGore: [AsyncFunction (anonymous)],
  Goredl: [AsyncFunction (anonymous)],
  RandomGore: [AsyncFunction (anonymous)],
  GrupWA: [Function (anonymous)],
  ArtiNama: [Function (anonymous)],
  WallpaperHd: [Function (anonymous)],
  Kbbi: [AsyncFunction (anonymous)]
}
```

## ```Downloader```
```js
const ds = require('dandi-api');

const url_youtube = 'https://www.youtube.com/watch?v=x9SzUoJei-U'
const url_tiktok = 'https://vt.tiktok.com/ZSehyjVW9/'
const url_instagram = 'https://www.instagram.com/p/CDNj_q-FO9M/'
const url_facebook = 'http://www.facebook.com/groups/526909968570398/permalink/571916620736399/'
const url_twitter = 'https://twitter.com/LucuLucuVideo/status/1454834787382816775?s=20'
const url_soundcloud = 'https://soundcloud.com/enggak-tau-829795349/tri-suaka-aku-bukan-jodohnya?utm_campaign=social_sharing&utm_source=mobi&utm_terms=social_sharing_on_mobi.control%2Ctop_curators.top_curators'
const url_imgur = 'https://imgur.com/gallery/rK8ppvC'
const url_imdb = 'https://www.imdb.com/video/vi146981657?listId=ls053181649'
const url_telesticker = 'https://t.me/addstickers/punyaJvadrsaprn'

// youtube
ds.Yta(url_youtube)
    .then(data => {console.log(data)
});

ds.Yta(url_youtube)
    .then(data => {console.log(data)
});

// tiktok
ds.Tiktok(url_tiktok)
    .then(data => {console.log(data)
});

// instagram
ds.Instagram(url_instagram)
    .then(data => {console.log(data)
});

// facebook
ds.Facebook(url_facebook)
    .then(data => {console.log(data)
});

// twitter
ds.Twitter(url_twitter)
    .then(data => {console.log(data)
});

// soundcloud
ds.SoundCloud(url_soundcloud)
    .then(data => {console.log(data)
});

// imgur
ds.Imgur(url_imgur)
    .then(data => {console.log(data)
});

// imdb
ds.Imdb(url_imdb)
    .then(data => {console.log(data)
});

// telesticker
ds.Telesticker(url_telesticker)
    .then(data => {console.log(data)
});
```

## ```Anime```
```js
const ds = require('dandi-api');

const query = 'naruto'

// anime
ds.Anime(query)
    .then(data => {console.log(data)
});

// manga
ds.Manga(query)
    .then(data => {console.log(data)
});

// character
ds.Character(query)
    .then(data => {console.log(data)
});
```

## ```Search```
```js
const ds = require('dandi-api');

const query_pinterest = 'yuri'
const query_film = 'love story'
const query_wattpad = 'love story'
const query_webtoons = 'love story'
const query_mangatoons = 'love story'
const query_drakor = 'love story'
const query_stickersearch = 'patrick'
const query_resep = 'bakwan'
const resep_link = 'https://resepkoki.id/resep/resep-bakwan-mie/'

// pinterest
ds.Pinterest(query_pinterest)
    .then(data => {console.log(data)
});

// film
ds.Film(query_film)
    .then(data => {console.log(data)
});

// wattpad
ds.Wattpad(query_wattpad)
    .then(data => {console.log(data)
});

// webtoons
ds.Webtoons(query_webtoons)
    .then(data => {console.log(data)
});

// mangatoons
ds.Mangatoons(query_mangatoons)
    .then(data => {console.log(data)
});

// drakor
ds.Drakor(query_drakor)
    .then(data => {console.log(data)
});

// stickersearch
ds.StickerSearch(query_stickersearch)
    .then(data => {console.log(data)
});

// resepsearch
ds.ResepSearch(query_resep)
    .then(data => {console.log(data)
});


// resepread
ds.ResepRead(resep_link)
    .then(data => {console.log(data)
});
```

## ```Islami```
```js
const ds = require('dandi-api');

const query = 'udin'

// listsurah
ds.ListSurah()
    .then(data => {console.log(data)
});

// surah
ds.Surah(query)
    .then(data => {console.log(data)
});

// tafsirsurah
ds.TafsirSurah(query)
    .then(data => {console.log(data)
});
```

## ```Information && News```
```js
const ds = require('dandi-api');

const username = 'WattpadRomanceIN'
const user_ig = 'dandisubhani_'

// jadwalbola
ds.JadwalBola()
    .then(data => {console.log(data)
});

// jadwaltv
ds.JadwalTv()
    .then(data => {console.log(data)
});

// jadwalsholat
ds.JadwalSholat()
    .then(data => {console.log(data)
});

// kompasnews
ds.KompasNews()
    .then(data => {console.log(data)
});

// inews
ds.Inews()
    .then(data => {console.log(data)
});

// wattpaduser
ds.WattpadUser(username)
     .then(data => {console.log(data)
});


// igstalk
ds.IgStalk(user_ig)
    .then(data => {console.log(data)
});
```
