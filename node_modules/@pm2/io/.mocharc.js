
process.env.NODE_ENV = 'test';

module.exports = {
  'allow-uncaught': false,
  'async-only': false,
  bail: true,
  color: true,
  delay: false,
  diff: true,
  exit: true,
  timeout: 10000,
  'trace-warnings': true,
  ui: 'bdd',
  retries: 2,
  require: ['ts-node/register']
}
