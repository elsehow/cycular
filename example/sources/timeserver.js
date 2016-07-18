var request = require('request');
var source = require('../..').source
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
          emitter.emit({
            requestedAt: requestedAt,
            serverTime: timestamp.fromDate(body)*1000,
          })
      })
    })
  }
  return inS.flatMap(timeS)
}

module.exports = timeserver
