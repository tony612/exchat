import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import List from '../shared/List'
import { openJoinDirectChannelModal } from '../../actions/local'

class DirectChannels extends React.Component {
  render() {
    const {dispatch, channels} = this.props
    let items = channels.directIds.map(id => channels.items[id])
    return (
      <div>
        {this._renderDirectChannelHeader()}
        <List items={items}
              renderItem={::this._renderDirectChannel}
              />
      </div>
    )
  }

  _unreadCount(count) {
    if (count && count >= 0) {
      return `(${count})`
    }
  }
  _channelClass(channel) {
    let classes = ["channel-nav"]
    if (channel.id === this.props.channels.currentChannelId) {
      classes.push("-active")
    }
    return classes.join(' ')
  }
  _channelName(channel) {
    let {users} = this.props
    return users.items[channel.userId].username
  }
  _renderDirectChannel(channel) {
    const {channels} = this.props
    let unread = channels.unreadMsgsCounts[channel.id]
    return (
      <li className={this._channelClass(channel)} key={channel.id}>
        <Link to={`/channels/@${this._channelName(channel)}`} className="channel-link sidebar-item">
          <span className="prefix-icon">
            {this._renderPresenceIcon(channel)}
          </span>
          {this._channelName(channel)} {this._unreadCount(unread)}
        </Link>
      </li>
    )
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

  _renderDirectChannelHeader() {
    const {dispatch} = this.props
    return (
      <div className='list-unstyled sidebar-item header-item'>
        <span>Direct Messages</span>
        <span className="glyphicon glyphicon-plus pull-right new-button"
          aria-hidden="true" onClick={()=> dispatch(openJoinDirectChannelModal())}></span>
      </div>
    )
  }
}

DirectChannels.propTypes = {
}

export default DirectChannels
