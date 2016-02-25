import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Sidebar from '../components/sidebar/Sidebar'
import {fetchChannelsIfNeeded} from '../actions/channels'

class App extends Component {
  componentDidMount() {
    const {dispatch} = this.props

    dispatch(fetchChannelsIfNeeded())
  }

  render() {
    const {dispatch, channels, children, currentUser} = this.props

    return (
      <div className="app-container">
        <div className="navigate-sidebar">
          <Sidebar dispatch={dispatch} channels={channels} currentUser={currentUser}/>
        </div>
        <div className="main-area">
          { children || 'Loading..' }
        </div>
      </div>
    )
  }
}

App.propTypes = {
  channels: PropTypes.object,
  children: PropTypes.node,
  currentUser: PropTypes.object
}

function mapStateToProps(state) {
  return {
    channels: state.channels,
    currentUser: state.session.currentUser
  }
}

export default connect(
  mapStateToProps
)(App)
