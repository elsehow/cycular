# design & implementation details

The main players in this drama are:

- `source`s
- `store`

## source

`source` might be a restAPI, a bluetooth input device like a GSR sensor, a websocket stream, etc.

a `source` might take an input stream `inputS`, but doesn't have to.

it might also take some opts object `opts`.

in any case, their output stream `outputS` has values of the form:

```js
{
  source: 'my-source-name',
  timestamp: 1468802845849,
  payload:  { 
    // your source's data here
  }
}
```

the unix `timestamp` is added for convenience
    
### `source(inputS, opts)`

returns one of kefir's [compositional event streams](https://github.com/elsehow/streams-for-the-damned), representing the output of the data source. 

inputS is also a kefir stream, representing the source's input.
not all data sources will have an input. a GSR sensor, for example, will just output values.

items in the `outputS` could have causal relationships to values in the `inputS`. 
for example, an input to `restApiDataSource` could be represented within the source as POST requests, each of which has a single response that gets emitted over the `outputS`.

if you need to relate outputs to causal inputs, it's up to you to decide how that relationship is represented. [`UUID.v1()`s](https://www.npmjs.com/package/uuid) could be good.

kefir's [flatMapLatest](https://rpominov.github.io/kefir/#flat-map-latest) method might also be helpful in some cases!
    
### example

here's a simple data source - a timeserver

we name our source `'timeserver'` with `source('timeserver', function (emitter) { ... })`. That function we pass in is responsible for emitting values (and errors) over the timestamp.

each `payload` will consist of the server's time, `serverTime` and the time we requested the server's time, `requestedAt`.


```js
var request = require('request');
var source = require('../../src/data-source')
var timestamp = require('unix-timestamp')
/*
  Takes opts.url
  URL for the timeserver
*/
function timeserver (inS, opts) {
  function timeS () {
    var requestedAt = Date.now()
    return source('timeserver', function (emitter) {
      request(opts.url, function (error, response, body) {
        if (error)
          emitter.error(error)
        else if (response.statusCode !== 200)
          emitter.error(response.statusCode)
        else
          // values passed to `emit` will be `payload`s
          emitter.emit({
            requestedAt: requestedAt,
            serverTime: timestamp.fromDate(body)*1000,
          })
      })
    })
  }
  // we make a request everytime we get a value over `inputS`. 
  return inS.flatMap(timeS)
}

module.exports = timeserver
```

This source takes an `inputS`, and and an object with `opts.url` containing some URL. 

Whenever a value comes over `inputS`, we `flatMap` values from a new source's output. the result is a single output stream of source values.

## store

a store takes

### `store(hyperlog, listOfSources, ms, cnt)`

returns a stream of values saved to `hyperlog` from some `listOfSources`. the values emitted over the `store`'s stream will be a list of length >= 1.

buffers dataS by `ms` milliseconds or a count of `cnt` - whichever limit is hit first. configure this so as to control how often your script writes to disk.
