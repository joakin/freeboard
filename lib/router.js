var router = module.exports = require('routes')()
var templates = require('./ui/templates')
var sendHtml = require('send-data/html')
var ecstatic = require('ecstatic')
var anybody = require('body/any')
var redirect = require("redirecter")

var csrf = require('csrf')()
var secret = csrf.secretSync()

var db = require('./db')

router.addRoute('/', index)
router.addRoute('/put', postPut)
router.addRoute('/:id', postGet)
router.addRoute('/css/*', assets)
router.addRoute('/fonts/*', assets)
router.addRoute('/*', notFound)

function index(req, res) {
  console.log('Req index')
  db.posts.list(function(err, posts) {
    if (err) return error(req, res, err)
    sendHtml(req, res, templates.layout({
      title: 'O hai',
      body: {
        _html: templates.index({
          posts: posts,
          csrf: csrf.create(secret)
        }).innerHTML
      }
    }).innerHTML)
  })
}

function postGet(req, res, match) {
  console.log('Req post', match.params.id)
  db.posts.get(match.params.id, function(err, post) {
    if (err) return error(req, res, err)
    sendHtml(req, res, templates.layout({
      title: post.title + ' - post',
      body: {
        _html: templates.post.full(post).innerHTML
      }
    }).innerHTML)
  })
}

function postPut(req, res) {
  console.log('Req put post')

  anybody(req, res, function(err, body) {
    console.log('Parsed body', body)
    if (err) return error(req, res, err)
    if (!csrf.verify(secret, body.csrf)) {
      var csrfErr = new Error('Nope')
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

var staticHandler = ecstatic({ root: './static', handleError: false })
function assets(req, res) {
  console.log('Static file', req.url)
  staticHandler(req, res)
}

function notFound(req, res, match) {
  console.log('Req not found', match)
  sendHtml(req, res, {
    statusCode: 404,
    body: templates.layout({
      title: 'not found',
      body: { _html: templates.notFound().innerHTML }
    }).innerHTML
  })
}

function error(req, res, err) {
  console.log('Error', err)
  sendHtml(req, res, {
    statusCode: err.statusCode || 500,
    body: templates.layout({
      title: 'error',
      body: { _html: templates.error({
        error: err
      }).innerHTML }
    }).innerHTML
  })
}
