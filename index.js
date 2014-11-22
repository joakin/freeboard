
require('node-jsx').install({harmony: true, extension: '.jsx'})

var http = require('http')
var router = require('./lib/router')

var port = process.env.PORT || 8080

module.exports = http.createServer(function(req, res) {
  var m = router.match(req.url)
  if (m) return m.fn(req, res, m)
}).listen(port)

console.log('Server started on port', port)

