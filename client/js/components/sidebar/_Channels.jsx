import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import List from '../shared/List'
import { openNewChannelModal, openJoinChannelModal } from '../../actions/local'
import ChannelNameBar from '../shared/ChannelNameBar'

class Channels extends React.Component {
  render() {
    const {dispatch, channels} = this.props
    let items = channels.ids.map(id => channels.items[id])
    return (
      <div>
        {this._renderChannelHeader()}
        <List items={items}
              renderItem={::this._renderChannel}
              isLoading={channels.isFetching}/>
        {this._renderNewChannelButton()}
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
  _renderChannel(channel) {
    const {channels} = this.props
    let unread = channels.unreadMsgsCounts[channel.id]
    return (
      <li className={this._channelClass(channel)} key={channel.id}>
        <Link to={`/channels/${channel.name}`} className="channel-link sidebar-item">
          <ChannelNameBar channel={channel}>
          </ChannelNameBar> {this._unreadCount(unread)}
        </Link>
      </li>
    )
  }

  _renderChannelHeader() {
    const {dispatch} = this.props
    return (
      <div className='list-unstyled sidebar-item header-item'>
        <span>Channels</span>
        <span className="glyphicon glyphicon-plus pull-right new-button"
          aria-hidden="true" onClick={()=> dispatch(openJoinChannelModal())}></span>
      </div>
    )
  }

  _renderNewChannelButton() {
    const {dispatch} = this.props
    return (
      <div className="sidebar-item newchannel-button">
        <a onClick={()=> dispatch(openNewChannelModal())}>+ New Channel</a>
      </div>
    )
  }
}

Channels.propTypes = {
}

export default Channels
