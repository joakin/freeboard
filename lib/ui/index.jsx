
var React = require('react')
var { PostShort } = require('./post')
var PostForm = require('./post-form')

module.exports = React.createClass({
  statics: {
    dataDeps: ['posts', 'csrf']
  },
  render: function() {
    var posts = null
    if (this.props.posts)
      posts = this.props.posts.map((p) => <PostShort key={p.date} post={p}/>)
    var noPosts = (
      <div>
        <h3>No posts to show!</h3>
        <h5>Why don''t you create the first one?</h5>
      </div>
    )
    return (
      <div className='index'>
        <PostForm />
        <div className='posts'>{ posts && posts.length? posts: noPosts }</div>
      </div>
    )
  }
})
