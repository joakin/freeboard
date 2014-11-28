
var React = require('react')
var Csrf = require('./csrf')
var TextInput = require('./text-input')
var api = require('../api/client')

module.exports = React.createClass({
  render: function() {
    return (
      <form onSubmit={this.post} action='/put' method='post' acceptCharset='utf-8'>
        <fieldset>
          <legend>Add post</legend>
          <Csrf csrf={this.props.csrf}/>
          <p><input ref='title' name='title' type='text'
            placeholder="OMG I'm posting on the internet!!" /></p>
          <p><TextInput ref='text' placeholder='Hi people! How are you doing?'/></p>
          <p><input type='submit' value='Send →' /></p>
        </fieldset>
      </form>
    )
  },
  post: function(e) {
    e.preventDefault()
    var title = this.refs.title.getDOMNode().value
    var text = this.refs.text.getValue()
    api.post.put(title, text, this.props.csrf)
  }
})

