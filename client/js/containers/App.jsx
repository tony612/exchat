import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Sidebar from '../components/sidebar/Sidebar'
import Overlay from '../components/overlay/Index'
import {fetchChannelsIfNeeded} from '../actions/channels'

class App extends Component {
  componentDidMount() {
    const {dispatch} = this.props

    dispatch(fetchChannelsIfNeeded())
  }

  render() {
    const {dispatch, channels, children, local} = this.props

    return (
      <div className="app-container" style={style.container}>
        <Overlay local={local} dispatch={dispatch}  style={style.container}></Overlay>
      <div className="navigate-sidebar"  style={style.container}>
          <Sidebar dispatch={dispatch} channels={channels}/>
        </div>
        <div className="main-area" style={style.container}>
          { children || 'Loading..' }
        </div>
      </div>
    )
  }
}

const style = {
  container: {
    height: '100%'
  }
}

App.propTypes = {
  channels: PropTypes.object,
  children: PropTypes.node,
  local: PropTypes.object
}

function mapStateToProps(state) {
  return {
    channels: state.channels,
    local: state.local
  }
}

export default connect(
  mapStateToProps
)(App)
