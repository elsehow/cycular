var kefir = require('kefir')

/*
  TODO document
  */
function source (name, fn) {
  var newEmitter = {}
  var S = kefir.stream(emitter => {
    newEmitter.emit = function (v) {
      emitter.emit({
        source: name,
        timestamp: Date.now(),
        payload: v,
      })
    }
    newEmitter.error = function (err) {
      emitter.error(err)
    }
  })
  fn(newEmitter)
  return S
}

module.exports = source

