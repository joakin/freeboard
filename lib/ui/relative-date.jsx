
var React = require('react')
var vagueTime = require('vague-time')

function displayDate(timestamp) {
  return vagueTime.get({ to: timestamp })
}

module.exports = React.createClass({
  render: function() {
    return <span className='date'>{ displayDate(this.props.date) }</span>
  }
})
