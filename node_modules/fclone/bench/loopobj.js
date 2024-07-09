'use strict'
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite

let obj = process.env

suite
.add('for in', function() {
  for(let i in obj) {
    let o = obj[i]
  }
})
.add('while --', function() {
  let keys = Object.keys(obj)
  let l = keys.length
  while(l--) {
    let o = obj[keys[l]]
  }
})
.add('while shift', function() {
  let keys = Object.keys(obj)
  let k

  while(k = keys.shift()) {
    let o = obj[k]
  }
})
.on('cycle', function(event) {
  console.log(String(event.target))
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'))
})
.run({ 'async': true })
