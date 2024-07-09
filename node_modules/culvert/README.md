Culvert
=======

Channel for easy streaming of work between complex logics.

This is used in place of streams for CSP style flow.  I use it in js-git for network and file streams.

Usually, you'll want to split sides to create a duplex channel.

```js
var makeChannel = require('culvert');

var serverChannel = makeChannel();
var clientChannel = makeChannel();

function connect(host, port) {

  // This represents the server-side of the duplex pipe
  var socket = {
    put: serverChannel.put,
    drain: serverChannel.drain,
    take: cientChannel.drain
  };

  // When we want to send data to the consumer...
  socket.put(someData);

  // When we want to read from the consumer...
  socket.take(function (err, item) {});

  // Return the client's end of the pipe
  return {
    put: clientChannel.put,
    drain: clientChannel.drain,
    take: serverChannel.take
  };
}
```

If you want/need to preserve back-pressure and honor the buffer limit,
make sure to wait for drain when `put` returns false.

```js
// Start a read
socket.take(onData);

function onData(err, item) {
  if (err) throw err;
  if (item === undefined) {
    // End stream when nothing comes out
    console.log("done");
  }
  else if (socket.put(item)) {
    // If put returned true, keep reading
    socket.take(onData);
  }
  else {
    // Otherwise pause and wait for drain
    socket.drain(onDrain);
  }
}

function onDrain(err) {
  if (err) throw err;
  // Resume reading
  socket.take(onData);
}
```

If you're using continuables and generators, it's much nicer syntax.

```js
var item;
while (item = yield socket.take, item !== undefined) {
  if (!socket.put(item)) yield socket.drain;
}
console.log("done");
```

Also the continuable version won't blow the stack if lots of events come in on the same tick.

## makeChannel(bufferSize, monitor)

Create a new channel.

The optional bufferSize is how many items can be in the queue and still be considered not full.

The optional monitor function will get called with `(type, item)` where `type` is either "put" or "take" and `item` is the value being put or taken.

## channel.put(item) -> more

This is a sync function.  You can add as many items to the channel as you want and it will queue them up.

This returns `true` when the queue is smaller than bufferSize, it returns false if you should wait for drain.

## channel.drain(callback)

Drain is a reusable continuable.  Use this when you want to wait for the buffer to be below the bufferSize mark.

## channel.take(callback)

Take is for reading.  The callback will have the next item.  It may call sync or it may be later.
