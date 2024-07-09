'use strict';

var emojis = require('emojis-list');

module.exports = function(emoji) {
  return emojis.indexOf(emoji) !== -1;
};
