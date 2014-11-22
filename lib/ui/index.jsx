
var React = require('react')
var { PostShort } = require('./post')

module.exports = React.createClass({
  render: function() {
    var posts = this.props.posts.map((p) => <PostShort {...p} />)
    return (
      <div class='index'>
        <div className='put-post'>
          <form action='/put' method='post' accept-charset='utf-8'>
            <fieldset>
              <legend>Add post</legend>
              <input name='csrf' className='csrf' type='hidden'
                value={ this.props.csrf }/>
              <p><input name='title' type='text' placeholder="OMG I'm posting on the internet!!" /></p>
              <p><textarea name='text' placeholder='Hi people! How are you doing?'></textarea></p>
              <p><input type='submit' value='Send →' /></p>
            </fieldset>
          </form>
        </div>

        <div className='posts'>{ posts }</div>
      </div>
    )
  }
})
