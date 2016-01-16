import React, { Component, PropTypes } from 'react'

export default class PostMessage extends Component {

  handleSubmit(e) {
    const text = e.target.value.trim()
    const { onPost } = this.props
    if (e.which === 13) {
      onPost(text)
    }
  }

  messageChange(e) {
    const text = e.target.value.trim()
    this.props.onChange(text)
  }

  render() {
    return (
      <div className="message-input">
        <input type='text' className="form-control" value={this.props.message}
          onChange={this.messageChange.bind(this)}
          onKeyDown={this.handleSubmit.bind(this)} />
      </div>
    )
  }
}

PostMessage.propTypes = {
  onPost: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  message: PropTypes.string
}
