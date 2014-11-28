
var req = require('superagent')
var routes = require('./routes')
var Post = require('../models/post')

exports.post = {}
exports.post.put = function(title, text, csrf) {
  req.post(routes.post.put)
    .type('form')
    .send(Post(title, text))
    .send({csrf: csrf})
    .end(function(res) {
      if (res.ok)
        console.log('posted', res)
      else
        console.log('not posted', res)
    })
}
