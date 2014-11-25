
var React = require('react')

module.exports = React.createClass({
  render: function() {
    return (
      <div className='text'
        dangerouslySetInnerHTML={{__html: this.props.text}} />
    )
  }
})
