var router = module.exports = require('routes')()
var templates = require('./ui/templates')
var views = require('./views')
var ecstatic = require('ecstatic')
var anybody = require('body/any')
var redirect = require("redirecter")

var csrf = require('csrf')()
var secret = csrf.secretSync()

var db = require('./db')

router.addRoute('/css/*', assets)
router.addRoute('/fonts/*', assets)
router.addRoute('/', index)
router.addRoute('/put', postPut)
router.addRoute('/:id', postGet)
router.addRoute('/*', notFound)

function index(req, res) {
  console.log('Req index')
  db.posts.list(function(err, posts) {
    if (err) return error(req, res, err)
    views.render(req, res, {
      body: templates.index({
        posts: posts,
        csrf: csrf.create(secret)
      }).innerHTML
    })
  })
}

function postGet(req, res, match) {
  console.log('Req post', match.params.id)
  db.posts.get(match.params.id, function(err, post) {
    if (err) return error(req, res, err)
    views.render(req, res, {
      title: post.title + ' - post',
      body: templates.post.full(post).innerHTML
    })
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
  views.render(req, res, {
    statusCode: 404,
    title: 'not found',
    body: templates.notFound().innerHTML
  })
}

function error(req, res, err) {
  console.log('Error', err)
  views.render(req, res, {
    statusCode: err.statusCode || 500,
    title: 'error',
    body: templates.error({ error: err }).innerHTML
  })
}
