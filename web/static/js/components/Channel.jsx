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
    const { dispatch, fetchedMsgsAtBeginning, channelName } = this.props

    if (!fetchedMsgsAtBeginning) {
      dispatch(fetchMessages(channelName))
    }
  }

  componentWillReceiveProps(props) {
    console.log('Channel Did Props', props)
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
  let { fetchedMsgsAtBeginning, msgIdsById } = state.channels
  let msgIds = msgIdsById[channelId] || []
  let messages = _.compact(msgIds.map(id => state.messages[`${channelId}:${id}`]))
  return {
    channelName: channelId,
    messages,
    fetchedMsgsAtBeginning
  }
}

export default connect(
  mapStateToProps
)(Channel)
