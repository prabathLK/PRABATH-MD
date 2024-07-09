# Check proxy for NodeJS

```javascript
const proxy_check = require('proxy-check');

const proxy = {
  host: '54.82.74.24',
  port: 5557,
  proxyAuth: 'y0adXjeO:pAzAHCr4'
};
// or
// const proxy = 'y0adXjeO:pAzAHCr4@54.82.74.24:5557';

proxy_check(proxy).then(r => {
  console.log(r); // true
}).catch(e => {
  console.error(e); // ECONNRESET
});
```

#### Install your simple proxy-server: https://github.com/zamanuhina/install-proxy-one-line
