var kefir = require('kefir')
var EventEmitter = require('events').EventEmitter

/*
  TODO document
*/
function source (name, fn) {
  var emitter = {}
  var em = new EventEmitter()
  emitter.emit = function (v) {
    em.emit('ev', {
      source: name,
      timestamp: Date.now(),
      payload: v,
    })
  }
  emitter.error = function (err) {
    emitter.error(err)
  }
  var S = kefir.fromEvents(em, 'ev')
  fn(emitter)
  return S
}

module.exports = source
