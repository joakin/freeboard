var when = require('when')
var node = require('when/node')
var anybody = require('body/any')
var sendJson = require('send-data/json')

var anybodyp = function(req, res) {
  return withNodeback(function(next) {
    anybody(req, res, next)
  })
}

var csrf = require('../utils/csrf')
var db = require('../db')

var Post = require('../models/post')

exports.post = {}
exports.post.put = function postPut(req, res) {
  console.log('Req put post')

  when()
    .tap(isPost.bind(null, req))
    .then(anybodyp.bind(null, req, res))
    .tap(verifyCsrf)
    .then(function(body) {
      return Post(body.title, body.text)
    })
    .then(db.posts.put)
    .then(function(post) {
      console.log('Successful post', post)
      sendJson(req, res, post)
    })
    .catch(function(err) {
      return error(req, res, err)
    })
}

exports.post.get = function(req, res, match) {
  console.log('Req post', match.params.id)
  db.posts.get(match.params.id, function(err, post) {
    if (err) return error(req, res, err)
    sendJson(req, res, post)
  })
}

exports.comment = {}
exports.comment.put = function(req, res, match) {
  console.log('Req put comment')
  if (req.method !== 'POST')
    return error(req, res, new Error('Invalid method'))

  anybody(req, res, function(err, body) {
    console.log('Parsed body', body)
    if (err) return error(req, res, err)
    if (!csrf.verify(body.csrf)) {
      var csrfErr = new Error('Unauthorized')
      csrfErr.statusCode = 403
      return error(req, res, csrfErr)
    }
    var postId = match.params.id
    var comment = { text: body.text, post: postId }
    db.comments.put(comment).then(function() {
      console.log('Successful comment', comment)
      sendJson(req, res, comment)
    }).catch(function(err) {
      return error(req, res, err)
    })
  })
}

function error(req, res, err) {
  console.log('Error', err)
  console.log(err.stack)
  sendJson(req, res, {
    statusCode: err.statusCode || 500,
    body: { message: err.message }
  })
}

function isPost(req) {
  if (req.method !== 'POST') throw new Error('Invalid method')
}

function verifyCsrf(body) {
  if (!csrf.verify(body.csrf)) {
    var csrfErr = new Error('Unauthorized')
    csrfErr.statusCode = 403
    throw csrfErr
  }
}

// Returns promise injecting a nodeback for use with node apis
// eg: fromNodeback(function(cb) { fs.readFile('...', cb) })
function withNodeback(fn) {
  var deferred = when.defer()
  fn(node.createCallback(deferred.resolver))
  return deferred.promise
}
