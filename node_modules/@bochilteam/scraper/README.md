# [Scraper](https://github.com/BochilTeam/scraper)
All In One Scraper

## Installation
```sh
npm i @bochilteam/scraper
```

## Usage 
Here is an example of using Savefrom to download Facebook video
```ts
// Import module first
import { snapsave } from '@bochilteam/scraper'

const data = await snapsave('https://fb.watch/9WktuN9j-z/')
console.log(data) // JSON
```
[Documentation](https://bochilteam.github.io/scraper/)