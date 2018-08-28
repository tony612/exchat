import React from 'react'
import PropTypes from 'prop-types'

import NewChannel from './NewChannel'
import JoinChannel from './JoinChannel'
import JoinDirectChannel from './JoinDirectChannel'

class Overlay extends React.Component {
  render() {
    return (
      <div>
        <NewChannel {...this.props}></NewChannel>
        <JoinChannel {...this.props}></JoinChannel>
        <JoinDirectChannel {...this.props}></JoinDirectChannel>
      </div>
    )
  }
}

export default Overlay
