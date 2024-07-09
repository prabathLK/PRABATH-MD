"use strict";

module.exports = consume;

function consume(channel, emit) {
  return function (callback) {
    channel.take(onItem);
    function onItem(err, item) {
      if (item === undefined) return callback(err);
      try { emit(item); }
      catch (err) { return callback(err); }
      channel.take(onItem);
    }
  };
}
