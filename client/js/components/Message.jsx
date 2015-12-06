import React, { Component, PropTypes } from 'react'

export default class Message extends Component {
  render() {
    const { message } = this.props

    return (
      <div>
        [{new Date(message.ts * 1000).toLocaleString()}] {message.text}
      </div>
    )
  }
}
