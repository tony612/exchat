import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import List from '../shared/List'
import { openNewDirectChannelModal, openJoinDirectChannelModal } from '../../actions/local'

class DirectChannels extends React.Component {
  render() {
    const {dispatch, directChannels} = this.props
    let items = directChannels.ids.map(id => directChannels.items[id])
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
  _renderDirectChannel(channel) {
    const {channels} = this.props
    let unread = channels.unreadMsgsCounts[channel.id]
    return (
      <li className={this._channelClass(channel)} key={channel.id}>
        <Link to={`/channels/${channel.name}`} className="channel-link sidebar-item">
          <span className="prefix-icon">@</span>
          {channel.name} {this._unreadCount(unread)}
        </Link>
      </li>
    )
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
