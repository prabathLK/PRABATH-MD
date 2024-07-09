
## API idea

require('pm2-bundle-monitoring')

// or

require('pm2-io').connect({
  secret: '',
  public: ''
})

require('pm2-exception-catching')
require('pm2-transaction-tracing').config({
  ignore_route: '/ws'
})

require('pm2-frontend-monitoring')
var pm2_metrics = require('pm2-metrics')

pm2_metrics.variable('BLE pairing mode', permit_join)
pm2_metrics.variable('In memory users', () => Object.keys(users).length)

NOTES:
- watch parameters is not reset on pm2 restart. only after pm2 delete


----


pm2-io-apm features are in src/features/:

```
src/features/
├── dependencies.ts
├── entrypoint.ts
├── events.ts
├── metrics.ts
├── notify.ts
├── profiling.ts
└── tracing.ts
```

## Tracing

- `./src/census` folder is essentially a dump of https://github.com/census-instrumentation/opencensus-node/tree/master/packages/opencensus-nodejs-base/src/trace with plugins added
- Only traces higher than `MINIMUM_TRACE_DURATION: 1000 * 1000` are sent to transporter (sent in /src/census/exporter.ts:72)

Trace sent looks like:

```
{
  traceId: 'fac7052e9129416185a26d4935229620',
  name: '/slow',
  id: '66358f0a48be82c5',
  parentId: '',
  kind: 'SERVER',
  timestamp: 1586380086251000,
  duration: 2007559,
  debug: false,
  shared: false,
  localEndpoint: { serviceName: 'tototransaction' },
  tags: {
    'http.host': 'localhost',
    'http.method': 'GET',
    'http.path': '/slow',
    'http.route': '/slow',
    'http.user_agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36',
    'http.status_code': '304',
    'result.code': undefined
  }
}
```
