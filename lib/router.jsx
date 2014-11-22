var router = module.exports = require('routes')()
var View = require('./view')
var ecstatic = require('ecstatic')
var anybody = require('body/any')
var redirect = require("redirecter")
var sendHtml = require('send-data/html')

var React = require('react');
var ServerError = require('./ui/error.jsx')
var NotFound = require('./ui/not-found.jsx')
var {Post, PostShort} = require('./ui/post.jsx')
var Index = require('./ui/index.jsx')

var csrf = require('csrf')()
var secret = csrf.secretSync()

var db = require('./db')

router.addRoute('/css/*', assets)
router.addRoute('/fonts/*', assets)
router.addRoute('/', index)
router.addRoute('/put', postPut)
router.addRoute('/:id', postGet)
router.addRoute('/:id/comment', comment)
router.addRoute('/*', notFound)

function index(req, res) {
  console.log('Req index')
  db.posts.list(function(err, posts) {
    if (err) return error(req, res, err)
    sendHtml(req, res, {
      body: View({
        body: <Index posts={posts} csrf={csrf.create(secret)} />
      })
    })
  })
}

function postGet(req, res, match) {
  console.log('Req post', match.params.id)
  db.posts.get(match.params.id, function(err, post) {
    if (err) return error(req, res, err)
    sendHtml(req, res, {
      body: View({
        title: post.title + ' - post',
        body: <Post post={post} csrf={csrf.create(secret)} />
      })
    })
  })
}

function postPut(req, res) {
  console.log('Req put post')
  if (req.method !== 'POST') return error(req, res, new Error('Invalid method'))

  anybody(req, res, function(err, body) {
    console.log('Parsed body', body)
    if (err) return error(req, res, err)
    if (!csrf.verify(secret, body.csrf)) {
      var csrfErr = new Error('Unauthorized')
      csrfErr.statusCode = 403
      return error(req, res, csrfErr)
    }
    var post = {
      date: Date.now(),
      title: body.title,
      text: body.text
    }
    db.posts.put(post, function(err) {
      if (err) return error(req, res, err)
      console.log('Successful post', post)
      redirect(req, res, '/' + post.date)
    })
  })
}

function comment(req, res, match) {
  console.log('Req put comment')
  if (req.method !== 'POST') return error(req, res, new Error('Invalid method'))

  anybody(req, res, function(err, body) {
    console.log('Parsed body', body)
    if (err) return error(req, res, err)
    if (!csrf.verify(secret, body.csrf)) {
      var csrfErr = new Error('Unauthorized')
      csrfErr.statusCode = 403
      return error(req, res, csrfErr)
    }
    var postId = match.params.id
    var comment = { text: body.text, post: postId }
    db.comments.put(comment, function(err) {
      if (err) return error(req, res, err)
      console.log('Successful comment', comment)
      redirect(req, res, '/' + postId + '#comments')
    })
  })
}

var staticHandler = ecstatic({ root: './static', handleError: false })
function assets(req, res) {
  console.log('Static file', req.url)
  staticHandler(req, res)
}

function notFound(req, res, match) {
  console.log('Req not found', match)
  sendHtml(req, res, {
    statusCode: 404,
    body: View({
      title: 'not found',
      body: <NotFound />
    })
  })
}

function error(req, res, err) {
  console.log('Error', err)
  sendHtml(req, res, {
    statusCode: err.statusCode || 500,
    body: View({
      title: 'error!!',
      body: <ServerError error={err} />
    })
  })
}
