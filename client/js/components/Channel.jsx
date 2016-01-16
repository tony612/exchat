import React, { Component, PropTypes, findDOMNode } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import List from './List'
import Message from '../components/Message'
import PostMessage from '../components/PostMessage'
import { postMessage } from '../actions/messages'
import { fetchMessages, changeChannel, changeNewMessage } from '../actions/channels'

class Channel extends Component {

  componentDidMount() {
    this.channelNameChange(this.props)
    this.channelWillChange(this.props)
  }

  componentWillReceiveProps(props) {
    if (this._channelIdShouldChange(this.props, props)) {
      this.channelNameChange(props)
    }
    if (this._channelShouldChange(this.props, props)) {
      this.channelWillChange(props)
    }
  }

  _channelIdShouldChange(prevProps, nextProps) {
    let { initChannelsDone } = prevProps
    let channelName = prevProps.params.id
    let nextChannelName = nextProps.params.id
    let nextInitChannelsDone = nextProps.initChannelsDone
    return nextChannelName !== channelName || nextInitChannelsDone !== initChannelsDone
  }

  _channelShouldChange(prevProps, nextProps) {
    let { channelId, initChannelsDone } = prevProps
    let nextChannelId = nextProps.channelId
    let nextInitChannelsDone = nextProps.initChannelsDone
    return nextChannelId !== channelId || nextInitChannelsDone !== initChannelsDone
  }

  channelNameChange(props) {
    let { dispatch } = props
    dispatch(changeChannel(props.params.id))
  }

  channelWillChange(props) {
    const { dispatch, fetchedMsgsAtBeginning, channelId, initChannelsDone } = props

    if (channelId && !fetchedMsgsAtBeginning[channelId] && initChannelsDone) {
      dispatch(fetchMessages(channelId))
    }
  }

  renderMessage(message) {
    return (
      <Message message={message} key={message.ts}/>
    )
  }

  render() {
    const { dispatch, messages, channelId, newMessage } = this.props

    return (
      <div>
        <List items={messages}
        renderItem={this.renderMessage} />
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
  let { fetchedMsgsAtBeginning, msgIdsById, initChannelsDone, currentChannelId, newMessages } = state.channels

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
