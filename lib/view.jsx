
var React = require('react');
var Layout = require('./ui/layout')

// Render a full page view with a react component body
module.exports = function (options) {
  return Layout({
    title: options.title || 'O Hai',
    body: { _html: React.renderToStaticMarkup(options.body) }
  })
}

