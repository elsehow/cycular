var kefir = require('kefir')

/*
  TODO document
  */
function source (name, fn) {
  var S = kefir.stream(emitter => {
    source.emit = function (v) {
      emitter.emit({
        source: name,
        timestamp: Date.now(),
        payload: v,
      })
    }
    source.error = function (err) {
      emitter.error(err)
    }
  })
  fn(source)
  return S
}

module.exports = source

