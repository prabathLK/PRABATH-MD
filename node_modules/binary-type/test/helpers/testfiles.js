var fs = require('fs');

module.exports = {
  bmp: fs.readFileSync(__dirname + '/butterfly.bmp'),
  gif: fs.readFileSync(__dirname + '/construction.gif'),
  jpeg: fs.readFileSync(__dirname + '/1_rocinha_night_2014_panorama.jpg'),
  jpeg2: fs.readFileSync(__dirname + '/github-avatar.jpg'),
  png: fs.readFileSync(__dirname + '/Open_Source_Media_Framework_Logo.png'),
  pdf: fs.readFileSync(__dirname + '/helloworld.pdf'),
  pdfLineFeed: fs.readFileSync(__dirname + '/helloworld_linefeed.pdf'),
  ogg: fs.readFileSync(__dirname + '/Mudchute_cow_1.ogg')
};
