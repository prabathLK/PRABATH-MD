// Import the entire module:

// CommonJs (CJS) Sintax
// To use this module with CommonJS syntax, you can import the entire module or specific functions like this:
const scraper = require('./lib/scraper');

// ECMAScript Modules (ESM) Syntax
// To use this module with ESM syntax, you can import the entire module or specific functions like this:
//import * as scraper from './lib/scraper';

// Displays all function list:
const data = scraper;
console.log(data);

// Example of use:

// Download a YouTube video:
scraper.downloader.youtube_video('https://youtu.be/rKt_RuVmBkA')
  .then(response => {
    if (!response.ok) {
      throw new Error("Request failed!");
    }
    return response.json();
  })
  .then(data => {
    if (!data) {
      return console.log({
        status: "Error",
        code: 404,
        message: "Data not found!"
      });
    } else {
      return console.log({
        status: "Success",
        code: 200,
        author: 'Dani Techno.',
        data: data.data
      });
    }
  })
  .catch(error => {
    console.log(error);
    return console.log({
      error: "An error occurred."
    });
  }
);
  
// Result
/*
{
  status: 'Success',
  code: 200,
  author: 'Dani Techno.',
  data: {
    title: 'How to build a REST API using Node.js + Express.js - Dani Tech.',
    thumbnail: 'https://i.ytimg.com/vi/rKt_RuVmBkA/maxresdefault.jpg',
    duration: '00:18:43',
    vid_360p: 'https://rr2---sn-gjo-w43l.googlevideo.com/videoplayback?expire=1694857292&ei=7CMFZdWVKO2N_9EP5KSY0Aw&ip=91.240.71.162&id=o-ACuVhFZ19ZkCKIrgScTFxqZEtuThUoZoYFWBpl9azTdo&itag=22&source=youtube&requiressl=yes&mh=Mk&mm=31%2C29&mn=sn-gjo-w43l%2Csn-ab5sznzd&ms=au%2Crdu&mv=u&mvi=2&pl=24&spc=UWF9f9yQuPWJNYrn3r9gtOyYCTtwHTk&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=1123.242&lmt=1685400278204618&mt=1694833858&fvip=4&fexp=24007246&c=ANDROID&txp=6218224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgfqW3Ix5EMAglkvilLahNP1Na4t52mKloaqUPm2MmTgYCIHtBAY9pCEDZvMm8_EGIqvkkIOskDxB27_qI2FCTmnII&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl&lsig=AG3C_xAwRQIhAONgo2riuCtP9ZfZb4h2_HDFoDwYjz0j95kxFwRPQwtRAiAoSzGFQq-ld1II7Use33D57u3PZIAbbejZIrjzCrnC2w%3D%3D&title=How+to+build+a+REST+API+using+Node.js+++Express.js+-+Dani+Tech.',
    vid_720p: 'https://rr2---sn-gjo-w43l.googlevideo.com/videoplayback?expire=1694857292&ei=7CMFZdWVKO2N_9EP5KSY0Aw&ip=91.240.71.162&id=o-ACuVhFZ19ZkCKIrgScTFxqZEtuThUoZoYFWBpl9azTdo&itag=18&source=youtube&requiressl=yes&mh=Mk&mm=31%2C29&mn=sn-gjo-w43l%2Csn-ab5sznzd&ms=au%2Crdu&mv=u&mvi=2&pl=24&spc=UWF9f9yQuPWJNYrn3r9gtOyYCTtwHTk&vprv=1&svpuc=1&mime=video%2Fmp4&gir=yes&clen=39898381&ratebypass=yes&dur=1123.242&lmt=1685399563608355&mt=1694833858&fvip=4&fexp=24007246&c=ANDROID&txp=6219224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgQVOUxQJ8sLAoPtAp-MIHBLb0RLaslIALxkCjRYKXcngCIBjwdUvDBX55iz0bA48PjvmVNDTQHDRO0tRYFwl8tWbS&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl&lsig=AG3C_xAwRQIhAONgo2riuCtP9ZfZb4h2_HDFoDwYjz0j95kxFwRPQwtRAiAoSzGFQq-ld1II7Use33D57u3PZIAbbejZIrjzCrnC2w%3D%3D&title=How+to+build+a+REST+API+using+Node.js+++Express.js+-+Dani+Tech.'
  }
}
*/

// Base64 Encode
const base64Encode = (text) => {
  return scraper.tools.base64_encode(text);
};

console.log('Result: ', base64Encode('Dani'));

// Result
/*
Result:  RGFuaQ==
*/

// Base64 Decode
const base64Decode = (text) => {
  return scraper.tools.base64_decode(text);
};

console.log('Result: ', base64Decode('RGFuaQ=='));

// Result
/*
Result:  Dani
*/