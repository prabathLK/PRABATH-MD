
const tx2 = require('..')
const should = require('should')

describe('Action', function() {
  it('should notify about new action', (done) => {
    tx2.once('data', (dt) => {
      should(dt.type).eql('axm:action')
      should(dt.data.action_name).eql('something special')
      done()
    })

    tx2.action('something special', (cb) => {
      cb({sucess:true})
    })
  })

})
