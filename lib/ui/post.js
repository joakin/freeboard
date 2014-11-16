
var hyperglue = require('hyperglue')
var fs = require('fs');
var vagueTime = require('vague-time')
var fullHtml = fs.readFileSync(__dirname + '/templates/post.html');
var shortHtml = fs.readFileSync(__dirname + '/templates/post-short.html');

var comment = require('./comment')

function displayDate(timestamp) {
  return vagueTime.get({ to: timestamp })
}

exports.full = function (post, options) {
  return hyperglue(fullHtml, {
    h4: post.title,
    '.date': displayDate(post.date),
    'form': { action: post.date + '/comment' },
    '.text': { _html: post.text },
    '.csrf': { value: options.csrf },
    '.comments': {
      _html: post.comments.map(function(c) { return comment(c).innerHTML }).join('\n')
    }
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
