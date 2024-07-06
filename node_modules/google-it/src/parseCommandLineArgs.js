const commandLineArgs = require('command-line-args');
const optionDefinitions = require('./optionDefinitions');

const parseCommandLineArgs = (argv) => {
  const cliOptions = argv.length === 3 ? { query: argv[2] }
    : commandLineArgs(optionDefinitions);
  // first arg is 'node', second is /path/to/file/app.js, third is whatever follows afterward
  if (argv.length > 2) {
    // eslint-disable-next-line prefer-destructuring
    cliOptions.query = argv[2].replace('--query=', '');
  }
  return cliOptions;
};

module.exports = parseCommandLineArgs;
