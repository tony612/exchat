import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Sidebar from '../components/Sidebar'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { dispatch, channels, children } = this.props

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 navigate-sidebar">
            <Sidebar dispatch={dispatch} channels={channels} />
          </div>
          <div className="col-md-10">
            { children || 'Loading..' }
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  channels: PropTypes.object,
  children: PropTypes.node
}

function mapStateToProps(state) {
  return {
    channels: state.channels
  }
}

export default connect(
  mapStateToProps
)(App)
