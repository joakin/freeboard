
var hyperglue = require('hyperglue')
var fs = require('fs');
var vagueTime = require('vague-time')
var shortHtml = fs.readFileSync(__dirname + '/templates/post-short.html');

var React = require('react')

var Comment = require('./comment')

function displayDate(timestamp) {
  return vagueTime.get({ to: timestamp })
}

exports.Post = React.createClass({
  render: function() {
    var post = this.props.post
    var comments = post.comments.map((c) => <Comment key={c.date} {...c} />)
    return (
      <div className='post'>
        <h4>{ post.title }</h4>

        <span className='date'>{ displayDate(post.date) }</span>
        <div className='text'
          dangerouslySetInnerHTML={{__html: post.text}} />

        <div id='comments' className='comments'>{comments}</div>

        <form action={post.date + '/comment'} method='post' accept-charset='utf-8'>
          <input name='csrf' className='csrf' type='hidden'
            value={this.props.csrf} />
          <p className='inline'>
            <textarea name='text' placeholder='Comment...'></textarea>
            <input type='submit' value='Send →' />
          </p>
        </form>
      </div>
    )
  }
})

exports.PostShort = function() {}

exports.short = function (post) {
  return hyperglue(shortHtml, {
    'h4 a': {
      href: '/' + post.date,
      _text: post.title
    },
    '.date': displayDate(post.date)
  })
}
