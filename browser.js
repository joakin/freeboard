console.log('Welcome to duckingboard')

var React = require('react')
var Router = require('react-router')
var routes = require('./lib/routes')

Router.run(routes, function(Handler, state) {
  console.log(Handler, state)
})
