
var React = require('react')
var {Route, DefaultRoute, NotFoundRoute} = require('react-router')
var App = require('./ui/app')
var Index = require('./ui/index')
var {Post} = require('./ui/post')
var NotFound = require('./ui/not-found')

module.exports = (
  <Route name='app' path="/" handler={App}>
    <Route name='post' path=":id" handler={Post}/>
    <DefaultRoute name='index' handler={Index}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
)
