
var helper = require("../../lib/helper.js");
var should = require("should");

describe('Helper', function () {

  const fixt = {
    a : {
      b : {
        c : 'result'
      }
    }
  }

  describe('.get', () => {
    should(helper.get(fixt, 'a.b.c')).eql('result')
  })

  describe('.get null', () => {
    should(helper.get(null, 'a.b.c')).eql(null)
  })

  describe('.get null', () => {
    should(helper.get(fixt, 'a.b.d')).eql(undefined)
  })
})
