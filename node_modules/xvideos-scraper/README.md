# XVideos Scraper

![XVideos Logo](https://www.xvideos2.com/static-files/v3/img/skins/default/xvideos.com.png)

A simple XVideos Scraper that srapes/gets video data and downloadable video source and returns a promise/JSON Object result.

# HOW TO INSTALL?
```
npm i xvideos-scraper
```

# Require to export function
```js
//CommonJS
const xv = require('xvideos-scraper');
```

## SIMPLE USAGE
### usage of `searchVideo()` and `getVideoData()`
```js
const xv = require('xvideos-scraper');

let res = await xv.searchVideo({
 //proxy: false, //optional default false
 search: "stepsis", 
 sort: "relevance",
 //filterDuration: "20min_more" //optional
 //filterDate: "week", //optional
 //filterQuality: "hd", //optional
 //viewWatched: "h", //optional
 pagination: 1
})
console.log(res)

let res2 = await xv.getVideoData({
 //proxy: false, //optional default false
 videoUrl: res[0].video //takes videolink result of searchVideo() as an input
})
console.log(res2)
```

## All Params for searchVideo() and getVideoData()
Params | Is Required | Type | Selectors | Description | 
--- | --- | --- | --- | ---
`proxy` | optional | `boolean` | `true` or `false` | Sends the request to a different server than the request is intended for.
`pagination` | required | `int/number` | `1`, `2`, `3`... | number of paginations of a webpage that starts from 1 (1st pagination).
`viewWatched` | optional | `string` | `h` | Hides already viewed videos.
`filterQuality` | optional | `string` | `all`, `hd` and `1080p` | Filter videos by quality.
`filterDuration` | optional | `string` | `allduration`, `1-3min`, `3-10min`, `10min_more`, `10-20min` and `20min_more` | Filter videos by duration.
`filterDate` | optional | `string` | `all`, `today`, `week`, `month`, `3month` and `6month` | Filter videos by date uploaded.
`sort` | required | `string` | `relevance`, `uploaddate`, `rating`, `length`, `views` and `random` | Sorts the result videos.
`videoUrl` | required | `string` | `link of a video` | Link of a video that you can get on searchVideo() results.

# Sample Sucess Responses
### Success response for `searchVideo()` with proxy
```js
[
  {
    video: 'https://zend2.com/index.php?q=zanVo6lxZ2WsrKqPqa_Lm5rU1V6VqNCS282clqdwZ5qYaJlpbWaZmZiel8afrcOjod7Bk6SexNDVzZ2Qq62a0tie1JKtn6GimpSiz5Cvw5qW2cufoA',
    title: 'Accidentally Creampie Stepsis While On Vacation',
    duration: '27 min',
    uploaderName: 'Nestoprod',
    uploaderProfile: 'https://zend2.com/index.php?q=zanVo6lxZ2WsrKqPqa_Lm5rU1V6VqNCS1danl6GlmtWUo8amqqaoqKSZ'
  }
]
```

### Success response for `searchVideo()` without proxy
```js
[
  {
    video: 'https://www.xvideos2.com/video57761037/joi_-_my_stepsis_noticed_my_boner_she_asks_me_to_jerk_off.',
    thumbnail: 'https://img-hw.xvideos-cdn.com/videos/thumbs169ll/e3/25/e6/e325e6605d7ac6a447c131a93eb9f401/e325e6605d7ac6a447c131a93eb9f401.23.jpg',
    title: 'JOI - My stepsis noticed my boner, she asks me to jerk off.',
    duration: '24 min',
    uploaderName: 'Madelaine Rousset',
    uploaderProfile: 'https://www.xvideos2.com/pornstar-channels/madelaine_rousset'
  }
]
```

### Success response for `getVideoData()` with proxy
```js
{
  name: 'Accidentally Creampie Stepsis While On Vacation',
  description: 'Accidentally Creampie Stepsis While On Vacation',
  thumbnailUrl: [
    'https://img-hw.xvideos-cdn.com/videos/thumbs169ll/1e/3e/4a/1e3e4a30c4e3d657ea487f51fc719592/1e3e4a30c4e3d657ea487f51fc719592.1.jpg'
  ],
  uploadDate: '2022-10-14T13:57:55+00:00',
  contentUrl: 'https://video-hw.xvideos-cdn.com/videos/mp4/1/e/3/xvideos.com_1e3e4a30c4e3d657ea487f51fc719592.mp4?e=1667462790&ri=1024&rs=85&h=6bc70ef4e1fe7a266d8ae5a7a094a7d4',
  interactionStatistic: {
    type: 'InteractionCounter',
    interactionType: { type: 'WatchAction' },
    userInteractionCount: 145444
  }
}
```

### Success response for `getVideoData()` without proxy
```js
{
  name: 'JOI - My stepsis noticed my boner, she asks me to jerk off.',
  description: 'JOI - My stepsis noticed my boner, she asks me to jerk off.',
  thumbnailUrl: [
    'https://img-hw.xvideos-cdn.com/videos/thumbs169ll/e3/25/e6/e325e6605d7ac6a447c131a93eb9f401/e325e6605d7ac6a447c131a93eb9f401.23.jpg'
  ],
  uploadDate: '2020-08-20T20:05:05+00:00',
  contentUrl: {
    Default_Quality: 'https://vid1-l3.xvideos-cdn.com/videos/mp4/e/3/2/xvideos.com_e325e6605d7ac6a447c131a93eb9f401.mp4?e=1667465024&ri=1024&rs=85&h=fa62bd3b86152a2fce61e5eec8d94afa',
    Low_Quality: 'https://vid1-l3.xvideos-cdn.com/videos/3gp/e/3/2/xvideos.com_e325e6605d7ac6a447c131a93eb9f401.mp4?e=1667465024&ri=1024&rs=85&h=9ccff3a13ab83548dadb9f5851d4fc6c',
    HD_Quality: 'https://vid1-l3.xvideos-cdn.com/videos/mp4/e/3/2/xvideos.com_e325e6605d7ac6a447c131a93eb9f401.mp4?e=1667465024&ri=1024&rs=85&h=fa62bd3b86152a2fce61e5eec8d94afa',
    UHD_Quality: 'https://hls1-l3.xvideos-cdn.com/365d05b42ef26dbac751d39a1efea3751aa5fd2e-1667465024/videos/hls/e3/25/e6/e325e6605d7ac6a447c131a93eb9f401/hls.m3u8'
  },
  interactionStatistic: {
    type: 'InteractionCounter',
    interactionType: { type: 'WatchAction' },
    userInteractionCount: '1,838,959 Views'
  }
}
```