var React = require('react')

var RelativeDate = require('./relative-date')

module.exports = React.createClass({
  render: function() {
    return (
      <div className='comment'>
        <RelativeDate date={this.props.date} />
        <div className='text'
          dangerouslySetInnerHTML={{__html: this.props.text}} />
      </div>
    )
  }
})
