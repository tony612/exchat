import React, { Component, PropTypes } from 'react'

import List from './List'
import CreateChannel from './CreateChannel'
import { createChannel } from '../actions/channels'

class Sidebar extends Component {
  renderChannel(channel) {
    return (
      <li className="channel-name" key={channel.id}>
        <a href="#">
          <span className="prefix">#</span>
          {channel.name}
        </a>
      </li>
    )
  }

  render() {
    const { dispatch, channels } = this.props
    return (
      <div>
        <List items={channels.items}
              renderItem={this.renderChannel}
              isLoading={channels.isFetching}/>
        <CreateChannel onConfirm={name =>
          dispatch(createChannel(name))}/>
      </div>
    )
  }
}

Sidebar.propTypes = {
  channels: PropTypes.array
}

export default Sidebar
