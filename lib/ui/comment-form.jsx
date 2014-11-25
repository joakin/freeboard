
var React = require('react')
var Csrf = require('./csrf')

module.exports = React.createClass({
  render: function() {
    var post = this.props.post
    return (
      <form action={post.date + '/comment'} method='post' acceptCharset='utf-8'>
        <Csrf />
        <p className='inline'>
          <textarea name='text' placeholder='Comment...'></textarea>
          <input type='submit' value='Send →' />
        </p>
      </form>
    )
  }
})

