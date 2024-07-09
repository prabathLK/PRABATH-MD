/* eslint-env mocha */

'use strict'

const assert = require('assert')
const crypto = require('crypto')

const arrayBufferToHex = require('array-buffer-to-hex')

const digestSync = require('./')

describe('sha256', () => {
  for (let byteLength = 0; byteLength <= 600; byteLength++) {
    it(`should hash ${byteLength} bytes of data`, () => {
      for (let i = 0; i < 32; i++) {
        const buffer = crypto.randomBytes(byteLength)
        const actual = arrayBufferToHex(digestSync('SHA-256', buffer.buffer))
        const expected = crypto.createHash('sha256').update(buffer).digest('hex')

        assert.strictEqual(actual, expected)
      }
    })
  }
})
