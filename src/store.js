var kefir = require('kefir')

function store (log, sources, ms, cnt) {

  var lastKeys = null

  var stream = kefir.merge(sources)

  function saveToLog (values) {
    return kefir.fromNodeCallback(cb => {
      var docs = values.map(v => {
        return {
          links: lastKeys,
          value: v,
        }
      })
      log.batch(docs, cb)
    })
  }

  var saved = stream
      .bufferWithTimeOrCount(ms,cnt)
      .filter(buff => buff.length>0)
      .flatMap(saveToLog)

  saved.onValue(ns => {
    lastKeys = ns.map(n => n.key)
  })

  return saved
}

module.exports = store
