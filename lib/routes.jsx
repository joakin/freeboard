
var React = require('react')
var {Route, DefaultRoute} = require('react-router')
var App = require('./ui/app')
var Index = require('./ui/index')

module.exports = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Index}/>
  </Route>
)
