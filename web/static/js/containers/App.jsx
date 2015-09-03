import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import List from '../components/List'
import Message from '../components/Message'
import PostMessage from '../components/PostMessage'
import { postMessage } from '../actions/messages'

class App extends Component {
  constructor(props) {
    super(props)
  }

  renderMessage(message) {
    return (
      <Message message={message} key={message.ts} />
    )
  }

  render() {
    const { dispatch, messages } = this.props
    return (
      <div>
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
    messages: state.messages
  }
}

export default connect(
  mapStateToProps
)(App)
