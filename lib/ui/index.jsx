
var React = require('react')
var { PostShort } = require('./post')
var PostForm = require('./post-form')

module.exports = React.createClass({
  render: function() {
    var posts = this.props.posts
      .map((p) => <PostShort key={p.date} post={p} />)
    return (
      <div className='index'>
        <PostForm />
        <div className='posts'>{ posts }</div>
      </div>
    )
  }
})
