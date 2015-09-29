import React, { Component, PropTypes } from 'react'

export default class Message extends Component {
  render() {
    const { channel } = this.props

    return (
      <li className="channel-name">
        <a href="#">
          <span className="prefix">#</span>
          {channel.name}
        </a>
      </li>
    )
  }
}
