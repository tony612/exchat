import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import List from './List'
import CreateChannel from './CreateChannel'
import { createChannel } from '../actions/channels'

class Sidebar extends Component {
  renderChannel(channel) {
    return (
      <li className="channel-name" key={channel.id}>
        <Link to={`/channels/${channel.name}`}>
          <span className="prefix">#</span>
          {channel.name}
        </Link>
      </li>
    )
  }

  render() {
    const { dispatch, channels } = this.props
    let items = channels.ids.map(id => channels[id])
    return (
      <div>
        <List items={items}
              renderItem={this.renderChannel}
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
