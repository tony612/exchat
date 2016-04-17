import React, { PropTypes } from 'react'
import { Modal } from 'react-bootstrap'

import { closeNewChannelModal } from '../../actions/local'
import { createChannel } from '../../actions/channels'
import ErrorMessage from '../shared/ErrorMessage'
import { CREATE_CHANNEL } from '../../constants/ActionTypes'

class NewChannel extends React.Component {
  close() {
    const {dispatch} = this.props
    dispatch(closeNewChannelModal())
  }

  confirm() {
    const {dispatch} = this.props
    let name = this.refs.newChannelName.value
    dispatch(createChannel(name))
  }

  render() {
    const {local, errors} = this.props
    return (
      <Modal show={local.openNewChannelModal} onHide={::this.close}>
        <Modal.Header closeButton>
          <Modal.Title>New Channel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorMessage error={errors[CREATE_CHANNEL]}></ErrorMessage>
          <input type="text" className="form-control" placeholder="New Channel Name"
                 ref="newChannelName"></input>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-success' onClick={::this.confirm}>Create</button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default NewChannel
