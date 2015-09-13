import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import List from '../components/List'
import Message from '../components/Message'
import Channel from '../components/Channel'
import PostMessage from '../components/PostMessage'
import CreateChannel from '../components/CreateChannel'
import { postMessage } from '../actions/messages'
import { createChannel } from '../actions/channels'

class App extends Component {
  constructor(props) {
    super(props)
  }

  renderMessage(message) {
    return (
      <Message message={message} key={message.ts} />
    )
  }

  renderChannel(channel) {
    return (
      <Channel channel={channel} key={channel.id} />
    )
  }

  render() {
    const { dispatch, messages, channels } = this.props
    return (
      <div>
        <List items={channels.items}
              renderItem={this.renderChannel} />
        <CreateChannel onConfirm={name =>
          dispatch(createChannel(name))}/>
        <List items={messages}
              renderItem={this.renderMessage} />
        <PostMessage
          onPost={text =>
            dispatch(postMessage(text))
          } />
      </div>
    )
  }
}

App.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    ts: PropTypes.string.isRequired
  }))
}

function mapStateToProps(state) {
  return {
    messages: state.messages,
    channels: state.channels
  }
}

export default connect(
  mapStateToProps
)(App)
