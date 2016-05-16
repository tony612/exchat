import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

class ChannelNameBar extends React.Component {

  render () {
    let {channel} = this.props
    return (
        <div style={style.container}>
          <span className="prefix-icon" style={this.props.prefixStyle}>
            {this._renderPrefix(channel)}
          </span>
          <span style={this.props.nameStyle}>{this._channelName(channel)}</span>
        </div>
    )
  }

  _renderPrefix(channel) {
    if (channel.userId) {
      return this._renderPresenceIcon(channel)
    } else {
      return "#"
    }
  }
  _renderPresenceIcon(channel) {
    let {users} = this.props
    if (users.presences[channel.userId]) {
      return (
        <i className="presence-icon -online icon-circle"></i>
      )
    } else {
      return (
        <i className="presence-icon -offline icon-circle-empty"></i>
      )
    }
  }

  _channelName(channel) {
    if (channel.userId) {
      let {users} = this.props
      return users.items[channel.userId].username
    } else {
      return channel.name
    }
  }
}

const style = {
  container: {
    display: 'inline'
  }
}

ChannelNameBar.propTypes = {
}

export default ChannelNameBar
