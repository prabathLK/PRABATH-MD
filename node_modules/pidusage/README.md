# pidusage

[![Lint](https://github.com/soyuka/pidusage/workflows/lint/badge.svg?branch=main)](https://github.com/soyuka/pidusage/actions?query=workflow:lint+branch:main)
[![MacOS](https://github.com/soyuka/pidusage/workflows/test-macos/badge.svg?branch=main)](https://github.com/soyuka/pidusage/actions?query=workflow:test-macos+branch:main)
[![Ubuntu](https://github.com/soyuka/pidusage/workflows/linux/badge.svg?branch=main)](https://github.com/soyuka/pidusage/actions?query=workflow:linux+branch:main)
[![Windows](https://github.com/soyuka/pidusage/workflows/test-windows/badge.svg?branch=main)](https://github.com/soyuka/pidusage/actions?query=workflow:test-windows+branch:main)
[![Alpine](https://github.com/soyuka/pidusage/workflows/test-alpine/badge.svg?branch=main)](https://github.com/soyuka/pidusage/actions?query=workflow:test-alpine+branch:main)
[![Code coverage](https://img.shields.io/codecov/c/github/soyuka/pidusage/master.svg)](https://codecov.io/gh/soyuka/pidusage)
[![npm version](https://img.shields.io/npm/v/pidusage.svg)](https://www.npmjs.com/package/pidusage)
[![license](https://img.shields.io/github/license/soyuka/pidusage.svg)](https://github.com/soyuka/pidusage/tree/master/license)

Cross-platform process cpu % and memory usage of a PID.

## Synopsis

Ideas from https://github.com/arunoda/node-usage but with no C-bindings.

Please note that if you need to check a Node.JS script process cpu and memory usage, you can use [`process.cpuUsage`][node:cpuUsage] and [`process.memoryUsage`][node:memUsage] since node v6.1.0. This script remain useful when you have no control over the remote script, or if the process is not a Node.JS process.


## Usage

```js
var pidusage = require('pidusage')

pidusage(process.pid, function (err, stats) {
  console.log(stats)
  // => {
  //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
  //   memory: 357306368,    // bytes
  //   ppid: 312,            // PPID
  //   pid: 727,             // PID
  //   ctime: 867000,        // ms user + system time
  //   elapsed: 6650000,     // ms since the start of the process
  //   timestamp: 864000000  // ms since epoch
  // }
  cb()
})

// It supports also multiple pids
pidusage([727, 1234], function (err, stats) {
  console.log(stats)
  // => {
  //   727: {
  //     cpu: 10.0,            // percentage (from 0 to 100*vcore)
  //     memory: 357306368,    // bytes
  //     ppid: 312,            // PPID
  //     pid: 727,             // PID
  //     ctime: 867000,        // ms user + system time
  //     elapsed: 6650000,     // ms since the start of the process
  //     timestamp: 864000000  // ms since epoch
  //   },
  //   1234: {
  //     cpu: 0.1,             // percentage (from 0 to 100*vcore)
  //     memory: 3846144,      // bytes
  //     ppid: 727,            // PPID
  //     pid: 1234,            // PID
  //     ctime: 0,             // ms user + system time
  //     elapsed: 20000,       // ms since the start of the process
  //     timestamp: 864000000  // ms since epoch
  //   }
  // }
})

// If no callback is given it returns a promise instead
const stats = await pidusage(process.pid)
console.log(stats)
// => {
//   cpu: 10.0,            // percentage (from 0 to 100*vcore)
//   memory: 357306368,    // bytes
//   ppid: 312,            // PPID
//   pid: 727,             // PID
//   ctime: 867000,        // ms user + system time
//   elapsed: 6650000,     // ms since the start of the process
//   timestamp: 864000000  // ms since epoch
// }

// Avoid using setInterval as they could overlap with asynchronous processing
function compute(cb) {
  pidusage(process.pid, function (err, stats) {
    console.log(stats)
    // => {
    //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
    //   memory: 357306368,    // bytes
    //   ppid: 312,            // PPID
    //   pid: 727,             // PID
    //   ctime: 867000,        // ms user + system time
    //   elapsed: 6650000,     // ms since the start of the process
    //   timestamp: 864000000  // ms since epoch
    // }
    cb()
  })
}

function interval(time) {
  setTimeout(function() {
    compute(function() {
      interval(time)
    })
  }, time)
}

// Compute statistics every second:
interval(1000)

// Above example using async/await
const compute = async () => {
  const stats = await pidusage(process.pid)
  // do something
}

// Compute statistics every second:
const interval = async (time) => {
  setTimeout(async () => {
    await compute()
    interval(time)
  }, time)
}

interval(1000)
```

## Compatibility

| Property | Linux | FreeBSD | NetBSD | SunOS | macOS | Win | AIX | Alpine
| ---         | --- | --- | --- | --- | --- | --- | --- | --- |
| `cpu`       | ✅ | ❓ | ❓ | ❓ | ✅ | ℹ️ | ❓ | ✅ |
| `memory`    | ✅ | ❓ | ❓ | ❓ | ✅ | ✅ | ❓ | ✅ |
| `pid`       | ✅ | ❓ | ❓ | ❓ | ✅ | ✅ | ❓ | ✅ |
| `ctime`     | ✅ | ❓ | ❓ | ❓ | ✅ | ✅ | ❓ | ✅ |
| `elapsed`   | ✅ | ❓ | ❓ | ❓ | ✅ | ✅ | ❓ | ✅ |
| `timestamp` | ✅ | ❓ | ❓ | ❓ | ✅ | ✅ | ❓ | ✅ |

✅ = Working
ℹ️ = Not Accurate
❓ = Should Work
❌ = Not Working

Please if your platform is not supported or if you have reported wrong readings
[file an issue][new issue].

By default, pidusage will use `procfile` parsing on most unix systems. If you want to use `ps` instead use the `usePs` option:

```
pidusage(pid, {usePs: true})
```

## API

<a name="pidusage"></a>

### pidusage(pids, [options = {}], [callback]) ⇒ <code>[Promise.&lt;Object&gt;]</code>
Get pid informations.

**Kind**: global function
**Returns**: <code>Promise.&lt;Object&gt;</code> - Only when the callback is not provided.
**Access**: public

| Param | Type | Description |
| --- | --- | --- |
| pids | <code>Number</code> \| <code>Array.&lt;Number&gt;</code> \| <code>String</code> \| <code>Array.&lt;String&gt;</code> | A pid or a list of pids. |
| [options] | <code>object</code> | Options object. See the table below. |
| [callback] | <code>function</code> | Called when the statistics are ready. If not provided a promise is returned instead. |

### options

Setting the options programatically will override environment variables

| Param | Type | Environment variable | Default | Description |
| --- | --- | --- | --- | --- |
| [usePs] | <code>boolean</code> | `PIDUSAGE_USE_PS`| `false` | When true uses `ps` instead of proc files to fetch process information |
| [maxage] | <code>number</code> | `PIDUSAGE_MAXAGE`| `60000` | Max age of a process on history. |

`PIDUSAGE_SILENT=1` can be used to remove every console message triggered by pidusage.

### pidusage.clear()

If needed this function can be used to delete all in-memory metrics and clear the event loop. This is not necessary before exiting as the interval we're registring does not hold up the event loop.

## Related
- [pidusage-tree][gh:pidusage-tree] -
Compute a pidusage tree

## Authors
- **Antoine Bluchet** - [soyuka][github:soyuka]
- **Simone Primarosa** - [simonepri][github:simonepri]

See also the list of [contributors][contributors] who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE][license] file for details.

<!-- Links -->
[new issue]: https://github.com/soyuka/pidusage/issues/new
[license]: https://github.com/soyuka/pidusage/tree/master/LICENSE
[contributors]: https://github.com/soyuka/pidusage/contributors

[github:soyuka]: https://github.com/soyuka
[github:simonepri]: https://github.com/simonepri

[gh:pidusage-tree]: https://github.com/soyuka/pidusage-tree

[node:cpuUsage]: https://nodejs.org/api/process.html#process_process_cpuusage_previousvalue
[node:memUsage]: https://nodejs.org/api/process.html#process_process_memoryusage
