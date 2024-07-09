'use strict';
/*
 * pastebin-js
 * https://github.com/j3lte/pastebin-js
 *
 * Copyright (c) 2013-2019 Jelte Lagendijk
 * Licensed under the MIT license.
 */

/**
 * Export Pastebin
 */

exports = module.exports = require('./bin/pastebin');

/**
 * Export the version
 */
exports.version = require('./package.json').version;
