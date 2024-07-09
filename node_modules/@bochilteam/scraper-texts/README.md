# Texts Scraper
Texts scraper or Fetcher texts data from [texts databases](https://github.com/BochilTeam/database/tree/master/kata-kata)

## Installation
```sh
npm i @bochilteam/scraper-texts
```

## Usage 
Example convert text to/from Javanese alphabet
```ts
// Import module
import { latinToAksara, aksaraToLatin } from '@bochilteam/scraper-texts'

// To Javanese alphabet
const aksara = latinToAksara('Cepet go')
console.log(aksara)
// From Javanese alphabet to text (latin)
const latin = aksaraToLatin(aksara)
console.log(result) // 'Cepet go'
```
[Documentation](https://bochilteam.github.io/scraper/modules/_bochilteam_scraper_texts.html)