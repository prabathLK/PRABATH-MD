# PM2.io API Client for Javascript

This module lets you implement a fully customizable PM2.io client, receiving live data from the PM2.io API.

## Install

With NPM:

```bash
$ npm install @pm2/js-api --save
```

Or get the raw library for browser here:

[https://unpkg.com/@pm2/js-api](https://unpkg.com/@pm2/js-api)

## Usage

To use this client you need to first requiring it into your code and creating a new instance :

```javascript
const PM2IO = require('@pm2/js-api')

let client = new PM2IO()
```

Then you'll to tell the client how you want to authenticate, you have the choice :

- First the `standalone` flow, you just need to enter a refresh token and it will works
```javascript
client.use('standalone', {
  refresh_token: 'token'
})
```

- Secondly, the `browser` flow, you have a custom keymetrics application and you want to authenticate of the behalf for any user (in this flow you need to be inside a browser) :
```javascript
client.use('browser', {
  client_id: 'my-oauth-client-id'
})
```

- Thirdly, the `embed` flow, you have a custom keymetrics application and you want to authenticate of the behalf of any user (you need to be in a nodejs process, for example a CLI) :
```javascript
client.use('embed', {
  client_id: 'my-oauth-client-id'
})
```

After that, you can do whatever call you want just keep in mind each call return a Promise (the client will handle authentication) :
```javascript
client.user.retrieve()
  .then((response) => {
   // see https://github.com/mzabriskie/axios#response-schema
   // for the content of response
  }).catch((err) => {
   // see https://github.com/mzabriskie/axios#handling-errors
   // for the content of err
  })
```

## Example

```javascript
const PM2IO = require('@pm2/js-api')

let client = new PM2IO().use('standalone', {
  refresh_token: 'token'
})

// retrieve our buckets
client.bucket.retrieveAll()
  .then((res) => {
    // find our bucket
    let bucket = res.data.find(bucket => bucket.name === 'Keymetrics')

    // connect to realtime data of a bucket
    client.realtime.subscribe(bucket._id).catch(console.error)

    // attach handler on specific realtime data
    client.realtime.on(`${bucket.public_id}:connected`, () => console.log('connected to realtime'))
    client.realtime.on(`${bucket.public_id}:*:status`, (data) => console.log(data.server_name))

    // we can also unsubscribe from a bucket realtime data
    setTimeout(() => {
      client.realtime.unsubscribe(bucket._id).catch(console.error)
    }, 5000)
  })
  .catch(console.error)
```

### Realtime

All realtime data are broadcasted with the following pattern :

```
bucket_public_id:server_name:data_method
```

For example :

```javascript
// here i listen on the status data for
// the server "my_server" on the bucket with
// the public id 4398545
client.realtime.on(`4398545:my_server:status`, (data) => {
  console.log(data.server_name))
}
```

#### Events available

| Event | Description |
|-------|-------------|
| mediator:blacklist | Used to broadcast updated process blacklisted |
| human:event | Events sent via pmx.emit() |
| process:exception | Issues from pm2 or apm |
| logs | Logs |
| status | Status sent by apm or pm2 |
| metric | Metric sent by apm/collectors |
| axm:transaction:outlier | Outlier for transaction tracing |
| process:event | Event from pm2 (restart...) |
| profiling | Profiling packet with profiling link |
| axm:scoped_action:stream | Stream from scoped action |
| axm:scoped_action:end | End of scoped action |
| axm:scoped_action:error | Error for a scoped action |
| pm2:scoped:end | End for pm2 scoped |
| pm2:scoped:stream | Stream from pm2 scoped |
| pm2:scoped:error | Error from pm2 scoped |
| trace-span | Span for distributed tracing |
| axm:transaction | Transaction for transaction tracing |
| trigger:pm2:result | Result from a pm2 action |
| trigger:action:success | Success from a custom action |
| trigger:action:failure | Error from a customer action |
| axm:reply | Reply from a custom action |

## Route definition

```
client.actions.triggerAction -> POST /api/bucket/:id/actions/trigger
client.actions.triggerPM2Action -> POST /api/bucket/:id/actions/triggerPM2
client.actions.triggerScopedAction -> POST /api/bucket/:id/actions/triggerScopedAction
client.bucket.sendFeedback -> PUT /api/bucket/:id/feedback
client.bucket.retrieveUsers -> GET /api/bucket/:id/users_authorized
client.bucket.currentRole -> GET /api/bucket/:id/current_role
client.bucket.setNotificationState -> POST /api/bucket/:id/manage_notif
client.bucket.inviteUser -> POST /api/bucket/:id/add_user
client.bucket.removeInvitation -> DELETE /api/bucket/:id/invitation
client.bucket.removeUser -> POST /api/bucket/:id/remove_user
client.bucket.setUserRole -> POST /api/bucket/:id/promote_user
client.bucket.retrieveAll -> GET /api/bucket/
client.bucket.create -> POST /api/bucket/create_classic
client.bucket.claimTrial -> PUT /api/bucket/:id/start_trial
client.bucket.upgrade -> POST /api/bucket/:id/upgrade
client.bucket.retrieve -> GET /api/bucket/:id
client.bucket.update -> PUT /api/bucket/:id
client.bucket.retrieveServers -> GET /api/bucket/:id/meta_servers
client.bucket.getSubscription -> GET /api/bucket/:id/subscription
client.bucket.destroy -> DELETE /api/bucket/:id
client.bucket.transferOwnership -> POST /api/bucket/:id/transfer_ownership
client.bucket.retrieveCharges -> GET /api/bucket/:id/payment/charges
client.bucket.updateUserOptions -> PUT /api/bucket/:id/user_options
client.bucket.alert.update -> POST /api/bucket/:id/alerts/update
client.bucket.alert.updateSlack -> POST /api/bucket/:id/alerts/updateSlack
client.bucket.alert.updateWebhooks -> POST /api/bucket/:id/alerts/updateWebhooks
client.bucket.alert.create -> POST /api/bucket/:id/alerts
client.bucket.alert.delete -> DELETE /api/bucket/:id/alerts/:alert
client.bucket.alert.list -> GET /api/bucket/:id/alerts/
client.bucket.alert.updateAlert -> PUT /api/bucket/:id/alerts/:alert
client.bucket.alert.get -> GET /api/bucket/:id/alerts/:alert
client.bucket.alert.triggerSample -> POST /api/bucket/:id/alerts/:alert/sample
client.bucket.alert.analyzer.list -> POST /api/bucket/:id/alerts/analyzer
client.bucket.alert.analyzer.editState -> PUT /api/bucket/:id/alerts/analyzer/:alert
client.bucket.alert.analyzer.updateConfig -> PUT /api/bucket/:id/alerts/analyzer/:analyzer/config
client.bucket.billing.subscribe -> POST /api/bucket/:id/payment/subscribe
client.bucket.billing.startTrial -> PUT /api/bucket/:id/payment/trial
client.bucket.billing.getInvoices -> GET /api/bucket/:id/payment/invoices
client.bucket.billing.getReceipts -> GET /api/bucket/:id/payment/receipts
client.bucket.billing.getSubcription -> GET /api/bucket/:id/payment/subscription
client.bucket.billing.getSubcriptionState -> GET /api/bucket/:id/payment/subscription/state
client.bucket.billing.attachCreditCard -> POST /api/bucket/:id/payment/cards
client.bucket.billing.fetchCreditCards -> GET /api/bucket/:id/payment/cards
client.bucket.billing.fetchCreditCard -> GET /api/bucket/:id/payment/card/:card_id
client.bucket.billing.fetchDefaultCreditCard -> GET /api/bucket/:id/payment/card
client.bucket.billing.updateCreditCard -> PUT /api/bucket/:id/payment/card
client.bucket.billing.deleteCreditCard -> DELETE /api/bucket/:id/payment/card/:card_id
client.bucket.billing.setDefaultCard -> POST /api/bucket/:id/payment/card/:card_id/default
client.bucket.billing.fetchMetadata -> GET /api/bucket/:id/payment
client.bucket.billing.updateMetadata -> PUT /api/bucket/:id/payment
client.bucket.billing.attachBankAccount -> POST /api/bucket/:id/payment/banks
client.bucket.billing.fetchBankAccount -> GET /api/bucket/:id/payment/banks
client.bucket.billing.deleteBankAccount -> DELETE /api/bucket/:id/payment/banks
client.data.dependencies.retrieve -> POST /api/bucket/:id/data/dependencies/
client.data.events.retrieve -> POST /api/bucket/:id/data/events
client.data.events.retrieveMetadatas -> GET /api/bucket/:id/data/eventsKeysByApp
client.data.events.retrieveHistogram -> POST /api/bucket/:id/data/events/stats
client.data.events.deleteAll -> DELETE /api/bucket/:id/data/events/delete_all
client.data.exceptions.retrieve -> POST /api/bucket/:id/data/exceptions
client.data.exceptions.retrieveSummary -> GET /api/bucket/:id/data/exceptions/summary
client.data.exceptions.deleteAll -> POST /api/bucket/:id/data/exceptions/delete_all
client.data.exceptions.delete -> POST /api/bucket/:id/data/exceptions/delete
client.data.issues.list -> POST /api/bucket/:id/data/issues/list
client.data.issues.listOccurencesForIdentifier -> GET /api/bucket/:id/data/issues/occurrences/:identifier
client.data.issues.getReplay -> GET /api/bucket/:id/data/issues/replay/:uuid
client.data.issues.retrieveHistogram -> POST /api/bucket/:id/data/issues/histogram
client.data.issues.findOccurences -> POST /api/bucket/:id/data/issues/ocurrences
client.data.issues.search -> POST /api/bucket/:id/data/issues/search
client.data.issues.summary -> GET /api/bucket/:id/data/issues/summary/:aggregateBy
client.data.issues.deleteAll -> DELETE /api/bucket/:id/data/issues
client.data.issues.delete -> DELETE /api/bucket/:id/data/issues/:identifier
client.data.logs.retrieve -> POST /api/bucket/:id/data/logs
client.data.logs.retrieveHistogram -> POST /api/bucket/:id/data/logs/histogram
client.data.metrics.retrieveAggregations -> POST /api/bucket/:id/data/metrics/aggregations
client.data.metrics.retrieveHistogram -> POST /api/bucket/:id/data/metrics/histogram
client.data.metrics.retrieveList -> POST /api/bucket/:id/data/metrics/list
client.data.metrics.retrieveMetadatas -> POST /api/bucket/:id/data/metrics
client.data.outliers.retrieve -> POST /api/bucket/:id/data/outliers/
client.data.processes.retrieveEvents -> POST /api/bucket/:id/data/processEvents
client.data.processes.retrieveDeployments -> POST /api/bucket/:id/data/processEvents/deployments
client.data.profiling.retrieve -> GET /api/bucket/:id/data/profilings/:filename
client.data.profiling.download -> GET /api/bucket/:id/data/profilings/:filename/download
client.data.profiling.list -> POST /api/bucket/:id/data/profilings
client.data.profiling.delete -> DELETE /api/bucket/:id/data/profilings/:filename
client.data.status.retrieve -> GET /api/bucket/:id/data/status
client.data.status.retrieveBlacklisted -> GET /api/bucket/:id/data/status/blacklisted
client.data.transactions.retrieveHistogram -> POST /api/bucket/:id/data/transactions/v2/histogram
client.data.transactions.retrieveSummary -> POST /api/bucket/:id/data/transactions/v2/summary
client.data.transactions.delete -> POST /api/bucket/:id/data/transactions/v2/delete
client.dashboard.retrieveAll -> GET /api/bucket/:id/dashboard/
client.dashboard.retrieve -> GET /api/bucket/:id/dashboard/:dashid
client.dashboard.remove -> DELETE /api/bucket/:id/dashboard/:dashid
client.dashboard.update -> POST /api/bucket/:id/dashboard/:dashId
client.dashboard.create -> PUT /api/bucket/:id/dashboard/
client.misc.listChangelogArticles -> GET /api/misc/changelog
client.misc.retrievePM2Version -> GET /api/misc/release/pm2
client.misc.retrieveNodeRelease -> GET /api/misc/release/nodejs/:version
client.misc.retrievePlans -> GET /api/misc/plans
client.misc.retrieveCoupon -> POST /api/misc/stripe/retrieveCoupon
client.misc.retrieveCompany -> POST /api/misc/stripe/retrieveCompany
client.misc.retrieveVAT -> POST /api/misc/stripe/retrieveVat
client.orchestration.selfSend -> POST /api/bucket/:id/balance
client.bucket.server.deleteServer -> POST /api/bucket/:id/data/deleteServer
client.tokens.retrieve -> GET /api/users/token/
client.tokens.remove -> DELETE /api/users/token/:id
client.tokens.create -> PUT /api/users/token/
client.user.retrieve -> GET /api/users/isLogged
client.user.show -> GET /api/users/show/:id
client.user.update -> POST /api/users/update
client.user.delete -> DELETE /api/users/delete
client.user.attachCreditCard -> POST /api/users/payment/
client.user.listSubscriptions -> GET /api/users/payment/subcriptions
client.user.listCharges -> GET /api/users/payment/charges
client.user.fetchCreditCard -> GET /api/users/payment/card/:card_id
client.user.fetchDefaultCreditCard -> GET /api/users/payment/card
client.user.updateCreditCard -> PUT /api/users/payment/card
client.user.deleteCreditCard -> DELETE /api/users/payment/card/:card_id
client.user.setDefaultCard -> POST /api/users/payment/card/:card_id/default
client.user.fetchMetadata -> GET /api/users/payment/card/stripe_metadata
client.user.updateMetadata -> PUT /api/users/payment/stripe_metadata
client.user.otp.retrieve -> GET /api/users/otp
client.user.otp.enable -> POST /api/users/otp
client.user.otp.disable -> DELETE /api/users/otp
client.user.providers.retrieve -> GET /api/users/integrations
client.user.providers.add -> POST /api/users/integrations
client.user.providers.remove -> DELETE /api/users/integrations/:name
client.bucket.webcheck.listMetrics -> GET /api/bucket/:id/webchecks/metrics
client.bucket.webcheck.listRegions -> GET /api/bucket/:id/webchecks/regions
client.bucket.webcheck.getMetrics -> POST /api/bucket/:id/webchecks/:webcheck/metrics
client.bucket.webcheck.list -> GET /api/bucket/:id/webchecks
client.bucket.webcheck.get -> GET /api/bucket/:id/webchecks/:webcheck
client.bucket.webcheck.create -> POST /api/bucket/:id/webchecks
client.bucket.webcheck.update -> PUT /api/bucket/:id/webchecks/:webcheck
client.bucket.webcheck.delete -> DELETE /api/bucket/:id/webchecks/:webcheck
client.auth.retrieveToken -> POST /api/oauth/token
client.auth.requestNewPassword -> POST /api/oauth/reset_password
client.auth.sendEmailLink -> POST /api/oauth/send_email_link
client.auth.validEmail -> GET /api/oauth/valid_email/:token
client.auth.register -> GET /api/oauth/register
client.auth.revoke -> POST /api/oauth/revoke
client.data.traces.list -> POST /api/bucket/:id/data/traces
client.data.traces.retrieve -> GET /api/bucket/:id/data/traces/:trace
client.data.traces.getServices -> GET /api/bucket/:id/data/traces/services
client.data.traces.getTags -> GET /api/bucket/:id/data/traces/tags
client.data.traces.getHistogramByTag -> POST /api/bucket/:id/data/traces/histogram/tag
client.data.notifications.list -> POST /api/bucket/:id/data/notifications
client.data.notifications.retrieve -> GET /api/bucket/:id/data/notifications/:notification
client.bucket.application.list -> GET /api/bucket/:id/applications
client.bucket.application.get -> GET /api/bucket/:id/applications/:application
client.bucket.application.create -> POST /api/bucket/:id/applications
client.bucket.application.update -> PUT /api/bucket/:id/applications/:application
client.bucket.application.delete -> DELETE /api/bucket/:id/applications/:application
client.bucket.application.getPreview -> GET /api/bucket/:id/applications/:application/preview
client.bucket.application.getReports -> GET /api/bucket/:id/applications/:application/report
```

## Local Backend

- Create token in user setting then:

### Standalone logging

```javascript
const PM2IO = require('@pm2/js-api')

let io = new PM2IO({
  services: {
    API: 'http://cl1.km.io:3000',
    OAUTH: 'http://cl1.km.io:3100'
  }
}).use('standalone', {
  refresh_token: 'refresh-token'
})
```

### Browser logging

```javascript
const PM2IO = require('@pm2/js-api')

let io = new PM2IO({
  OAUTH_CLIENT_ID: '5413907556',
  services: {
    API: 'http://cl1.km.io:3000',
    OAUTH: 'http://cl1.km.io:3100'
  }
}).use('standalone', {
  refresh_token: 'refresh-token'
})
```

## Tasks

```
# Browserify + Babelify to ES5 (output to ./dist/keymetrics.es5.js)
$ npm run build
# Browserify + Babelify + Uglify (output to ./dist/keymetrics.min.js)
$ npm run dist
# Generate documentation
$ npm run doc
```

## License

Apache 2.0

## Release

## Release

To release a new version, first install [gren](https://github.com/github-tools/github-release-notes) :
```bash
yarn global add github-release-notes
```

Push a commit in github with the new version you want to release :
```
git commit -am "version: major|minor|patch bump to X.X.X"
```

Care for the **versionning**, we use the [semver versioning](https://semver.org/) currently. Please be careful about the version when pushing a new package.

Then tag a version with git :
```bash
git tag -s vX.X.X
```

Push the tag into github (this will trigger the publish to npm) :
```
git push origin vX.X.X
```

To finish update the changelog of the release on github with `gren` (be sure that gren has selected the right tags):
```
gren release -o -D commits -u keymetrics -r pm2-io-js-api
```
