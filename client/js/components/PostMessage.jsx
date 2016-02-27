import React, { Component, PropTypes } from 'react'

export default class PostMessage extends Component {

  handleSubmit(e) {
    const text = e.target.value.trim()
    const {onPost} = this.props
    if (e.which === 13) {
      onPost(text)
    }
  }

  messageChange(e) {
    const text = e.target.value
    this.props.onChange(text)
  }

  render() {
    return (
      <div className="message-input">
        <input type='text' className="form-control" value={this.props.message}
          onChange={::this.messageChange}
          onKeyDown={::this.handleSubmit} />
      </div>
    )
  }
}

PostMessage.propTypes = {
  onPost: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  message: PropTypes.string
}
