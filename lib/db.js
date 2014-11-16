
var level = require('level')
var db = level('./db', { valueEncoding: 'json' })

var async = require('async')
var parallel = async.parallel

var marked = require('marked')
marked.setOptions({ sanitize: true })

var end = '\xFF';
function inverseTimestamp(ts) { return 9007199254740991 - ts }

function postKey(date) {
  if (typeof date === 'number') date = inverseTimestamp(date)
  return 'posts:' + date
}
exports.posts = {}
exports.posts.list = function(next) {
  var stream = db.createValueStream({ gt: postKey(''), lt: postKey(end) })
  listFromStream(stream, next)
}
exports.posts.put = function(post, next) {
  if (!post.title) return next(new Error('A post needs a title'))
  post.text = marked(post.text || '')
  post.date = post.date || Date.now()
  db.put(postKey(post.date), post, next)
}
exports.posts.get = function (id, next) {
  id = parseInt(id, 10)
  if (isNaN(id)) return next(new Error('Post id must be a number'))
  parallel([
    db.get.bind(db, postKey(id)),
    exports.comments.list.bind(null, id)
  ], function(err, res) {
    if (err) return next(err)
    var post = res[0]
    post.comments = res[1]
    next(null, post)
  })
}

function commentKey(comment) {
  return 'comments:' + postKey(comment.post) + ':' + comment.date
}
exports.comments = {}
exports.comments.put = function(comment, next) {
  if (!comment.post) return next(new Error('A comment needs a post'))
  comment.post = parseInt(comment.post, 10)
  if (isNaN(comment.post)) return next(new Error('Post id must be a number'))
  if (!comment.text) return next(new Error('A comment needs text'))

  comment.text = marked(comment.text || '')
  comment.date = comment.date || Date.now()
  db.put(commentKey(comment), comment, next)
}
exports.comments.list = function(post, next) {
  var stream = db.createValueStream({
    gt: commentKey({ post: post, date: '' }),
    lt: commentKey({ post: post, date: end })
  })
  listFromStream(stream, next)
}

function listFromStream(stream, next) {
  var list = []
  stream
    .on('data', function(post) { list.push(post) })
    .on('end', function() { next(null, list) })
    .on('error', function(err) { next(err) })
}

