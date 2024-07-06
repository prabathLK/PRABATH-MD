# SINHALA UNICODE NPM PACKEGE FOR SRI LANKANS

***

- [Ravindu Manoj](https://github.com/ravindu01manoj/)

***

## Installation 
```sh
npm i sinhala-unicode

## or

yarn add sinhala-unicode
```

***

## Functions

```ts
let convert = require("sinhala-unicode")

let {
    amaleeToUnicode, //Amalee --> Unicode
    bamaniToUnicode, //Bamini --> Unicode
    dlManelToUnicode, //DL-Manel-bold. --> Unicode
    fmAbayaToUnicode, //FM Abhaya --> Unicode
    kaputaToUnicode, //kaputadotcom --> Unicode
    tanglishToUnicode, //TanGlish (Phonetic) transliterated --> Tamil Unicode
    thibusToUnicode, //Thibus Sinhala --> Unicode
    unicodeToBamini, //Unicode --> Bamini
    unicodeToDlManel, //Unicode --> DL-Manel-bold.
    unicodeToKaputa, //Unicode --> kaputadotcom
    unicodeToTiptaka, //Unicode --> Tipitaka_Sinhala1
    singlishPhoneticToUnicode, //SinGlish (Phonetic) transliterated --> Sinhala Unicode
    singlishToUnicode, //SinGlish transliterated --> Sinhala Unicode
    } = convert

```

***

## Example
```ts
var result;
result = convert.kaputaToUnicode("rvQ[E m@n`j~")
console.log(result) //=> රවිඳු මනොජ්

result = convert.unicodeToKaputa("රවිඳු මනොජ්")
console.log(result) //=> rvQ[E m@n`j~


result = convert.singlishPhoneticToUnicode("manoj")
console.log(result) //=> මනෝජ්

```

***

## Thanks
- Language Technology Research Laboratory - [University of Colombo School of Computing](https://ucsc.cmb.ac.lk//ltrl/services/feconverter/). (2011)



