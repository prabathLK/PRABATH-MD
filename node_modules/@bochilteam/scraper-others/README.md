# Others Scraper
Other.

## Installation
```sh
npm i @bochilteam/scraper-others
```

## Usage 
Example get information from [Wikipedia](https://www.wikipedia.org/) about Minecraft
```ts
// Import module
import { wikipedia } from '@bochilteam/scraper-others'

const data = await wikipedia('Minecraft', 'en') // 'en' as lang
console.log(data) // JSON
```
[Documentation](https://bochilteam.github.io/scraper/modules/_bochilteam_scraper_others.html)