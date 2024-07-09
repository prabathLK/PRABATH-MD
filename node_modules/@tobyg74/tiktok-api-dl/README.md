<h1 align="center">
 Tiktok Downloader & Stalk User
</h1>

<div align="center">
  <a href="https://github.com/TobyG74/tiktok-api-dl/graphs/contributors" title="contributors"><img src="https://img.shields.io/github/contributors/TobyG74/tiktok-api-dl.svg?style=for-the-badge"></img></a>
  <a href="https://github.com/TobyG74/tiktok-api-dl/network/members" title="forks"><img src="https://img.shields.io/github/forks/TobyG74/tiktok-api-dl.svg?style=for-the-badge"></img></a>
  <a href="https://github.com/TobyG74/tiktok-api-dl/issues" title="issues"><img src="https://img.shields.io/github/issues/TobyG74/tiktok-api-dl.svg?style=for-the-badge"></img></a>
  <a href="https://github.com/TobyG74/tiktok-api-dl/stargazers" title="stargazer"><img src="https://img.shields.io/github/stars/TobyG74/tiktok-api-dl.svg?style=for-the-badge"></img></a>
</div>
<br>
<div align="center">
  <a href="https://nodei.co/npm/@tobyg74/tiktok-api-dl" title="npm"><img src="https://nodei.co/npm/@tobyg74/tiktok-api-dl.png?downloads=true&downloadRank=true&stars=true"></img></a>
</div>

<br>

# Table of Contents

- [Description](#description)
- [How to get Tiktok Cookie](#how-to-get-tiktok-cookie)
- [Install](#install)
  - [From NPM](#from-npm)
  - [From Yarn](#from-yarn)
  - [From Github](#from-github)
- [Examples](#examples)
  - [Tiktok Downloader](#tiktok-downloader)
  - [Tiktok Stalker](#tiktok-stalker)
- [Response](#response)
- [Contributors](#contributors)

# Description

This project uses the Unofficial API from Tiktok.

- Can be used to download videos, images / slides and music from Tiktok
- Can be used to view someone's profile from Tiktok
- No login or password are required
- It is recommended to use your own cookies on Tiktok Stalker

# How to get Tiktok Cookie

(If the Default Cookie Has Expired)

- Login at [Tiktok](https://www.tiktok.com/)
- When you have finished logging in, you can press CTRL + SHIFT + I or Right Click and select Inspect
- Go to the Console section then type <b>document.cookie<b>
- Then Copy Paste your Cookie and Use it for TiktokStalk

# Install

- This module requires Node.js v10+ to run.

## From NPM

```
npm install @tobyg74/tiktok-api-dl
```

## From YARN

```
yarn add @tobyg74/tiktok-api-dl
```

## From Github

```
npm install github:TobyG74/tiktok-api-dl
```

# Examples

## Tiktok Downloader

- V1 uses the API from TiktokAPI
- V2 uses the API from [SSSTik](https://ssstik.io/)
- V3 uses the API from [MusicalDown](https://musicaldown.com/)

```js
const { TiktokDL } = require("@tobyg74/tiktok-api-dl")

const tiktok_url = "https://vt.tiktok.com/ZS84BnrU9"

TiktokDL(tiktok_url, {
  version: "v1" //  version: "v1" | "v2" | "v3"
}).then((result) => {
  console.log(result)
})
```

## Tiktok Stalker

- Using Default Cookies

```js
const { TiktokStalk } = require("@tobyg74/tiktok-api-dl")

const username = "tobz2k19"

TiktokStalk(username).then((result) => {
  console.log(result)
})
```

- Using Your Cookies

```js
const { TiktokStalk } = require("@tobyg74/tiktok-api-dl")

const username = "tobz2k19"

TiktokStalk(username, {
  cookie: process.env.COOKIE || "Your Cookie"
}).then((result) => {
  console.log(result)
})
```

# Response

<br>
<details>
  <summary><b>Tiktok Downloader V1</b></summary>
  <br>

```ts
{
  status: "success" | "error"
  message?: string
  result?: {
    type: "video" | "image"
    id: string
    createTime: number
    description: string
    duration?: string
    hashtag: string[]
    author: {
      uid: string
      username: string
      nickname: string
      signature: string
      region: string
      avatarLarger: string
      avatarThumb: string
      avatarMedium: string
      url: string
    }
    statistics: {
      playCount: number
      downloadCount: number
      shareCount: number
      commentCount: number
      likeCount: number
      favoriteCount: number
      forwardCount: number
      whatsappShareCount: number
      loseCount: number
      loseCommentCount: number
    }
    video?: string[]
    cover?: string[]
    dynamicCover?: string[]
    originCover: string[]
    images?: string[]
    music: {
      id: number
      title: string
      author: string
      album: string
      playUrl: string[]
      coverLarge: string[]
      coverMedium: string[]
      coverThumb: string[]
      duration: number
    }
  }
}
```

</details>
<details>
  <summary><b>Tiktok Downloader V2</b></summary>
  <br>

```ts
{
  status: "success" | "error"
  message?: string
  result?: {
    type: "video" | "image"
    description: string
    author: {
      nickname: string
      avatr: string
    }
    statistics: {
      likeCount: string
      commentCount: string
      shareCount: string
    }
    video?: string
    images?: string[]
    music: string
  }
}
```

</details>
<details>
  <summary><b>Tiktok Downloader V3</b></summary>
  <br>

```ts
{
  status: "success" | "error"
  message?: string
  result?: {
    type: "video" | "image"
    desc?: string
    author: {
      avatar?: string
      nickname: string
    }
    music?: string
    images?: string[]
    video1?: string
    video2?: string
    video_hd?: string
    video_watermark?: string
  }
}
```

</details>
<details>
  <summary><b>Tiktok Stalker</b></summary>
  <br>

```ts
{
  status: "success" | "error"
  message?: string
  result?: {
    users: {
      username: string
      nickname: string
      avatar: string
      signature: string
      verified: boolean
      region: string
    }
    stats: {
      followerCount: number
      followingCount: number
      heartCount: number
      videoCount: number
      likeCount: number
    }
    posts: Posts[]
  }
}
```

</details>
<br>

# Contributors

- [Nugraizy](https://github.com/nugraizy)
- [Aqul](https://github.com/zennn08)
