
var level = require('level')
var when = require('when')
var resolveHash = require('when/keys').all
var node = require('when/node')
var csrf = require('./utils/csrf')

var db = level('./db', { valueEncoding: 'json' })

var md = require('./utils/markdown')

var end = '\xFF';
function inverseTimestamp(ts) { return 9007199254740991 - ts }

function postKey(date) {
  if (typeof date === 'number') date = inverseTimestamp(date)
  return 'posts:' + date
}
exports.posts = {}
exports.posts.list = function() {
  var stream = db.createValueStream({ gt: postKey(''), lt: postKey(end) })
  return listFromStream(stream)
}
exports.posts.put = node.lift(function(post, next) {
  if (!post.title) return next(new Error('A post needs a title'))
  post.text = (post.text && md(post.text)) || ''
  post.date = post.date || Date.now()
  db.put(postKey(post.date), post, function(err) {
    if (err) next(err)
    else next(null, post)
  })
})
var getPost = node.lift(function(id, next) {
  db.get(postKey(id), next)
})
exports.posts.get = function (id) {
  id = parseInt(id, 10)
  if (isNaN(id)) return when.reject(new Error('Post id must be a number'))
  var postP = getPost(id)
  var commentsP = exports.comments.list(id)
  return when.all([postP, commentsP]).spread(function(post, comments) {
    post.comments = comments
    return post
  })
}

function commentKey(comment) {
  return 'comments:' + postKey(comment.post) + ':' + comment.date
}
exports.comments = {}
exports.comments.put = node.lift(function(comment, next) {
  if (!comment.post) return next(new Error('A comment needs a post'))
  comment.post = parseInt(comment.post, 10)
  if (isNaN(comment.post)) return next(new Error('Post id must be a number'))
  if (!comment.text) return next(new Error('A comment needs text'))

  comment.text = md(comment.text || '')
  comment.date = comment.date || Date.now()
  return db.put(commentKey(comment), comment, next)
})
exports.comments.list = function(post) {
  var stream = db.createValueStream({
    gt: commentKey({ post: post, date: '' }),
    lt: commentKey({ post: post, date: end })
  })
  return listFromStream(stream)
}

function listFromStream(stream) {
  return when.promise(function(resolve, reject) {
    var list = []
    stream
      .on('data', function(post) { list.push(post) })
      .on('end', function() { resolve(list) })
      .on('error', function(err) { reject(err) })
  })
}

// Returns a promise that will resolve when it's got all the data from the
// routes
exports.fetchRenderData = function (state) {
  var routes = state.routes
  return resolveHash(getDepsFromRoutes(routes).reduce(function(results, dep) {
    if (dep === 'posts')
      results.posts = exports.posts.list()
    else if (dep === 'csrf')
      results.csrf = csrf.get()
    else if (dep === 'post')
      results.post = exports.posts.get(state.params.id)
    else
      console.error('ERROR: Don\'t know how to fetch dep', dep)
    return results
  }, {}));
}

function getDepsFromRoutes(routes) {
  return routes.reduce(function (deps, route) {
    if (route.handler.dataDeps)
      route.handler.dataDeps.reduce(function(ds, d) {
        if (ds.indexOf(d) === -1) ds.push(d)
        return ds
      }, deps)
    return deps
  }, [])
}
