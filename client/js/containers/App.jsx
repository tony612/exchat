import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Sidebar from '../components/sidebar/Sidebar'
import Overlay from '../components/overlay/Index'
import {fetchChannelsIfNeeded} from '../actions/channels'
import {fetchDirectChannels} from '../actions/directChannels'
import {fetchUsers} from '../actions/users'
import EventSocket from '../socket/event_socket'

class App extends Component {
  componentDidMount() {
    const {dispatch, users} = this.props

    dispatch(fetchUsers((response, store)=> {
      store.dispatch(fetchDirectChannels(response.entities.users))
      EventSocket.initEventChannel(dispatch, {users: response.entities.users})
    }))
    dispatch(fetchChannelsIfNeeded())
  }

  render() {
    const {dispatch, channels, children, local, errors, directChannels, users} = this.props

    return (
      <div className="app-container" style={style.container}>
        <Overlay {...{local, channels, dispatch, errors, users}} style={style.container}></Overlay>
        <div className="navigate-sidebar"  style={style.container}>
          <Sidebar dispatch={dispatch} channels={channels} directChannels={directChannels} users={users}/>
        </div>
        <div className="main-area" style={style.container}>
          { children || 'Welcome to ExChat! A Slack-like app by Elixir, Phoenix & React(redux)' }
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
    directChannels: state.directChannels,
    local: state.local,
    errors: state.errors,
    users: state.users
  }
}

export default connect(
  mapStateToProps
)(App)
