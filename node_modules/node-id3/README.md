# node-id3

![GitHub package.json version](https://img.shields.io/github/package-json/v/zazama/node-id3?style=flat-square)
![Travis (.org)](https://img.shields.io/travis/zazama/node-id3?style=flat-square)
![Codecov](https://img.shields.io/codecov/c/github/Zazama/node-id3?style=flat-square)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability-percentage/Zazama/node-id3?style=flat-square)
![npm](https://img.shields.io/npm/dt/node-id3?style=flat-square)

node-id3 is an ID3-Tag library written in JavaScript.

## Installation

```sh
npm install node-id3
```

## Usage

```javascript
const NodeID3 = require('node-id3')

/* Variables found in the following usage examples */

const filebuffer = Buffer.from("Some Buffer of a (mp3) file")
const filepath = './path/to/(mp3)file'

const tags = {
    title: "Tomorrow",
    artist: "Kevin Penkin",
    album: "TVアニメ「メイドインアビス」オリジナルサウンドトラック",
    APIC: "./example/mia_cover.jpg",
    TRCK: "27"
}
```

### Write tags to file

If you have an existing file/buffer (e.g. an mp3 file) you can use the write method to write your tags into it. It will remove existing tags and add yours.

```javascript
const success = NodeID3.write(tags, filepath) // Returns true/Error
// async version
NodeID3.write(tags, file, function(err) {  })
```

### Write tags to filebuffer

```javascript
const success = NodeID3.write(tags, filebuffer) // Returns Buffer
// async version
NodeID3.write(tags, file, function(err, buffer) {  })
```

### Update existing tags of file or buffer

The update method works like the write method but will keep or overwrite existing tags instead of removing them.

```javascript
const success = NodeID3.update(tags, filepath) //  Returns true/Error
const success = NodeID3.update(tags, filebuffer) //  Returns Buffer
NodeID3.update(tags, filepath, function(err, buffer) {  })
NodeID3.update(tags, filebuffer, function(err, buffer) {  })

// Possible options
const options = {
    include: ['TALB', 'TIT2'],    // only read the specified tags (default: all)
    exclude: ['APIC']            // don't read the specified tags (default: [])
}

NodeID3.update(tags, filepath, options)
const success = NodeID3.update(tags, filebuffer, options)
NodeID3.update(tags, filepath, options, function(err, buffer) {  })
NodeID3.update(tags, filebuffer, options, function(err, buffer) {  })
```

### Create tags as buffer

The create method will return a buffer of your ID3-Tag. You can use it to e.g. write it into a file yourself instead of using the write method.

```javascript
const success = NodeID3.create(tags) // Returns ID3-Tag Buffer
// async version
NodeID3.create(tags, function(buffer) {  })
```

### Reading ID3-Tags

```javascript
const tags = NodeID3.read(file)
NodeID3.read(file, function(err, tags) {})
/*
    tags: {
        title: "Tomorrow",
        artist: "Kevin Penkin",
        image: {
          mime: "image/jpeg",
          type: {
            id: 3,
            name: "front cover"
          },
          description: String,
          imageBuffer: Buffer
        },
        raw: {
          TIT2: "Tomorrow",
          TPE1: "Kevin Penkin",
          APIC: Object (See above)
        }
      }
*/

// Possible options
const options = {
    include: ['TALB', 'TIT2'],    // only read the specified tags (default: all)
    exclude: ['APIC'],            // don't read the specified tags (default: [])
    onlyRaw: false,               // only return raw object (default: false)
    noRaw: false                  // don't generate raw object (default: false)
}
const tags = NodeID3.read(file, options)
```

### Removing ID3-Tags from file/buffer

```javascript
const success = NodeID3.removeTags(filepath)  //  returns true/Error
NodeID3.removeTags(filepath, function(err) {  })

let bufferWithoutID3Frame = NodeID3.removeTagsFromBuffer(filebuffer)  //  Returns Buffer
```

### Using Promises (available starting with v0.2)

```javascript
const NodeID3Promise = require('node-id3').Promise

NodeID3.write(tags, fileOrBuffer)
NodeID3.update(tags, fileOrBuffer)
NodeID3.create(tags)
NodeID3.read(filepath)
NodeID3.removeTags(filepath)
```

## Supported aliases/fields

```text
album:
bpm:
composer:
genre:
copyright:
encodingTime:
date:
playlistDelay:
originalReleaseTime:
recordingTime:
releaseTime:
taggingTime:
encodedBy:
textWriter:
fileType:
involvedPeopleList:
time:
contentGroup:
title:
subtitle:
initialKey:
language:
length:
musicianCreditsList:
mediaType:
mood:
originalTitle:
originalFilename:
originalTextwriter:
originalArtist:
originalYear:
fileOwner:
artist:
performerInfo: // (album artist)
conductor:
remixArtist:
partOfSet:
producedNotice:
publisher:
trackNumber:
recordingDates:
internetRadioName:
internetRadioOwner:
albumSortOrder:
performerSortOrder:
titleSortOrder:
size:
ISRC:
encodingTechnology:
setSubtitle:
year:
comment: {
  language: "eng",
  text: "mycomment"
}
unsynchronisedLyrics: {
  language: "eng",
  text: "lyrics"
}
// See https://id3.org/ documentation for more details.
synchronisedLyrics: [{
  language: "eng",
  timeStampFormat: TagConstants.TimeStampFormat.MILLISECONDS,
  contentType: TagConstants.SynchronisedLyrics.ContentType.LYRICS,
  shortText: "Content descriptor",
  synchronisedText: [{
    text: "part 1",
    timeStamp: 0 // Must be a positive integer value
  }, {
    text: "part 2",
    timeStamp: 1000 // Must be a positive integer value
  }]
}]
userDefinedText: [{
  description: "txxx name",
  value: "TXXX value text"
}, {
  description: "txxx name 2",
  value: "TXXX value text 2"
}] // Care, update doesn't delete non-passed array items!
image: {
  mime: "image/png",
  type: {
    id: TagConstants.AttachedPicture.PictureType.FRONT_COVER
  }, // See https://en.wikipedia.org/wiki/ID3#ID3v2_embedded_image_extension
  description: "image description",
  imageBuffer: (file buffer)
},
popularimeter: {
  email: "mail@example.com",
  rating: 192,  // 1-255
  counter: 12
},
private: [{
  ownerIdentifier: "AbC",
  data: "asdoahwdiohawdaw"
}, {
  ownerIdentifier: "AbCSSS",
  data: Buffer.from([0x01, 0x02, 0x05])
}],
uniqueFileIdentifier: [{
  ownerIdentifier: "owner-id-1",
  identifier: Buffer.from("identifier-1")
}], {
  ownerIdentifier: "owner-id-2",
  identifier: Buffer.from("identifier-2")
},
chapter: [{
  elementID: "Hey!", // THIS MUST BE UNIQUE!
  startTimeMs: 5000,
  endTimeMs: 8000,
  startOffsetBytes: 123, // OPTIONAL!
  endOffsetBytes: 456,   // OPTIONAL!
  tags: {                // OPTIONAL
    title: "abcdef",
    artist: "akshdas"
  }
}],
tableOfContents: [{
  elementID: "toc1",    // THIS MUST BE UNIQUE!
  isOrdered: false,     // OPTIONAL, tells a player etc. if elements are in a specific order
  elements: ['chap1'],  // OPTIONAL but most likely needed, contains the chapter/tableOfContents elementIDs
  tags: {               // OPTIONAL
    title: "abcdef"
  }
}],
commercialUrl: ["commercialurl.com"], // array or single string
copyrightUrl: "example.com",
fileUrl: "example.com",
artistUrl: ["example.com"], // array or single string
audioSourceUrl: "example.com",
radioStationUrl: "example.com",
paymentUrl: "example.com",
publisherUrl: "example.com",
userDefinedUrl: [{
  description: "URL description"
  url: "https://example.com/"
}], // array or single object
eventTimingCodes: {
  timeStampFormat: TagConstants.TimeStampFormat.MILLISECONDS,
  keyEvents: [{
    type: TagConstants.EventTimingCodes.EventType.INTRO_START,
    timeStamp: 1000 // Must be a positive integer value
  }]
},
commercialFrame: [{
  prices: {
    'EUR': 15,
    'DKK': 17.922
  },
  validUntil: { year: 2023, month: 9, day: 1},
  contactUrl: 'https://example.com',
  receivedAs: TagConstants.CommercialFrame.ReceivedAs.OTHER,
  nameOfSeller: 'Someone',
  description: 'Something',
  sellerLogo: {
    mimeType: 'image/',
    picture: Buffer.alloc(15, 0x13)
  }
}]
```

### Supported raw IDs

You can also use the currently supported raw tags like TALB instead of album etc.

```text
album:                "TALB"
bpm:                  "TBPM"
composer:             "TCOM"
genre:                "TCON"
copyright:            "TCOP"
date:                 "TDAT"
encodingTime:         "TDEN"
playlistDelay:        "TDLY"
originalReleaseTime:  "TDOR"
recordingTime:        "TDRC"
releaseTime:          "TDRL"
taggingTime:          "TDTG"
encodedBy:            "TENC"
textWriter:           "TEXT"
fileType:             "TFLT"
time:                 "TIME"
involvedPeopleList:   "TIPL"
contentGroup:         "TIT1"
title:                "TIT2"
subtitle:             "TIT3"
initialKey:           "TKEY"
language:             "TLAN"
length:               "TLEN"
musicianCreditsList:  "TMCL"
mediaType:            "TMED"
mood:                 "TMOO"
originalTitle:        "TOAL"
originalFilename:     "TOFN"
originalTextwriter:   "TOLY"
originalArtist:       "TOPE"
originalYear:         "TORY"
fileOwner:            "TOWN"
artist:               "TPE1"
performerInfo:        "TPE2"    (album artist)
conductor:            "TPE3"
remixArtist:          "TPE4"
partOfSet:            "TPOS"
producedNotice:       "TPRO"
publisher:            "TPUB"
trackNumber:          "TRCK"
recordingDates:       "TRDA"
internetRadioName:    "TRSN"
internetRadioOwner:   "TRSO"
size:                 "TSIZ"
albumSortOrder:       "TSOA"
performerSortOrder:   "TSOP"
titleSortOrder:       "TSOT"
ISRC:                 "TSRC"
encodingTechnology:   "TSSE"
setSubtitle:          "TSST"
year:                 "TYER"
comment:              "COMM"
image:                "APIC"
unsynchronisedLyrics  "USLT"
synchronisedLyrics    "SYLT"
userDefinedText       "TXXX"
popularimeter         "POPM"
private               "PRIV"
uniqueFileIdentifier  "UFID"
chapter               "CHAP"
tableOfContents       "CTOC"
commercialUrl         "WCOM"
copyrightUrl          "WCOP"
fileUrl               "WOAF"
artistUrl             "WOAR"
audioSourceUrl        "WOAS"
radioStationUrl       "WORS"
paymentUrl            "WPAY"
publisherUrl          "WPUB"
userDefinedUrl        "WXXX"
eventTimingCodes      "ETCO"
commercialFrame       "COMR"
```
