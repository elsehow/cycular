var memdb = require('memdb')
var hyperlog = require('hyperlog')
var log = hyperlog(memdb(), {
  valueEncoding: 'json'
})
var cycular = require('..')

function exampleSource (name, interval) {
  var kefir = require('kefir')
  var randomStream = kefir.stream(emitter => {
    setInterval(function () {
      var random = Math.floor(Math.random()*100)
      emitter.emit(random)
    }, interval)
  })
  return cycular.source(randomStream, function (timestamp) {
    return {
      timestamp: timestamp,
      sourceName: name,
    }
  })
}

// TODO put example logged output

var test = require('tape')
test('logs values from 2 sources', t => {
  var loggedDataS   = cycular.store(log, [
    exampleSource('example-source-1', 5),
    exampleSource('example-source-2', 10),
  ], 2000, 2)

  function check (saved) {
    console.log('seeing', saved)
    t.equal(saved.length, 2)
    t.deepEqual(saved[0].value.metadata.sourceName,
                'example-source-1')
    var timestamp0 = saved[0].value.metadata.timestamp
    var timestamp1 = saved[1].value.metadata.timestamp
    t.notEqual(timestamp0, timestamp1,
               `timestamp0 ${timestamp0}, timestamp1 ${timestamp1}`)
    t.deepEqual(saved[1].value.metadata.sourceName,
                'example-source-2')
    loggedDataS.offValue(check)
    t.end()
    process.exit(0)
  }

  loggedDataS.onValue(check)
})
