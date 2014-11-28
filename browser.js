console.log('Welcome to duckingboard')

var React = require('react')
var Router = require('react-router')
var routes = require('./lib/routes')

var data = JSON.parse(document.getElementById('data').innerHTML)

Router.run(routes, function(Handler, state) {
  React.render(<Handler {...data}/>, document.body)
})
