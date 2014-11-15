
var hyperglue = require('hyperglue')
var fs = require('fs');
var html = fs.readFileSync(__dirname + '/templates/layout.html');

module.exports = function (doc) {
  return hyperglue(html, {
    title: doc.title + ' - freeboard',
    '.content': doc.body
  })
}
