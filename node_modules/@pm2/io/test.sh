

NODE_ENV='test'
MOCHA='npx mocha'

trap "exit" INT
set -e
npm run build

#### Unit tests

$MOCHA ./test/autoExit.spec.ts
$MOCHA ./test/api.spec.ts
$MOCHA ./test/metrics/http.spec.ts
$MOCHA ./test/metrics/runtime.spec.ts
$MOCHA ./test/entrypoint.spec.ts
# $MOCHA ./test/standalone/tracing.spec.ts
# $MOCHA ./test/standalone/events.spec.ts
$MOCHA ./test/features/events.spec.ts
$MOCHA ./test/features/tracing.spec.ts
$MOCHA ./test/metrics/eventloop.spec.ts
$MOCHA ./test/metrics/network.spec.ts
$MOCHA ./test/metrics/v8.spec.ts
$MOCHA ./test/services/actions.spec.ts
$MOCHA ./test/services/metrics.spec.ts

#### Tracing tests

# Enable tests
export OPENCENSUS_MONGODB_TESTS="1"
export OPENCENSUS_REDIS_TESTS="1"
export OPENCENSUS_MYSQL_TESTS="1"
export OPENCENSUS_PG_TESTS="1"

if [ -z "$DRONE" ]
then
    export OPENCENSUS_REDIS_HOST="localhost"
    export OPENCENSUS_MONGODB_HOST="localhost"
    export OPENCENSUS_MYSQL_HOST="localhost"
    export OPENCENSUS_PG_HOST="localhost"
else
    export OPENCENSUS_REDIS_HOST="redis"
    export OPENCENSUS_MONGODB_HOST="mongodb"
    export OPENCENSUS_MYSQL_HOST="mysql"
    export OPENCENSUS_PG_HOST="postgres"
fi

$MOCHA src/census/plugins/__tests__/http.spec.ts
$MOCHA src/census/plugins/__tests__/http2.spec.ts
$MOCHA src/census/plugins/__tests__/https.spec.ts
$MOCHA src/census/plugins/__tests__/mongodb.spec.ts
$MOCHA src/census/plugins/__tests__/mysql.spec.ts
$MOCHA src/census/plugins/__tests__/mysql2.spec.ts
$MOCHA src/census/plugins/__tests__/ioredis.spec.ts
$MOCHA src/census/plugins/__tests__/vue.spec.ts
$MOCHA src/census/plugins/__tests__/express.spec.ts
$MOCHA src/census/plugins/__tests__/net.spec.ts
$MOCHA src/census/plugins/__tests__/redis.spec.ts

SUPV14=`node -e "require('semver').gte(process.versions.node, '14.0.0') ? console.log('>=14') : console.log('>6')"`

if [ $SUPV14 == '>=14' ]; then
    exit
fi

$MOCHA src/census/plugins/__tests__/pg.spec.ts
#$MOCHA ./test/features/profiling.spec.ts
