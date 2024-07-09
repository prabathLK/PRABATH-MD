# Religions Scraper
Data scraper for a religion

## Installation
```sh
npm i @bochilteam/scraper-religions
```

## Usage 
Example get prayer schedule
```ts
// Import module
import { jadwalsholat } from '@bochilteam/scraper-religions'

const data = await jadwalsholat('Semarang')
console.log(data) // JSON
```
[Documentation](https://bochilteam.github.io/scraper/modules/_bochilteam_scraper_religions.html)