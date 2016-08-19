var kefir = require('kefir')
var timeserver = require('./timeserver-stream')
var memdb = require('memdb')
var hyperlog = require('hyperlog')
var log = hyperlog(memdb(), {
  valueEncoding: 'json'
})
var cycular = require('..')
var timeStream = timeserver(500, {
  url: 'http://indra.webfactional.com/timeserver',
})
var loggedDataS   = cycular.store(log, [
  cycular.source(timeStream)
], 50, 100)
loggedDataS
  .map(v => v.map(v => v.value))
  .log('logged data')
