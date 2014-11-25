
var React = require('react')

var Comment = require('./comment')
var CommentForm = require('./comment-form')
var RelativeDate = require('./relative-date')
var Text = require('./text')

exports.Post = React.createClass({
  render: function() {
    var post = this.props.post
    var comments = post.comments.map((c) => <Comment key={c.date} {...c} />)
    return (
      <div className='post'>
        <h4>{ post.title }</h4>

        <RelativeDate date={post.date} />
        <Text text={ post.text } />

        <div id='comments' className='comments'>{comments}</div>
        <CommentForm post={post} />
      </div>
    )
  }
})

exports.PostShort = React.createClass({
  render: function() {
    var post = this.props.post
    return (
      <div className='post short'>
        <h4><a href={ '/' + post.date }>{ post.title }</a></h4>
        <RelativeDate date={ post.date } />
      </div>
    )
  }
})
