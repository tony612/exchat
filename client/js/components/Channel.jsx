import React, { Component, PropTypes, findDOMNode } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import List from './List'
import Message from '../components/Message'
import PostMessage from '../components/PostMessage'
import { postMessage } from '../actions/messages'
import { fetchMessages } from '../actions/channels'

class Channel extends Component {

  componentDidMount() {
    this.channelWillChange(this.props)
  }

  componentWillReceiveProps(props) {
    let channelName = this.props.channelName
    let nextChannelName = props.channelName
    let initChannelsDone = this.props.initChannelsDone
    let nextinitChannelsDone = props.initChannelsDone

    if (nextChannelName !== channelName || nextinitChannelsDone !== initChannelsDone) {
      this.channelWillChange(props)
    }
  }

  channelWillChange(props) {
    const { dispatch, fetchedMsgsAtBeginning, channelName, initChannelsDone } = props

    if (!fetchedMsgsAtBeginning[channelName] && initChannelsDone) {
      dispatch(fetchMessages(channelName))
    }
  }

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
  let { fetchedMsgsAtBeginning, msgIdsById, initChannelsDone } = state.channels
  let msgIds = msgIdsById[channelId] || []
  let messages = _.compact(msgIds.map(id => state.messages[`${channelId}:${id}`]))
  return {
    channelName: channelId,
    messages,
    fetchedMsgsAtBeginning,
    initChannelsDone
  }
}

export default connect(
  mapStateToProps
)(Channel)
