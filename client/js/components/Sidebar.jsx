import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import List from './List'
import CreateChannel from './CreateChannel'
import Settings from './Settings'
import { createChannel } from '../actions/channels'

class Sidebar extends Component {
  renderChannel(channel) {
    return (
      <li className={this._channelClass(channel)} key={channel.id}>
        <Link to={`/channels/${channel.name}`} className="channel-link">
          <span className="prefix-icon">#</span>
          {channel.name}
        </Link>
      </li>
    )
  }

  _channelClass(channel) {
    let classes = ["channel-nav"]
    if (channel.id === this.props.channels.currentChannelId) {
      classes.push("-active")
    }
    return classes.join(' ')
  }

  render() {
    const {dispatch, channels} = this.props
    let items = channels.ids.map(id => channels[id])
    let active = id => id === channels.currentChannelId
    return (
      <div>
        <Settings dispatch={dispatch}></Settings>
        <List items={items}
              renderItem={::this.renderChannel}
              isLoading={channels.isFetching}/>
        <CreateChannel onConfirm={name =>
          dispatch(createChannel(name))}/>
      </div>
    )
  }
}

Sidebar.propTypes = {
  channels: PropTypes.object
}

export default Sidebar
