
var React = require('react')
var csrf = require('../utils/csrf')

module.exports = React.createClass({
  render: function() {
    var post = this.props.post
    return (
      <form action={post.date + '/comment'} method='post' acceptCharset='utf-8'>
        <input name='csrf' className='csrf' type='hidden'
          value={csrf.get()} />
        <p className='inline'>
          <textarea name='text' placeholder='Comment...'></textarea>
          <input type='submit' value='Send →' />
        </p>
      </form>
    )
  }
})

