import React, { Component, PropTypes, findDOMNode } from 'react'
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

  selectedChannel() {
    return findDOMNode(this.refs.selectedChannel).value
  }

  render() {
    const { dispatch, messages, channels } = this.props
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 sidebar">
            <List items={channels.items}
                  renderItem={this.renderChannel}
                  isLoading={channels.isFetching}/>
            <CreateChannel onConfirm={name =>
              dispatch(createChannel(name))}/>
          </div>
          <div className="col-md-10">
            <List items={messages}
                  renderItem={this.renderMessage} />
            Channel <input type='text' ref='selectedChannel' />
            <PostMessage
              onPost={text =>
                dispatch(postMessage(this.selectedChannel(), text))
              } />
          </div>
        </div>
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
