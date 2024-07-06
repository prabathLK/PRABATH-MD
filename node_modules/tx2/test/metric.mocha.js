
const tx2 = require('..')
const should = require('should')

describe('Metric', function() {
  this.timeout(4000)

  it('should register a metric', () => {
    tx2.metric({
      name: 'test',
      val: () => {
        return 20
      }
    })
  })

  it('should metric exists', () => {
    should(tx2.metricExists('test')).eql(true)
  })

  it('should unknown metric not exists', () => {
    should(tx2.metricExists('unknowsss')).eql(false)
  })

  it('should have metric present', (done) => {
    tx2.once('data', (dt) => {
      should(dt.type).eql('axm:monitor')
      should(dt.data.test.value).eql(20)
      done()
    })
  })

  it('should register metric v2', () => {
    tx2.metric('test2', () => {
      return 30
    })
  })

  it('should have metric present', (done) => {
    tx2.once('data', (dt) => {
      should(dt.type).eql('axm:monitor')
      should(dt.data.test2.value).eql(30)
      done()
    })
  })

  it('should register metric v3', () => {
    let m = tx2.metric('test3', 0)
    m.set(45)
  })

  it('should have metric present', (done) => {
    tx2.once('data', (dt) => {
      should(dt.type).eql('axm:monitor')
      should(dt.data.test3.value).eql(45)
      done()
    })
  })

})

describe('counter', () => {
  describe('inc', () => {
    const test = ({incBy, expectedValue}) => () => {
      const counter = tx2.counter('Test counter')
      counter.inc(incBy)
      should(counter.val()).eql(expectedValue)
    }

    it('should increment by 1 when called with no arguments', test({expectedValue: 1}))
    it('should increment by 1 when called with 1', test({incBy: 1, expectedValue: 1}))
    it('should increment by -1 when called with -1', test({incBy: -1, expectedValue: -1}))
    it('should increment by 0 when called with 0', test({incBy: 0, expectedValue: 0}))
    it('should increment by 17.3 when called with 17.3', test({incBy: 17.3, expectedValue: 17.3}))
  })

  describe('dec', () => {
    const test = ({decBy, expectedValue}) => () => {
      const counter = tx2.counter('Test counter')
      counter.dec(decBy)
      should(counter.val()).eql(expectedValue)
    }

    it('should decrement by 1 when called with no arguments', test({expectedValue: -1}))
    it('should decrement by 1 when called with 1', test({decBy: 1, expectedValue: -1}))
    it('should decrement by -1 when called with -1', test({decBy: 1, expectedValue: -1}))
    it('should decrement by 0 when called with 0', test({decBy: 0, expectedValue: 0}))
    it('should decrement by 17.3 when called with 17.3', test({decBy: 17.3, expectedValue: -17.3}))
  })
})
