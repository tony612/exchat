import React, { PropTypes } from 'react'
import { Modal } from 'react-bootstrap'
import Select from 'react-select'

import Auth from '../../auth'
import { closeJoinDirectChannelModal } from '../../actions/local'
import { joinDirectChannel } from '../../actions/directChannels'

class JoinDirectChannel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {newUserId: null}
  }

  close() {
    this.props.dispatch(closeJoinDirectChannelModal())
  }

  confirm() {
    if (!this.state.newUserId) { return }
    this.props.dispatch(joinDirectChannel(this.state.newUserId, this.props.users.items))
  }

  userChange(data) {
    this.setState({newUserId: data && data.value})
  }

  render() {
    const {local} = this.props
    return (
      <Modal show={local.openJoinDirectChannelModal} onHide={::this.close}>
        <Modal.Header closeButton>
          <Modal.Title>New direct message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this._renderUserSelect()}
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-success' onClick={::this.confirm}>Start conversation</button>
        </Modal.Footer>
      </Modal>
    )
  }

  _renderUserSelect() {
    let {channels, users} = this.props
    let directChannels = channels.directIds.map((id) => channels.items[id])
    let otherUserIds = _.difference(users.ids, directChannels.map((ch) => ch.userId))
    let otherUsers = otherUserIds.map((id)=> users.items[id])
    let options = otherUsers.map((u)=> { return {value: u.id, label: u.username} })
    return (
      <Select
        name="form-field-name"
        value={this.state.newUserId}
        options={options}
        onChange={::this.userChange}
        />
    )
  }

}

export default JoinDirectChannel
