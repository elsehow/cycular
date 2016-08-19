# cycular

log streams of data over time on a hyperlog


values across multiple [kefir](https://pozadi.github.io/kefir/) streams are assigned [monotonic timestamps](https://www.npmjs.com/package/monotonic-timestamp), and batch-written to a [hyperlog](https://github.com/mafintosh/hyperlog), in which batches are causally linked through time.

## example

```javascript
var memdb = require('memdb')
var hyperlog = require('hyperlog')
var log = hyperlog(memdb(), {
  valueEncoding: 'json'
})
var cycular = require('cycular')

function exampleSource (name, interval) {
  var kefir = require('kefir')
  var randomStream = kefir.stream(emitter => {
    setInterval(function () {
      var random = Math.floor(Math.random()*100)
      emitter.emit(random)
    }, interval)
  })
  return cycular.source(randomStream)
}

var loggedDataS   = cycular.store(log, [
  exampleSource('example-source-1', 500),
  exampleSource('example-source-2', 1000),
], 50, 100)

loggedDataS
  .log('logged data')

// logged data <value> [ { log: 'cis209l9m000003x3wtwhq686',
//     key: '919a6686d23f73961e194e3e96a44561173ccd6e4623001bc92ad7d65a8c977e',
//     identity: null,
//     signature: null,
//     value: { metadata: [Object], payload: 42 },
//     links: [],
//     seq: 1,
//     change: 1 } ]
//
// [...]

```

## install

```
npm i --save cycular
```

## api

### cycular.source(inputS, [metadataF])

`inputS` is a [kefir](https://pozadi.github.io/kefir/) stream.

optional `metdataF(timestamp)` method takes a monotonic timestamp, and returns a value to be stored in `value.metadata`. (by default, `metadata: { timestamp: [monotonic timestamp] }`.

see `example/example.js` for a more robust example

## license

BSD
