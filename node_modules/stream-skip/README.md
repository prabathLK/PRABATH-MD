# stream-skip
node.js transform stream to skip first N bytes

## Usage

```javascript
var StreamSkip = require("stream-skip")
var sstream = new StreamSkip({ skip: bytes })

// example
myStream.pipe(sstream).pipe(stdout)

```

