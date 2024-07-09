'use strict'
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite

let arr = new Array(100).fill(Math.random() * 100)

suite
.add('for', function() {
  let l = arr.length
  for (let i = 0; i < l; i++) {
    let o = arr[i]
  }
})
.add('while --', function() {
  let l = arr.length
  while(l--) {
    let o = arr[l]
  }
})
.add('while ++', function() {
  let l = arr.length
  let i = -1
  while(l > ++i) {
    let o = arr[i]
  }
})
.on('cycle', function(event) {
  console.log(String(event.target))
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'))
})
.run({ 'async': true })
