# cycular

[WIP] log streams of data over time on a hyperlog

## install

```
npm i --save cycular
```

## example

```javascript
var kefir = require('kefir')
var timeserver = require('./sources/timeserver')
var memdb = require('memdb')
var hyperlog = require('hyperlog')
var log = hyperlog(memdb(), {
  valueEncoding: 'json'
})

var store = require('..').store

var dataSourceSs = [
  timeserver(kefir.interval(500,1), {
    url: 'http://indra.webfactional.com/timeserver',
  }),
]

var dataS         = kefir.merge(dataSourceSs)
var loggedDataS   = store(log, dataS, 50, 100)
loggedDataS.log('logged data')
//view(loggedDataS).onValue(yo.update)
```

## what is this?

for now, look at [details.md](details.md) for more information on this project.

## license

BSD
