import React, { Component, PropTypes } from 'react'

export default class Message extends Component {
  render() {
    const { message } = this.props

    return (
      <div>
        [{message.ts}] {message.text}
      </div>
    )
  }
}
