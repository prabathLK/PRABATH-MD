#! /usr/bin/env node

/* eslint-disable no-console */
"use strict";

var ora = require('ora');

var theSpinner = ora({
  text: 'Loading results',
  color: 'cyan'
}).start();

var parseCommandLineArgs = require('./parseCommandLineArgs');

var validateCLIArguments = require('./validateCLIArguments');

var googleIt = require('./main');

var cliOptions = parseCommandLineArgs(process.argv);
var validation = validateCLIArguments(cliOptions);

if (!validation.valid) {
  console.log("Invalid options. Error:  ".concat(validation.error));
  theSpinner.clear();
} else {
  googleIt(cliOptions).then(function () {
    theSpinner.stop();
    theSpinner.clear();
  }).catch(console.error);
}