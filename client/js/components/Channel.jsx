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
    console.log(this.props)
    this.channelWillChange(this.props)
  }

  componentWillReceiveProps(props) {
    let channelId = this.props.channelId
    let nextchannelId = props.channelId
    let initChannelsDone = this.props.initChannelsDone
    let nextinitChannelsDone = props.initChannelsDone

    if (nextchannelId !== channelId || nextinitChannelsDone !== initChannelsDone) {
      this.channelWillChange(props)
    }
  }

  channelWillChange(props) {
    const { dispatch, fetchedMsgsAtBeginning, channelId, initChannelsDone } = props

    if (!fetchedMsgsAtBeginning[channelId] && initChannelsDone) {
      dispatch(fetchMessages(channelId))
    }
  }

  renderMessage(message) {
    return (
      <Message message={message} key={message.ts} />
    )
  }

  render() {
    const { dispatch, messages, channelId } = this.props

    return (
      <div>
        <List items={messages}
          renderItem={this.renderMessage} />
        <PostMessage
          onPost={text =>
            dispatch(postMessage(channelId, text))
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
  channelId: PropTypes.number.isRequired
}

function mapStateToProps(state) {
  let { fetchedMsgsAtBeginning, msgIdsById, initChannelsDone, channelIdByName } = state.channels
  let channelId = channelIdByName[state.router.params.id]
  console.log(channelId)
  console.log(_.isNumber(channelId))
  let msgIds = msgIdsById[channelId] || []
  let messages = _.compact(msgIds.map(id => state.messages[`${channelId}:${id}`]))
  console.log(messages)
  return {
    channelId: channelId || 0,
    messages,
    fetchedMsgsAtBeginning,
    initChannelsDone
  }
}

export default connect(
  mapStateToProps
)(Channel)
