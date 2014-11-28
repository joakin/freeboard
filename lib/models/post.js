
module.exports = exports = Post

function Post(title, text) {
  return {
    date: Date.now(),
    title: title,
    text: text
  }
}

Post.validate = function(post) {}
