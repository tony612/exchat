import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import List from './shared/List'
import Message from '../components/Message'
import PostMessage from '../components/PostMessage'
import { postMessage } from '../actions/messages'
import { fetchMessages, changeChannel, changeNewMessage } from '../actions/channels'

class Channel extends Component {

  componentDidMount() {
    this.channelNameChange(this.props)
  }

  componentWillReceiveProps(props) {
    if (this._channelIdShouldChange(this.props, props)) {
      this.channelNameChange(props)
    }
  }

  _channelIdShouldChange(prevProps, nextProps) {
    return nextProps.params.id !== prevProps.params.id || nextProps.initChannelsDone !== prevProps.initChannelsDone
  }

  channelNameChange(props) {
    let {dispatch} = props
    dispatch(changeChannel(props.params.id))
  }

  renderMessage(message) {
    return (
      <Message message={message} key={message.ts}/>
    )
  }

  render() {
    const {dispatch, messages, channelId, newMessage} = this.props

    return (
      <div className="chat-container">
        <div className="message-list">
          <List items={messages}
          renderItem={this.renderMessage} />
        </div>
        <PostMessage
          message={newMessage}
          onChange={text => dispatch(changeNewMessage(channelId, text))}
          onPost={text => dispatch(postMessage(channelId, text))} />
      </div>
    )
  }
}

Channel.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    ts: PropTypes.number.isRequired
  })),
  channelId: PropTypes.number
}

function mapStateToProps(state) {
  let {fetchedMsgsAtBeginning, msgIdsById, initChannelsDone, currentChannelId, newMessages} = state.channels

  let msgIds = msgIdsById[currentChannelId] || []
  let messages = _.compact(msgIds.map(id => state.messages[`${currentChannelId}:${id}`]))
  return {
    messages,
    fetchedMsgsAtBeginning,
    initChannelsDone,
    channelId: currentChannelId,
    newMessage: newMessages[currentChannelId] || ""
  }
}

export default connect(
  mapStateToProps
)(Channel)
