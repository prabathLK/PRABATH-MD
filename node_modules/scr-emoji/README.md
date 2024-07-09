## ❄️ Installation
```sh
npm i scr-emoji
```
## 🍟 Example
```js
const { emoji } = require('scr-emoji') 

const emojis = '😘'
// Usee scr emoji 
const emo = await emoji(emojis)
console.log(emo) // JSON
return emo //JSON
```

## 📍 Final Result
```js
{
  creator: 'Lann',
  host: 'https://emojigraph.org/id',
  emojisData: {
    apple: 'https://emojigraph.org/media/apple/face-blowing-a-kiss_1f618.png',
    google: 'https://emojigraph.org/media/google/face-blowing-a-kiss_1f618.png',
    facebook: 'https://emojigraph.org/media/facebook/face-blowing-a-kiss_1f618.png',
    twitter: 'https://emojigraph.org/media/twitter/face-blowing-a-kiss_1f618.png',
    samsung: 'https://emojigraph.org/media/samsung/face-blowing-a-kiss_1f618.png',
    microsoft: 'https://emojigraph.org/media/microsoft/face-blowing-a-kiss_1f618.png',
    whatsapp: 'https://emojigraph.org/media/whatsapp/face-blowing-a-kiss_1f618.png',
    mesengger: 'https://emojigraph.org/media/messenger/face-blowing-a-kiss_1f618.png',
    joypixels: 'https://emojigraph.org/media/joypixels/face-blowing-a-kiss_1f618.png',
    openmoji: 'https://emojigraph.org/media/openmoji/face-blowing-a-kiss_1f618.png',
    emojidex: 'https://emojigraph.org/media/emojidex/face-blowing-a-kiss_1f618.png',
    htc: 'https://emojigraph.org/media/htc/face-blowing-a-kiss_1f618.png',
    lg: 'https://emojigraph.org/media/lg/face-blowing-a-kiss_1f618.png',
    mozilla: 'https://emojigraph.org/media/mozilla/face-blowing-a-kiss_1f618.png',
    softbank: 'https://emojigraph.org/media/softbank/face-blowing-a-kiss_1f618.png',
    au_kddi: 'https://emojigraph.org/media/au-kddi/face-blowing-a-kiss_1f618.png'
  }
}
//JSON
```

## ❗NOTE

1. Scraper ini memanfaatkan module emoji-api untuk mendapatkan nama emoji,dan digunakan untuk scraping.
2. Beberapa emoji mungkin tidak ada di platform ² tertentu.
3. Scraper ini gratis,jika ketahuan dijual? Mamam resikonya!.

## 🤔 Ada Bug? Ingin request sesuatu 

Jika menemukan bug atau sejenisnya,hubungi saya di [Whatsapp](https://wa.me/6285842647866?text=haiiii) saya.

## Lisensi

 scr-emoji dilisensikan di bawah [MIT License](https://opensource.org/licenses/MIT). Silakan merujuk pada file LICENSE untuk informasi lebih lanjut.
