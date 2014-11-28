
module.exports = exports = Comment

function Comment(text, post) {
  return { text: text, post: post }
}

Comment.validate = function(comment) {}
