should  = require 'should'

describe 'is standard emoji::', ->

  it "works with emoji", ->
    isEmoji = require('..')
    isEmoji('📣').should.be.equal(true)

  it 'works without emojis', ->
    isEmoji = require('..')
    isEmoji('unicorn').should.be.equal(false)
