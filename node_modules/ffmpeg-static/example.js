#!/usr/bin/env node
'use strict'

const {resolve} = require('path')
const shell = require('any-shell-escape')
const {exec} = require('child_process')
const pathToFfmpeg = require('.')

const argv = process.argv.slice(2)
if (argv.includes('-h') || argv.includes('--help')) {
	console.info(`
This is just a simple CLI wrapper around the powerful ffmpeg CLI tool.
This script just showcases how to use ffmpeg-static; It wouldn't make
sense to hide a flexible tool behind a limited wrapper script.
Usage:
	./example.js <src> <dest>
Example:
	./example.js src-audio-file.m4a dest-audio-file.mp3
`)
	process.exit(0)
}

const [src, dest] = argv
if (!src) {
	console.error('Missing <src> positional argument.')
	process.exit(1)
}
if (!dest) {
	console.error('Missing <dest> positional argument.')
	process.exit(1)
}

const makeMp3 = shell([
	pathToFfmpeg,
	'-y', '-v', 'error',
	'-i', resolve(process.cwd(), src),
	'-acodec', 'mp3',
	'-format', 'mp3',
	resolve(process.cwd(), dest),
])

exec(makeMp3, (err) => {
	if (err) {
		console.error(err)
		process.exit(1)
	} else {
		console.info('done!')
	}
})
