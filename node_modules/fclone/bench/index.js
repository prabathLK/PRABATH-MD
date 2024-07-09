'use strict'
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite

function Complex() {
  this.bar = 'foo'
  this.foo = new Array(100).fill(0).map(e => Math.random())
}

Complex.prototype.method = function() {}

const a = {b: 'hello', c: {foo: 'bar', bar: 'foo', error: new Error('Test')}, complex: new Complex()}

a.a = a
a.c.complex = a.complex
a.env = process.env

const fclone = require('../dist/fclone.js')
const clone = require('clone')
const deepcopy = require('deepcopy')
const jsonstringifysafe = require('json-stringify-safe')
const jsan = require('jsan')
const circularjson = require('circular-json-es6')
const util = require('util')

suite
.add('fclone', function() {
  let b = fclone(a)
})
.add('fclone + json.stringify', function() {
  let b = JSON.stringify(fclone(a))
})
.add('util.inspect (outputs a string)', function() {
  let b = util.inspect(a)
})
.add('jsan', function() {
  let b = jsan.stringify(a)
})
.add('circularjson', function() {
  let b = circularjson.stringify(a)
})
.add('deepcopy', function() {
  let b = deepcopy(a)
})
.add('json-stringify-safe', function() {
  let b = jsonstringifysafe(a)
})
.add('clone', function() {
  let b = clone(a)
})
.on('cycle', function(event) {
  console.log(String(event.target))
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'))
})
.run({ 'async': true })
