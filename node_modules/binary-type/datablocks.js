// this is a list of the mimetype => [header, trailer] associations
// information has been collected from the following resource site:
// http://www.garykessler.net/library/file_sigs.html
module.exports = {
  application: {
    // TODO: support checking for the trailers (4 variations)
    pdf: [ '25 50 44 46' ]
  },

  image: {
    bmp: [ '42 4D' ],
    gif: [ '47 49 46 38 39 61', '00 3B' ], // gif89a at the moment
    jpeg: ['FF D8 FF', 'FF D9' ],
    png: [ '89 50 4E 47 0D 0A 1A 0A', '49 45 4E 44 AE 42 60 82' ]
  },

  audio: {
    ogg: [ '4F 67 67 53 00 02 00 00 00 00 00 00 00 00' ]
  }
};

