var test = require('tape')
var kefir = require('kefir')
var memdb = require('memdb')
var hyperlog = require('hyperlog')
var log = hyperlog(memdb(), {
  valueEncoding: 'json'
})

var store = require('..').store
var source = require('..').source

function exampleSource (name, interval) {
  console.log('setting up ', name)
  return source(name, function (emitter) {
    setInterval(function () {
      var random = Math.floor(Math.random()*100)
      emitter.emit(random)
    }, interval)
    // you can also emitter.error(err)
  })
}

test('logs values from 2 sources', t => {
  var loggedDataS   = store(log, [
    exampleSource('example-source-1', 5),
    exampleSource('example-source-2', 10),
  ], 2000, 2)

  function check (saved) {
    console.log('seeing', saved)
    t.equal(saved.length, 2)
    t.deepEqual(saved[0].value.source, 'example-source-1')
    t.deepEqual(saved[1].value.source, 'example-source-2')
    loggedDataS.offValue(check)
    t.end()
    process.exit(0)
  }

  loggedDataS.onValue(check)
})
