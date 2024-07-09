#!/usr/bin/env node
'use strict'

var pack = require('./package.json')
var similarity = require('.')

var argv = process.argv.slice(2)
var sensitives = ['--sensitive', '-s']
var sensitive = false

sensitives.forEach(function(flag) {
  var pos = argv.indexOf(flag)
  if (pos !== -1) {
    argv.splice(pos, 1)
    sensitive = true
  }
})

if (argv.includes('--help') || argv.includes('-h')) {
  console.log(help())
} else if (argv.includes('--version') || argv.includes('-v')) {
  console.log(pack.version)
} else if (argv.length === 2) {
  process.stdout.write(
    String(similarity(argv[0], argv[1], {sensitive: sensitive}))
  )
} else {
  process.stderr.write(help())
  process.exit(1)
}

function help() {
  return [
    '',
    '  Usage: ' + pack.name + ' [options] <word> <word>',
    '',
    '  ' + pack.description,
    '',
    '  Options:',
    '',
    '    -h, --help           output usage information',
    '    -v, --version        output version number',
    '    -s, --sensitive      be sensitive to casing differences',
    '',
    '  Usage:',
    '',
    '  # output similarity',
    '  $ ' + pack.name + ' sitting kitten',
    '  ' + similarity('sitting', 'kitten'),
    '  $ ' + pack.name + ' saturday sunday',
    '  ' + similarity('saturday', 'sunday')
  ].join('\n')
}
