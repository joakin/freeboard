
var React = require('react')
var Csrf = require('./csrf')
var TextInput = require('./text-input')

module.exports = React.createClass({
  render: function() {
    var post = this.props.post
    return (
      <form action={post.date + '/comment'} method='post' acceptCharset='utf-8'>
        <Csrf />
        <p>
          <TextInput placeholder='Comment...' />
          <input type='submit' value='Send →' />
        </p>
      </form>
    )
  }
})

