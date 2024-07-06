# News Scraper
News scraper from Indonesian news sites

## Installation
```sh
npm i @bochilteam/scraper-news
```

## Usage 
Example get news from [cnbc](https://www.cnbcindonesia.com/)
```ts
// Import module
import { cnbcindonesia } from '@bochilteam/scraper-news'

const data = await cnbcindonesia()
console.log(data) // JSON
```
[Documentation](https://bochilteam.github.io/scraper/modules/_bochilteam_scraper_news.html)