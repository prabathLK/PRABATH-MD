
var units = require('./units')
var EWMA  = require('./EWMA')

function Meter(opts) {
  var self = this

  this._tickInterval = units.SECONDS
  this._samples = opts.seconds || 1
  this._timeframe = opts.timeframe || 60

  this._rate     = new EWMA(units.SECONDS, this._tickInterval)

  this._interval = setInterval(function() {
    self._rate.tick()
  }, this._tickInterval)

  this._interval.unref()
}

Meter.RATE_UNIT     = units.SECONDS

Meter.prototype.mark = function(n) {
  n = n || 1

  this._rate.update(n)
}

Meter.prototype.val = function() {
  return Math.round(this._rate.rate(Meter.RATE_UNIT) * 100 ) / 100
}

module.exports = Meter
