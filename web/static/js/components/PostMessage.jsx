import React, { Component, PropTypes } from 'react'

export default class PostMessage extends Component {

  handleSubmit(e) {
    const text = e.target.value.trim()
    const { onPost } = this.props
    if (e.which === 13) {
      onPost(text)
    }
  }

  render() {
    return (
      <div className="footer">
        <input type='text' className="form-control"
          onKeyDown={this.handleSubmit.bind(this)} />
      </div>
    )
  }
}

PostMessage.propTypes = {
  onPost: PropTypes.func.isRequired
}
