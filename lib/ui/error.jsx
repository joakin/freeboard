
var React = require('react')

module.exports = React.createClass({
  render: function() {
    return (
      <div className='error-page'>
        <h2>Oops! There was an error</h2>
        <pre className='msg'>{this.props.error.message}</pre>
      </div>
    )
  }
})

