
const tx2 = require('..')
const should = require('should')

describe('Event', function() {
  it('should emit an event without data', (done) => {
    tx2.once('data', (dt) => {
      should(dt.type).eql('human:event')
      done()
    })

    tx2.event('something special')
  })

  it('should emit an event with data', (done) => {
    tx2.once('data', (dt) => {
      should(dt.type).eql('human:event')
      should(dt.data.yes).eql(true)
      done()
    })

    tx2.event('something special', { yes : true })
  })

})
