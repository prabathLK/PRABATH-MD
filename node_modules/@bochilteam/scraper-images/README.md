# Images Scraper
Scraper to find pictures/images 

## Installation
```sh
npm i @bochilteam/scraper-images
```

## Usage 
Example get images from Google image:
```ts
// Import module
import { googleImage } from '@bochilteam/scraper-images'

const data = await googleImage('Minecraft')
console.log(data) // JSON
```
[Documentation](https://bochilteam.github.io/scraper/modules/_bochilteam_scraper_images.html)