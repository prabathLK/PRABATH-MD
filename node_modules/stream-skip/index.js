var stream = require('stream')
var util = require('util')

var Transform = stream.Transform

function Skip(options) {
	// allow use without new
	if (!(this instanceof Skip)) {
		return new Skip(options);
	}

	this._toSkip = options.skip

	// init Transform
	Transform.call(this, options);
}
util.inherits(Skip, Transform);

Skip.prototype._transform = function (chunk, enc, cb) {
	if (this._toSkip == 0) this.push(chunk)
	else if (this._toSkip > chunk.length) {
		this._toSkip -= chunk.length;
	} else {
		if (this._toSkip !== chunk.length) this.push(chunk.slice(this._toSkip))
		this._toSkip = 0;
	}
	cb();
};

module.exports = Skip;