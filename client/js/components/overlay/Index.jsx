import React, { PropTypes } from 'react'

import NewChannel from './NewChannel'
import JoinChannel from './JoinChannel'

class Overlay extends React.Component {
  render() {
    return (
      <div>
        <NewChannel {...this.props}></NewChannel>
        <JoinChannel {...this.props}></JoinChannel>
      </div>
    )
  }
}

export default Overlay
