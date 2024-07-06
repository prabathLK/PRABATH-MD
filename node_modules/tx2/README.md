
## tx2

Report Events, Metrics, Issues, Actions to PM2 and PM2.io.

```javascript
const tx2 = require('tx2')

let body = { calories : 20 }
tx2.metric('burnt calories', () => body.calories)

tx2.action('lift weights', (cb) => {
  cb({ success: true })
})
```

Check [API.md](API.md) for full API doc.

Once you have created some metrics:

```bash
$ pm2 start app.js
```

Then run:

```bash
# Inspect primitive reported
$ pm2 show app
```

or go to pm2.io for web based interface + insights creation.

## More

Generate documentation:

```bash
$ npm run doc
```

## License

MIT
