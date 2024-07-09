# Simple image to url converter

- Author : [Black Amda](https://github.com/BlackAmda/)

***

## Installation 
```sh
npm i @blackamda/telegram-image-url
```

***

## Example
```ts
let { img2url } = require('@blackamda/telegram-image-url')

const path = './1234.jpg'

img2url(path).then(url => {
    console.log(url); //=> https://telegra.ph/file/a45e08f53773b1a6a16af.jpg
})
```
***