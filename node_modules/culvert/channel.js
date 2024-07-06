"use strict";

module.exports = makeChannel;

function makeChannel(bufferSize, monitor) {
  bufferSize = bufferSize|0;
  var dataQueue = [];
  var readQueue = [];
  var drainList = [];

  if (typeof monitor === "string") {
    monitor = log(monitor);
  }

  return {
    drain: drain,
    put: put,
    take: take,
  };

  function drain(callback) {
    if (typeof callback !== "function") {
      throw new TypeError("callback must be function");
    }
    if (dataQueue.length <= bufferSize) return callback();
    drainList.push(callback);
  }

  // Returns true when it's safe to continue without draining
  function put(item) {
    if (monitor) monitor("put", item);
    if (readQueue.length) {
      if (monitor) monitor("take", item);
      readQueue.shift()(null, item);
    }
    else {
      dataQueue.push(item);
    }
    return dataQueue.length <= bufferSize;
  }

  function take(callback) {
    if (typeof callback !== "function") {
      throw new TypeError("callback must be function");
    }
    if (dataQueue.length) {
      var item = dataQueue.shift();
      if (monitor) monitor("take", item);
      callback(null, item);
      if (dataQueue.length <= bufferSize && drainList.length) {
        var list = drainList;
        drainList = [];
        for (var i = 0; i < list.length; i++) {
          list[i]();
        }
      }
      return;
    }
    readQueue.push(callback);
  }
}

function log(name) {
  return function (type, value) {
    console.info(name, type, value);
  };
}
