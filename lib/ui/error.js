
var hyperglue = require('hyperglue')
var fs = require('fs');
var html = fs.readFileSync(__dirname + '/templates/error.html');

module.exports = function (err) {
  return hyperglue(html, {
    '.msg': err.message
  })
}
