
module.exports = Counter;

function Counter(opts) {
  opts = opts || {};

  this._count = opts.count || 0;
}

Counter.prototype.val = function() {
  return this._count;
};

Counter.prototype.inc = function(n) {
  const incBy = n == null ? 1 : n
  this._count += incBy;
};

Counter.prototype.dec = function(n) {
  const decBy = n == null ? 1 : n
  this._count -= decBy;
};

Counter.prototype.reset = function(count) {
  this._count = count || 0;
};
