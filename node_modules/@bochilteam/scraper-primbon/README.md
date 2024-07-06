# Primbon Scraper
Primbon Scraper

## Installation
```sh
npm i @bochilteam/scraper-primbon
```

## Usage 
Example get zodiac
```ts
// Import module
import { getZodiac } from '@bochilteam/scraper-primbon'

const data = getZodiac(1, 1) // The first argument is the month and the second argument is the date
console.log(data) // 'capricorn'
```
Example to get the meaning of the name
```ts
// Import module
import { artinama } from '@bochilteam/scraper-primbon'

const data = await artinama('Windah basudara') 
console.log(data) // String
```
[Documentation](https://bochilteam.github.io/scraper/modules/_bochilteam_scraper_primbon.html)