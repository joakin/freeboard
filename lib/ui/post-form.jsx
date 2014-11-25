
var React = require('react')
var Csrf = require('./csrf')

module.exports = React.createClass({
  render: function() {
    return (
      <form action='/put' method='post' acceptCharset='utf-8'>
        <fieldset>
          <legend>Add post</legend>
          <Csrf />
          <p><input name='title' type='text'
            placeholder="OMG I'm posting on the internet!!" /></p>
          <p><textarea name='text'
            placeholder='Hi people! How are you doing?'></textarea></p>
          <p><input type='submit' value='Send →' /></p>
        </fieldset>
      </form>
    )
  }
})

