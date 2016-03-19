import React, { Component, PropTypes } from 'react'

import Avatar from '../shared/Avatar'

export default class Message extends Component {
  render() {
    const {message} = this.props
    let user = message.user
    let time = new Date(message.ts * 1000)

    return (
      <div className="message-item">
        <div className="user-avatar">
          <Avatar email={user.email}></Avatar>
        </div>
        <div className="message-main">
          <div className="message-meta">
            <b>{message.user.username}</b>{' '}
            <time dateTime={time.toISOString()} className="message-time">{time.toLocaleString()}</time>
          </div>
          <div className="message-body">
            {message.text}
          </div>
        </div>
      </div>
    )
  }
}
