
var csrf = require('csrf')()
var secret = csrf.secretSync()

exports.get = function() {
  return csrf.create(secret)
}

exports.verify = function(token) {
  return csrf.verify(secret, token)
}
