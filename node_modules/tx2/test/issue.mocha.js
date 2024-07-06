
const tx2 = require('..')
const should = require('should')

describe('Issue', function() {
  it('should trigger an issue', (done) => {
    tx2.once('data', (dt) => {
      should(dt.type).eql('process:exception')
      should(dt.stack).not.eql(null)
      done()
    })

    tx2.issue(new Error('shit happens'))
  })

  it('should trigger an issue v2', (done) => {
    tx2.once('data', (dt) => {
      should(dt.type).eql('process:exception')
      should(dt.stack).not.eql(null)
      done()
    })

    tx2.issue('shit happens')
  })
})
