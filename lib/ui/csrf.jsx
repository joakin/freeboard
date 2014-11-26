
var React = require('react')

module.exports = React.createClass({
  render: function() {
    return (
        <input name='csrf' className='csrf' type='hidden'
          value={this.props.csrf} />
    )
  }
})
