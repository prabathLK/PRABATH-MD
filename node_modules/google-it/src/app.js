#! /usr/bin/env node

/* eslint-disable no-console */

const ora = require('ora');

const theSpinner = ora({ text: 'Loading results', color: 'cyan' }).start();
const parseCommandLineArgs = require('./parseCommandLineArgs');
const validateCLIArguments = require('./validateCLIArguments');
const googleIt = require('./main');

const cliOptions = parseCommandLineArgs(process.argv);
const validation = validateCLIArguments(cliOptions);
if (!validation.valid) {
  console.log(`Invalid options. Error:  ${validation.error}`);
  theSpinner.clear();
} else {
  googleIt(cliOptions)
    .then(() => {
      theSpinner.stop();
      theSpinner.clear();
    })
    .catch(console.error);
}
