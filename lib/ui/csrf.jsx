
var React = require('react')
var csrf = require('../utils/csrf')

module.exports = React.createClass({
  render: function() {
    return (
        <input name='csrf' className='csrf' type='hidden'
          value={csrf.get()} />
    )
  }
})
