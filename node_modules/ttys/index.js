
var fs = require('fs')
var tty = require('tty')
var assert = require('assert')

if (tty.isatty(0)) {
  exports.stdin = process.stdin
} else {
  var ttyFd = fs.openSync('/dev/tty', 'r')
  assert(tty.isatty(ttyFd))
  exports.stdin = new tty.ReadStream(ttyFd)
  exports.stdin._type = 'tty'
}

if (tty.isatty(1)) {
  exports.stdout = process.stdout
} else {
  var ttyFd = fs.openSync('/dev/tty', 'w')
  assert(tty.isatty(ttyFd))
  exports.stdout = new tty.WriteStream(ttyFd)
  exports.stdout._type = 'tty'

  // Hack to have the stdout stream not keep the event loop alive.
  // See: https://github.com/joyent/node/issues/1726
  // XXX: remove/fix this once src/node.js does something different as well.
  if (exports.stdout._handle && exports.stdout._handle.unref) {
    exports.stdout._handle.unref();
  }
}
