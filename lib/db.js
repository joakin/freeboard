
var level = require('level')
var marked = require('marked')
var db = level('./db', { valueEncoding: 'json' })

function postKey(date) { return 'posts:' + (9007199254740991 - date) }
exports.posts = {}
exports.posts.list = function (next) {
  var list = []
  db.createValueStream()
    .on('data', function(post) { list.push(post) })
    .on('end', function() { next(null, list) })
    .on('error', function(err) { next(err) })
}
exports.posts.put = function (post, next) {
  if (!post.title) return next(new Error('A post needs a title'))
  post.text = marked(post.text || '')
  post.date = post.date || Date.now()
  db.put(postKey(post.date), post, next)
}
exports.posts.get = function (key, next) {
  db.get(postKey(key), next)
}

