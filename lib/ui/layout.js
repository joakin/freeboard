
var hyperglue = require('hyperglue')
var fs = require('fs');
var html = fs.readFileSync(__dirname + '/templates/layout.html');

module.exports = function (doc) {
  return hyperglue(html, {
    title: doc.title + ' - duckingboard',
    body: { _html: doc.body },
    '#data': {
      _html: safeStringify(doc.data)
    }
  }).innerHTML
}

// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(obj) {
return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}
