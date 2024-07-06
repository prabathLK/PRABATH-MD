## Instalation :
bash
> npm i api-dylux
> npm uninstall api-dylux
>

## ```Puede usar la ApiRest si gusta``` :

[https://api.fgmods.xyz](https://api.fgmods.xyz)



## ```Downloader```
```js
const fg = require('api-dylux');

// youtube mp3
let data = await fg.yta('https://www.youtube.com/watch?v=IQEIfAGjdaE')
    console.log(data)
//yt mp4
let data = await fg.ytv('https://www.youtube.com/watch?v=IQEIfAGjdaE')
    console.log(data)

// youtube DL 2 mp3
let data = await fg.ytmp3('https://www.youtube.com/watch?v=IQEIfAGjdaE')
    console.log(data)
//yt mp4
let data = await fg.ytmp4('https://www.youtube.com/watch?v=IQEIfAGjdaE')
    console.log(data)

// tiktok
let data = await fg.tiktok('https://vm.tiktok.com/ZMFMun818/')
    console.log(data)

// tiktok2
let data = await fg.tiktok2('https://vm.tiktok.com/ZMFMun818/')
    console.log(data)

// instagram story
let data = await fg.igstory('auronplay') // instagram username 
    console.log(data)


// facebook
let data = await fg.fbdl('https://fb.watch/gcqqhaEaEP/')
    console.log(data)


// twitter
let data = await fg.twitter('https://twitter.com/i/status/1578737162757242881')
    console.log(data)


// soundcloud
let data = await fg.soundcloudDl('https://m.soundcloud.com/trap-mvp-rd/milo-j-rincon')
    console.log(data)

let data = await fg.soundcloudDl2('https://m.soundcloud.com/trap-mvp-rd/milo-j-rincon')
    console.log(data)


```

## ```Search```
```js
const fg = require('api-dylux');

// pinterest
let data = await fg.pinterest('cyberpunk')
    console.log(data)


// wallpaperHd
let data = await fg.wallpaper('cyberpunk')
    console.log(data)

// stickersearch
let data = await fg.StickerSearch('peppe')
    console.log(data)

// npm
let data = await fg.npmSearch('canvas')
    console.log(data)
```