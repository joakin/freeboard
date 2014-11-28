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
var Comment = require('../models/Comment')

var makePostFromReqBody = function(body) {
  return Post(body.title, body.text)
}
exports.post = {}
exports.post.put = function postPut(req, res) {
  console.log('Req put post')

  postRequest(req, res, makePostFromReqBody, db.posts.put)
    .then(function(post) {
      console.log('Successful post', post)
    })
}

exports.post.get = function(req, res, match) {
  console.log('Req post', match.params.id)
  db.posts.get(match.params.id)
    .then(function(post) {
      sendJson(req, res, post)
    })
    .catch(function(err) {
      return error(req, res, err)
    })
}

exports.comment = {}
exports.comment.put = function(req, res, match) {
  console.log('Req put comment')

  var makeCommentFromReqBody = function(body) {
    var postId = match.params.id
    return Comment(body.text, postId)
  }

  postRequest(req, res, makeCommentFromReqBody, db.comments.put)
    .then(function(comment) {
      console.log('Successful comment', comment)
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

function isPostRequest(req) {
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

function postRequest(req, res, makeModel, postToDb) {
  return when()
    .tap(isPostRequest.bind(null, req))
    .then(anybodyp.bind(null, req, res))
    .tap(verifyCsrf)
    .then(makeModel)
    .then(postToDb)
    .then(function(item) {
      sendJson(req, res, item)
      return item
    })
    .catch(function(err) {
      return error(req, res, err)
    })
}
