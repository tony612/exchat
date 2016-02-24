import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'

export default class CreateChannel extends Component {

  handleConfirm(e) {
    const {onConfirm} = this.props
    let name = findDOMNode(this.refs.channelName).value
    if (name && name !== '') {
      onConfirm(name)
    }
  }

  render() {
    return (
      <div>
        <input type='text' className='form-control' ref='channelName' />
        <input type='button' className='btn btn-default' value='create channel' onClick={::this.handleConfirm} />
      </div>
    )
  }
}

CreateChannel.propTypes = {
  onConfirm: PropTypes.func.isRequired
}
