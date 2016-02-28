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
    this.refs.messageList.addEventListener('scroll', ::this.handleScroll)
  }

  componentWillUnmount() {
    this.refs.messageList.removeEventListener('scroll', ::this.handleScroll)
  }

  componentWillReceiveProps(props) {
    if (this._channelIdShouldChange(this.props, props)) {
      this.channelNameChange(props)
    }
  }

  // http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
  componentWillUpdate() {
    let node = this.refs.messageList
    this.shouldScrollBottom = (node.scrollTop + node.clientHeight) === node.scrollHeight
    this.cachedScrollHeight = node.scrollHeight
  }

  componentDidUpdate() {
    let node = this.refs.messageList
    if (this.shouldScrollBottom) {
      node.scrollTop = node.scrollHeight
    } else {
      // After new messages are fetched and rendering is over, new scrollHeight
      // will be larger than old one. So scrollTop should be increased with the diff.
      // Otherwise, they're same
      node.scrollTop = node.scrollTop + (node.scrollHeight - this.cachedScrollHeight)
    }
  }

  handleScroll(event) {
    const {messages, dispatch, channelId, hasMore} = this.props
    if (event.target.scrollTop === 0 && hasMore) {
      dispatch(fetchMessages(channelId, messages[0].ts))
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
        <div className="message-list" ref="messageList">
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
  channelId: PropTypes.number,
  hasMore: PropTypes.bool
}

function mapStateToProps(state) {
  let {msgIdsById, initChannelsDone, currentChannelId, newMessages, hasMore} = state.channels

  let msgIds = msgIdsById[currentChannelId] || []
  let messages = _.compact(msgIds.map(id => state.messages[`${currentChannelId}:${id}`]))
  hasMore = hasMore[currentChannelId]
  return {
    hasMore,
    messages,
    initChannelsDone,
    channelId: currentChannelId,
    newMessage: newMessages[currentChannelId] || ""
  }
}

export default connect(
  mapStateToProps
)(Channel)
