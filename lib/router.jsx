var router = module.exports = require('routes')()
var View = require('./view')
var ecstatic = require('ecstatic')
var sendHtml = require('send-data/html')

var React = require('react');
var ServerError = require('./ui/error.jsx')
var db = require('./db')

var api = {
  routes: require('./api/routes'),
  server: require('./api/server')
}

// Static assets
router.addRoute('/js/*', assets)
router.addRoute('/css/*', assets)
router.addRoute('/fonts/*', assets)
router.addRoute('/favicon.ico', assets)
// Api
router.addRoute(api.routes.post.put, api.server.post.put)
// App
router.addRoute('/', app)
router.addRoute('/*', app)

// router.addRoute('/:id', postGet)
// router.addRoute('/:id/comment', comment)

var Router = require('react-router')
var routes = require('./routes')

function app(req, res) {
  Router.run(routes, req.url, function(Handler, state) {
    db.fetchRenderData(state).then((data) =>
      sendHtml(req, res, {
        body: View({
          data: data,
          body: <Handler {...data}/>
        })
      })
    ).catch((err) => error(req, res, err))
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

var staticHandler = ecstatic({ root: './static', handleError: false })
function assets(req, res) {
  console.log('Static file', req.url)
  staticHandler(req, res)
}

