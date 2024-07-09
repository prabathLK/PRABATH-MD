#!/usr/bin/env node

var publish = require('../index'),
    nopt = require('nopt');

var knownOpts = {
        'on-major': Boolean,
        'on-minor': Boolean,
        'on-patch': Boolean,
        'on-build': Boolean,
				'test':     Boolean,
        'tag':      String
    },
    shorthands = {
        '?': ['--help'],
        'v': ['--version']
    },
    options = nopt(knownOpts, shorthands);

if (options.version) {
    console.log(require('../package.json').version);
    process.exit(0);
}

if (options.help) {
    console.log(function () {/*

     Usage:
     publish <options>

     Publishes the current module if the version of the local module is higher than the one in the registry.

     Options:

     --on-major  Publishes on major version changes.
     --on-minor  Publishes on minor version changes.
     --on-patch  Publishes on patch version changes.
     --on-build  Publishes on build version changes.
     --tag <tag> Publishes the change with the given tag.
                 (npm defaults to 'latest')
		 --test      Prints the versions of the packages
		             and whether it would publish.
     --version   Print the version of publish.
     --help      Print this help.

     Please report bugs!  https://github.com/cmanzana/node-publish/issues

     */
    }.toString().split(/\n/).slice(1, -2).join('\n'));
    process.exit(0);
}

publish.start(options.tag, function(err) {
    if (err) {
        handleError(err);
    }

    publish.publish(options, function (err) {
        if (err) {
            handleError(err);
        } else {
            process.exit(0);
        }
    });
});

function handleError(err) {
    console.error(err);
    process.exit(1);
}
