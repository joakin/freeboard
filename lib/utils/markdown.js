
var hl = require('highlight.js')
var Remarkable = require('remarkable')
var md = new Remarkable({
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hl.getLanguage(lang)) {
      try {
        return hl.highlight(lang, str).value;
      } catch (err) {}
    }

    try {
      return hl.highlightAuto(str).value;
    } catch (err) {}

    return ''; // use external default escaping
  }
})

module.exports = function(text) { return md.render(text) }
