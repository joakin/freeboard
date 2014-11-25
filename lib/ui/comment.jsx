var React = require('react')

var RelativeDate = require('./relative-date')
var Text = require('./text')

module.exports = React.createClass({
  render: function() {
    return (
      <div className='comment'>
        <RelativeDate date={this.props.date} />
        <Text text={ this.props.text } />
      </div>
    )
  }
})
