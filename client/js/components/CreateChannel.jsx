import React, { Component, PropTypes, findDOMNode } from 'react'

export default class CreateChannel extends Component {

  handleConfirm(e) {
    const { onConfirm } = this.props
    let name = findDOMNode(this.refs.channelName).value
    if (name && name !== '') {
      onConfirm(name)
    }
  }

  render() {
    return (
      <div>
        <input type='text' ref='channelName' />
        <input type='button' value='create channel' onClick={this.handleConfirm.bind(this)} />
      </div>
    )
  }
}

CreateChannel.propTypes = {
  onConfirm: PropTypes.func.isRequired
}
