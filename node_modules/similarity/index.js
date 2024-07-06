'use strict'

var levenshtein = require('levenshtein-edit-distance')

module.exports = similarity

function similarity(a, b, options) {
  var left = a || ''
  var right = b || ''
  var insensitive = !(options || {}).sensitive
  var longest = Math.max(left.length, right.length)

  return longest === 0
    ? 1
    : (longest - levenshtein(left, right, insensitive)) / longest
}
