
var hyperglue = require('hyperglue')
var fs = require('fs');
var vagueTime = require('vague-time')
var fullHtml = fs.readFileSync(__dirname + '/templates/post.html');
var shortHtml = fs.readFileSync(__dirname + '/templates/post-short.html');

function displayDate(timestamp) {
  return vagueTime.get({ to: timestamp })
}

exports.full = function (post) {
  return hyperglue(fullHtml, {
    h4: post.title,
    '.date': displayDate(post.date),
    '.text': { _html: post.text }
  })
}
exports.short = function (post) {
  return hyperglue(shortHtml, {
    'h4 a': {
      href: '/' + post.date,
      _text: post.title
    },
    '.date': displayDate(post.date)
  })
}
