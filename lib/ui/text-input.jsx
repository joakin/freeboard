
var React = require('react')

module.exports = React.createClass({
  render: function() {
    return (
      <div className='markdown-text'>
        <textarea name='text' placeholder={ this.props.placeholder }></textarea>
        <a className='supported' target='_blank'
          href='https://guides.github.com/features/mastering-markdown/'>
          Markdown enabled
        </a>
      </div>
    )
  }
})

