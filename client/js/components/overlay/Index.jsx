import React, { PropTypes } from 'react'

import NewChannel from './NewChannel'

class Overlay extends React.Component {
  render() {
    return (
      <div>
        <NewChannel {...this.props}></NewChannel>
      </div>
    )
  }
}

export default Overlay
