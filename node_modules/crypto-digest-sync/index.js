/* global DOMException */

'use strict'

const sha256 = require('./sha256')

module.exports = function digestSync (algo, buffer) {
  if (algo === 'SHA-256') return sha256(buffer)

  if (typeof DOMException !== 'undefined') {
    throw new DOMException('The operation is not supported.', 'NotSupportedError')
  } else {
    throw Object.assign(new Error('The operation is not supported.'), {
      name: 'NotSupportedError',
      code: 9
    })
  }
}
