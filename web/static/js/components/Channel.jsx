import React, { Component, PropTypes, findDOMNode } from 'react'
import { connect } from 'react-redux'

import List from './List'
import Message from '../components/Message'
import PostMessage from '../components/PostMessage'
import { postMessage } from '../actions/messages'

class Channel extends Component {

  renderMessage(message) {
    return (
      <Message message={message} key={message.ts} />
    )
  }

  render() {
    const { dispatch, messages, channelName } = this.props

    return (
      <div>
        <List items={messages}
          renderItem={this.renderMessage} />
        <PostMessage
          onPost={text =>
            dispatch(postMessage(channelName, text))
          } />
      </div>
    )
  }
}

Channel.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    ts: PropTypes.string.isRequired
  })),
  channelName: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  let channelId = state.router.params.id
  let msgIds = state.channels.msgIdsById[channelId] || []
  let messages = msgIds.map(id => state.messages[`${channelId}:${id}`])
  return {
    messages: messages,
    channelName: channelId
  }
}

export default connect(
  mapStateToProps
)(Channel)
