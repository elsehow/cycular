# cycular

[WIP] log streams of data over time on a hyperlog

## install

```
npm i --save cycular
```

## example

```javascript
var kefir = require('kefir')
var memdb = require('memdb')
var hyperlog = require('hyperlog')
var log = hyperlog(memdb(), {
  valueEncoding: 'json'
})

var store = require('cycular').store
var source = require('cycular').source

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

var loggedDataS   = store(log, [
  exampleSource('example-source-1', 500),
  exampleSource('example-source-2', 1000),
], 50, 100)

loggedDataS
  .log('logged data')
```

see `example/example.js` for a more robust example

## what is this?

for now, look at [details.md](details.md) for more information on this project.

## license

BSD
