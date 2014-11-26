
var React = require('react')
var {RouteHandler} = require('react-router')

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className='page-title'><a href='/'>&lt;duckingboard&gt;</a></h1>
        <span className='subtitle'>free post board, no moderation, completely anonymous</span>
        <div className='content'>
          <RouteHandler {...this.props}/>
        </div>
      </div>
    )
  }
})
