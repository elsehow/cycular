var kefir = require('kefir')
var timeserver = require('./sources/timeserver')
var memdb = require('memdb')
var hyperlog = require('hyperlog')
var log = hyperlog(memdb(), {
  valueEncoding: 'json'
})
var store = require('..').store
var loggedDataS   = store(log, [
  timeserver(kefir.interval(500,1), {
    url: 'http://indra.webfactional.com/timeserver',
  }),
], 50, 100)
loggedDataS.log('logged data')
