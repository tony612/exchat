import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import List from '../shared/List'
import Settings from './_Settings'
import { openNewChannelModal, openJoinChannelModal } from '../../actions/local'

class Sidebar extends Component {
  render() {
    const {dispatch, channels} = this.props
    let items = channels.ids.map(id => channels.items[id])
    let active = id => id === channels.currentChannelId
    return (
      <div>
        <Settings dispatch={dispatch}></Settings>
        <div className="sidebar-main">
          {this._renderChannelHeader()}
          <List items={items}
                renderItem={::this._renderChannel}
                isLoading={channels.isFetching}/>
          {this._renderNewChannelButton()}
        </div>
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
          <span className="prefix-icon">#</span>
          {channel.name} {this._unreadCount(unread)}
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

Sidebar.propTypes = {
  channels: PropTypes.object,
  dispatch: PropTypes.func
}

export default Sidebar
