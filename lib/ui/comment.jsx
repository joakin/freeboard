var React = require('react')
var vagueTime = require('vague-time')

function displayDate(timestamp) {
  return vagueTime.get({ to: timestamp })
}

module.exports = React.createClass({
  render: function() {
    return (
      <div className='comment'>
        <span className='date'>{ displayDate(this.props.date) }</span>
        <div className='text'
          dangerouslySetInnerHTML={{__html: this.props.text}} />
      </div>
    )
  }
})
