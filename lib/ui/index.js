
var hyperglue = require('hyperglue')
var fs = require('fs');
var html = fs.readFileSync(__dirname + '/templates/index.html');
var post = require('./post')

module.exports = function (doc) {
  return hyperglue(html, {
    '.csrf': { value: doc.csrf },
    '.posts': {
      _html: doc.posts.map(function(p) { return post.short(p).innerHTML }).join('\n')
    }
  })
}
