import React, { Component, PropTypes } from 'react'

import Settings from './_Settings'
import Channels from './_Channels'
import DirectChannels from './_DirectChannels'

class Sidebar extends Component {
  render() {
    const {dispatch, channels} = this.props
    let items = channels.ids.map(id => channels.items[id])
    return (
      <div>
        <Settings dispatch={dispatch}></Settings>
        <div className="sidebar-main">
          <Channels {...this.props}></Channels>
          <br/>
          <DirectChannels {...this.props}></DirectChannels>
        </div>
      </div>
    )
  }

}

Sidebar.propTypes = {
  channels: PropTypes.object,
  directChannels: PropTypes.object,
  users: PropTypes.object,
  dispatch: PropTypes.func
}

export default Sidebar
