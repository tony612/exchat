import React, { Component, PropTypes } from 'react'

export default class Message extends Component {
  render() {
    const { channel } = this.props

    return (
      <div>
        #{channel.name}
      </div>
    )
  }
}
