
var hyperglue = require('hyperglue')
var fs = require('fs');
var html = fs.readFileSync(__dirname + '/templates/not-found.html');

module.exports = function () {
  return hyperglue(html, {})
}
