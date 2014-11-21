var React = require('react');

var sendHtml = require('send-data/html')
var templates = require('./ui/templates')

exports.render = function (req, res, options) {
  options = options || {}
  options.statusCode = options.statusCode || 200
  options.title = options.title || 'O hai'
  options.body = options.body || ''
  sendHtml(req, res, {
    body: templates.layout({
      title: options.title,
      body: { _html: options.body }
    }).innerHTML
  })
}

exports.renderReact = function (options) {
  return templates.layout({
    title: options.title || 'O Hai',
    body: { _html: React.renderToStaticMarkup(options.body) }
  }).innerHTML
}

