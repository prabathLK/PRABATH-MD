
const pkg = require('./package.json')

const config = {
  headers: {
    'X-JS-API-Version': pkg.version
  },
  services: {
    API: 'https://api.keymetrics.io',
    OAUTH: 'https://id.keymetrics.io'
  },
  OAUTH_AUTHORIZE_ENDPOINT: '/api/oauth/authorize',
  OAUTH_CLIENT_ID: '795984050',
  ENVIRONNEMENT: process && process.versions && process.versions.node ? 'node' : 'browser',
  VERSION: pkg.version,
  // put in debug when using km.io with browser OR when DEBUG=true with nodejs
  IS_DEBUG: (typeof window !== 'undefined' && window.location.host.match(/km.(io|local)/)) ||
    (typeof process !== 'undefined' && (process.env.DEBUG === 'true'))
}

module.exports = Object.assign({}, config)
