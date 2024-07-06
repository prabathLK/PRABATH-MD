<div align="center">
  <a href="http://pm2.keymetrics.io">
    <img width=411px src="https://raw.githubusercontent.com/keymetrics/pm2-io-apm/master/pres/io-white.png">
  </a>
  <br/>

<br/>
<br/>
</div>


The [@pm2/io](https://github.com/keymetrics/pm2-io-apm/tree/master/test) module comes along with PM2. It is the PM2 library responsible for gathering the metrics, reporting exceptions, exposing remote actions and every interaction with your application.

You can also use it as a standalone agent, if you want to connect your nodejs process to PM2 Enterprise but without having to launch your application with PM2.

# Table of Contents

- [**Installation**](https://github.com/keymetrics/pm2-io-apm/tree/master#installation)
- [**Expose Custom Metrics**](https://github.com/keymetrics/pm2-io-apm/tree/master#expose-custom-metrics)
- [**Expose Remote Actions**](https://github.com/keymetrics/pm2-io-apm#expose-remote-actions-trigger-functions-remotely)
- [**Report Custom Errors**](https://github.com/keymetrics/pm2-io-apm#report-user-error)
- [**Distributed Tracing**](https://github.com/keymetrics/pm2-io-apm#distributed-tracing)
- [**Configuration**](https://github.com/keymetrics/pm2-io-apm/tree/master#configuration)
- [**Migration Guide**](https://github.com/keymetrics/pm2-io-apm#migration-guides)
- [**Development**](https://github.com/keymetrics/pm2-io-apm/tree/master#development)
- [**Notes**](https://github.com/keymetrics/pm2-io-apm/tree/master#notes)


# Installation

With npm:

```bash
npm install @pm2/io --save
```

With yarn:

```bash
yarn add @pm2/io
```

## V8 Runtime Metrics

To retrieve by default V8 Runtime metrics like:
- V8 Garbage Collector metrics
- [CPU Context Switch](https://unix.stackexchange.com/questions/442969/what-exactly-are-voluntary-context-switches)
- [Page Fault](https://en.wikipedia.org/wiki/Page_fault#Types)

Install:

```bash
npm install @pm2/node-runtime-stats
```

And restart the application.

## Custom Metrics

@pm2/io allows you to gather metrics from your code to be reported in the PM2 Plus/Enterprise dashboard.

### Create a custom metrics

You can create a new custom metrics with the method `metric()` of `@pm2/io`.

```javascript
const io = require('@pm2/io');

const users = io.metric({
  name: 'Realtime user',
});
users.set(10)
```

This arguments are available:

- **name**: The metric name (required; string)
- **id**: The type of metric (default 'metric', string)
- **unit**: unit of the measure (default ''; string)
- **historic**: keep the history in PM2 Plus (default: true; boolean)

There are 4 different types of metrics:

- **gauge**: To expose a variable's value
- **counter**: A discrete counter to be triggered manually to count a number of occurrence
- **meter**: To measure a frequency, a number of occurrences of a repeating event per unit of time
- **histogram**: To measure a statistic, a statistic on a metric over the last 5 minutes

### Metric: Variable Exposition

The first type of metric, called `metric`, allows to expose a variable's value. The variable can be exposed passively, with a function that gets called every second, or actively, with a method that you use to update the value.

#### Active Mode

In active mode, you need to create a probe and call the method `set()` to update the value.

```javascript
const myMetric = io.metric({
  name: 'Realtime Value'
});

myMetric.set(23);
```

#### Passive Mode

In passive mode you hust need to return the variable to be monitored:

```javascript
const myMetric = io.metric({
  name: 'Realtime Value',
  value: () => {
    return variable_to_monitor
  }
});
```

### Counter: Discrete Counter

The second type of metric, called `counter`, is a discrete counter that helps you count the number of occurrence of a particular event. The counter starts at 0 and can be incremented or decremented.

```javascript
const io = require('@pm2/io');

const currentReq = io.counter({
  name: 'Current req processed',
  type: 'counter',
});

http.createServer((req, res) => {
  // Increment the counter, counter will eq 1
  currentReq.inc();
  req.on('end', () => {
    // Decrement the counter, counter will eq 0
    currentReq.dec();
  });
});
```

### Meter: Frequency

The third type of metric, called `meter`, compute the frequency of an event. Each time the event happens, you need to call the `mark()` method. By default, the frequency is the number of events per second over the last minute.

```javascript
const io = require('@pm2/io');

const reqsec = io.meter({
  name: 'req/sec',
  type: 'meter',
});

http.createServer((req, res) => {
  reqsec.mark();
  res.end({ success: true });
});
```

Additional options:
- **samples**: (optional)(default: 1) Rate unit. Defaults to **1** sec.
- **timeframe**: (optional)(default: 60) Timeframe over which the events will be analyzed. Defaults to **60** sec.

### Histogram: Statistics

Collect values and provide statistic tools to explore their distribution over the last 5 minutes.

```javascript
const io = require('@pm2/io');

const latency = io.histogram({
  name: 'latency',
  measurement: 'mean'
});

var latencyValue = 0;

setInterval(() => {
  latencyValue = Math.round(Math.random() * 100);
  latency.update(latencyValue);
}, 100);
```

Options are:
- **measurement** : default: mean; min, max, sum, count, variance, mean, stddev, median, p75, p95, p99, p99.

## Expose Remote Actions: Trigger Functions remotely

Remotely trigger functions from PM2 Plus or Enterprise.

### Simple actions

The function takes a function as a parameter (cb here) and need to be called once the job is finished.

Example:

```javascript
const io = require('@pm2/io');

io.action('db:clean', (cb) => {
  clean.db(() => {
    // cb must be called at the end of the action
    return cb({ success: true });
  });
});
```

## Report user error

By default, in the Issue tab, you are only alerted for uncaught exceptions. Any exception that you catch is not reported. You can manually report them with the `notifyError()` method.

```javascript
const io = require('@pm2/io');

io.notifyError(new Error('This is an error'), {
  // you can some http context that will be reported in the UI
  http: {
    url: req.url
  },
  // or anything that you can like an user id
  custom: {
    user: req.user.id
  }
});
```

#### Express error reporting

If you want you can configure your express middleware to automatically send you an error with the error middleware of express :

```javascript
const io = require('@pm2/io')
const express = require('express')
const app = express()

// add the routes that you want
app.use('/toto', () => {
  throw new Error('ajdoijerr')
})

// always add the middleware as the last one
app.use(io.expressErrorHandler())
```

#### Koa error reporting

We also expose a custom koa middleware to report error with a specific koa middleware :

```javascript
const io = require('@pm2/io')
const Koa = require('koa')
const app = new Koa()

// the order isn't important with koa
app.use(pmx.koaErrorHandler())

// add the routes that you want
app.use(async ctx => {
  ctx.throw(new Error('toto'))
})
```

## Distributed Tracing

The Distributed Tracing allows to captures and propagates distributed traces through your system, allowing you to visualize how customer requests flow across services, rapidly perform deep root cause analysis, and better analyze latency across a highly distributed set of services.
If you want to enable it, here the simple options to enable:


```javascript
const io = require('@pm2/io').init({
  tracing: {
    enabled: true,
    // will add the actual queries made to database, false by default
    detailedDatabasesCalls: true,
    // if you want you can ignore some endpoint based on their path
    ignoreIncomingPaths: [
      // can be a regex
      /misc/,
      // or a exact string
      '/api/bucket'
      // or a function with the request
      (url, request) => {
        return true
      }
    ],
    // same as above but used to match entire URLs
    ignoreOutgoingUrls: [],
    /**
     * Determines the probability of a request to be traced. Ranges from 0.0 to 1.0
     * default is 0.5
     */
    samplingRate: 0.5
  }
})
```

By default we ignore specific incoming requests (you can override this by setting `ignoreIncomingPaths: []`):
- Request with the OPTIONS or HEAD method
- Request fetching a static ressources (`*.js`, `*.css`, `*.ico`, `*.svg`, `.png` or `*webpack*`)

### What's get traced

When your application will receive a request from either `http`, `https` or `http2` it will start a trace. After that, we will trace the following modules:
 - `http` outgoing requests
 - `https` outgoing requests
 - `http2` outgoing requests
 - `mongodb-core` version 1 - 3
 - `redis` versions > 2.6
 - `ioredis` versions > 2.6
 - `mysql` version 1 - 3
 - `mysql2` version 1 - 3
 - `pg` version > 6
 - `vue-server-renderer` version 2

### Custom Tracing API

The custom tracing API can be used to create custom trace spans. A span is a particular unit of work within a trace, such as an RPC request. Spans may be nested; the outermost span is called a root span, even if there are no nested child spans. Root spans typically correspond to incoming requests, while child spans typically correspond to outgoing requests, or other work that is triggered in response to incoming requests. This means that root spans shouldn't be created in a context where a root span already exists; a child span is more suitable here. Instead, root spans should be created to track work that happens outside of the request lifecycle entirely, such as periodically scheduled work. To illustrate:

```js
const io = require('@pm2/io').init({ tracing: true })
const tracer = io.getTracer()
// ...

app.get('/:token', function (req, res) {
  const token = req.params.token
  // the '2' correspond to the type of operation you want to trace
  // can be 0 (UNKNOWN), 1 (SERVER) or 2 (CLIENT)
  // 'verifyToken' here will be the name of the operation
  const customSpan = tracer.startChildSpan('verifyToken', 2)
  // note that customSpan can be null if you are not inside a request
  req.Token.verifyToken(token, (err, result) => {
    if (err) {
      // you can add tags to the span to attach more details to the span
      customSpan.addAttribute('error', err.message)
      customSpan.end()
      return res.status(500).send('error')
    }
    customSpan.addAttribute('result', result)
    // be sure to always .end() the spans
    customSpan.end()
    // redirect the user if the token is valid
    res.send('/user/me')
  })
})

// For any significant work done _outside_ of the request lifecycle, use
// startRootSpan.
const traceOptions = {
    name: 'my custom trace',
    // the '1' correspond to the type of operation you want to trace
    // can be 0 (UNKNOWN), 1 (SERVER) or 2 (CLIENT)
    kind: '1'
  }
plugin.tracer.startRootSpan(traceOptions, rootSpan => {
  // ...
  // Be sure to call rootSpan.end().
  rootSpan.end()
});
```

## Configuration

### Global configuration object

```javascript
export class IOConfig {
  /**
   * Automatically catch unhandled errors
   */
  catchExceptions?: boolean = true
  /**
   * Configure the metrics to add automatically to your process
   */
  metrics?: {
    eventLoop: boolean = true,
    network: boolean = false,
    http: boolean = true,
    gc: boolean = true,
    v8: boolean = true
  }
  /**
   * Configure the default actions that you can run
   */
  actions?: {
    eventLoopDump?: boolean = true
  }
  /**
   * Configure availables profilers that will be exposed
   */
  profiling?: {
    /**
     * Toggle the CPU profiling actions
     */
    cpuJS: boolean = true
    /**
     * Toggle the heap snapshot actions
     */
    heapSnapshot: boolean = true
    /**
     * Toggle the heap sampling actions
     */
    heapSampling: boolean = true
    /**
     * Force a specific implementation of profiler
     *
     * available:
     *  - 'addon' (using the v8-profiler-node8 addon)
     *  - 'inspector' (using the "inspector" api from node core)
     *  - 'none' (disable the profilers)
     *  - 'both' (will try to use inspector and fallback on addon if available)
     */
    implementation: string = 'both'
  }
  /**
   * Configure the transaction tracing options
   */
  tracing?: {
    /**
     * Enabled the distributed tracing feature.
     */
    enabled: boolean
    /**
     * If you want to report a specific service name
     * the default is the same as in apmOptions
     */
    serviceName?: string
    /**
     * Generate trace for outgoing request that aren't connected to a incoming one
     * default is false
     */
    outbound?: boolean
    /**
     * Determines the probability of a request to be traced. Ranges from 0.0 to 1.0
     * default is 0.5
     */
    samplingRate?: number,
    /**
     * Add details about databases calls (redis, mongodb etc)
     */
    detailedDatabasesCalls?: boolean,
    /**
     * Ignore specific incoming request depending on their path
     */
    ignoreIncomingPaths?: Array<IgnoreMatcher<httpModule.IncomingMessage>>
    /**
     * Ignore specific outgoing request depending on their url
     */
    ignoreOutgoingUrls?: Array<IgnoreMatcher<httpModule.ClientRequest>>
    /**
     * Set to true when wanting to create span for raw TCP connection
     * instead of new http request
     */
    createSpanWithNet: boolean
  }
  /**
   * If you want to connect to PM2 Enterprise without using PM2, you should enable
   * the standalone mode
   *
   * default is false
   */
  standalone?: boolean = false
  /**
   * Define custom options for the standalone mode
   */
  apmOptions?: {
    /**
     * public key of the bucket to which the agent need to connect
     */
    publicKey: string
    /**
     * Secret key of the bucket to which the agent need to connect
     */
    secretKey: string
    /**
     * The name of the application/service that will be reported to PM2 Enterprise
     */
    appName: string
    /**
     * The name of the server as reported in PM2 Enterprise
     *
     * default is os.hostname()
     */
    serverName?: string
    /**
     * Broadcast all the logs from your application to our backend
     */
    sendLogs?: Boolean
    /**
     * Avoid to broadcast any logs from your application to our backend
     * Even if the sendLogs option set to false, you can still see some logs
     * when going to the log interface (it automatically trigger broacasting log)
     */
    disableLogs?: Boolean
    /**
     * Since logs can be forwared to our backend you may want to ignore specific
     * logs (containing sensitive data for example)
     */
    logFilter?: string | RegExp
    /**
     * Proxy URI to use when reaching internet
     * Supporting socks5,http,https,pac,socks4
     * see https://github.com/TooTallNate/node-proxy-agent
     *
     * example: socks5://username:password@some-socks-proxy.com:9050
     */
    proxy?: string
  }
}
```

You can pass whatever options you want to `io.init`, it will automatically update its configuration.

## Migration Guides

### 2.x to 3.x

Here the list of breaking changes :

- Removed `io.scopedAction` because of low user adoption
- Removed `io.notify` in favor of `io.notifyError` (droppin replacement)
- Removed support for `gc-stats` module
- Removed Heap profiling support when using the profiler addon (which wasn't possible at all)
- Removed deep-metrics support (the module that allowed to get metrics about websocket/mongo out of the box), we are working on a better solution.
- Removed `io.transpose`
- Removed `io.probe()` to init metrics
- **Changed the configuration structure**

High chance that if you used a custom configuration for `io.init`, you need to change it to reflect the new configuration.
Apart from that and the `io.notify` removal, it shouldn't break the way you instanciated metrics.
If you find something else that breaks please report it to us (tech@keymetrics.io).

### 3.x to 4.x

The only difference with the 4.x version is the new tracing system put in place, so the only changs are related to it:

- **Dropped the support for node 4** (you can still use the 3.x if you use node 4 but you will not have access to the distributed tracing)
- **Changed the tracing configuration** (see options above)

## Development

To auto rebuild on file change:

```bash
$ npm install
$ npm run watch
```

To test only one file:

```bash
$ npm run unit <typescript-file-to-test.ts>
```

Run transpilation + test + coverage:

```bash
$ npm run test
```

Run transpilation + test only:

```bash
$ npm run unit <test>
```

## Notes

Curently this package isn't compatible with `amqp` if you use the `network` metrics. We recommend to disable the metrics with the following configuration in this case :

```javascript
io.init({
  metrics: {
    network: false
  }
})
```
