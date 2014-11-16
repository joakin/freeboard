var hyperglue = require('hyperglue')
var fs = require('fs');
var vagueTime = require('vague-time')
var html = fs.readFileSync(__dirname + '/templates/comment.html');

function displayDate(timestamp) {
  return vagueTime.get({ to: timestamp })
}

module.exports = function(comment) {
  return hyperglue(html, {
    '.date': displayDate(comment.date),
    '.text': { _html: comment.text }
  })
}
