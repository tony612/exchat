import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import List from '../shared/List'
import Message from '../message/Message'
import PostMessage from './PostMessage'
import UnreadDivider from './UnreadDivider'
import { postMessage } from '../../actions/messages'
import { fetchMessages, changeChannel, changeNewMessage, markMessageRead } from '../../actions/channels'

class Channel extends Component {

  componentDidMount() {
    this.channelNameChange(this.props)
    this.refs.messageList.addEventListener('scroll', _.debounce(::this.handleScroll, 200))
  }

  componentWillUnmount() {
    this.refs.messageList.removeEventListener('scroll', _.debounce(::this.handleScroll, 200))
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
    let unreadDivider = document.querySelector('.unread-divider')
    let judgeMark = ()=> unreadDivider && unreadDivider.getBoundingClientRect().top > 0
    if (judgeMark()) {
      window.setTimeout(()=> {
        if (judgeMark()) {
          dispatch(markMessageRead(channelId, messages[messages.length - 1]))
        }
      }, 3000)
    }
  }

  _channelIdShouldChange(prevProps, nextProps) {
    return nextProps.params.id !== prevProps.params.id || nextProps.initChannelsDone !== prevProps.initChannelsDone
  }

  channelNameChange(props) {
    let {dispatch} = props
    dispatch(changeChannel(props.params.id))
  }

  renderItem(message, index, messages) {
    const {unreadCount} = this.props
    if (messages.length - index === unreadCount) {
      return (
        <div key={message.ts}>
          <UnreadDivider></UnreadDivider>
          {this.renderMessage(message)}
        </div>
      )
    } else {
      return this.renderMessage(message)
    }
  }

  renderMessage(message, index, messages) {
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
          renderItem={::this.renderItem} />
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
  let {msgIdsById, initChannelsDone, currentChannelId, newMessages, hasMore, unreadMsgsCounts} = state.channels

  let msgIds = msgIdsById[currentChannelId] || []
  let messages = _.compact(msgIds.map(id => state.messages.items[`${currentChannelId}:${id}`]))
  hasMore = hasMore[currentChannelId]
  let unreadCount = unreadMsgsCounts[currentChannelId]
  return {
    hasMore,
    messages,
    initChannelsDone,
    unreadCount,
    channelId: currentChannelId,
    newMessage: newMessages[currentChannelId] || ""
  }
}

export default connect(
  mapStateToProps
)(Channel)
