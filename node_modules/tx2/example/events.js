
const tx2 = require('..')

console.log(tx2)

tx2.emit('test', { data: 'yes' })

// Metrics variants
tx2.metric({
  name: 'test',
  val: () => {
    return 20
  }
})

tx2.metric('test2', () => {
  return 30
})

let m = tx2.metric('test3', 0)

m.set(45)

// Histogram

let n = tx2.histogram({
  name: 'histo1',
  val: () => {
    return Math.random()
  }
})

// OR
n.update(Math.random() * 1000)

tx2.action('toto', (cb) => {
  return cb({yessai:true})
})


setInterval(() => {} , 1000)
