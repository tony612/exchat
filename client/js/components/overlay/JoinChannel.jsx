import React, { PropTypes } from 'react'
import { Modal } from 'react-bootstrap'
import Select from 'react-select'

import Auth from '../../auth'
import { closeJoinChannelModal } from '../../actions/local'
import { joinChannel } from '../../actions/channels'

class JoinChannel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {joinChannelId: null}
  }

  close() {
    this.props.dispatch(closeJoinChannelModal())
  }

  confirm() {
    if (!this.state.joinChannelId) { return }
    let { channels } = this.props
    this.props.dispatch(joinChannel(channels.items[this.state.joinChannelId]))
  }

  channelChange(data) {
    this.setState({joinChannelId: data && data.value})
  }

  render() {
    const {local} = this.props
    return (
      <Modal show={local.openJoinChannelModal} onHide={::this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Join Channel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this._renderChannelSelect()}
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-success' onClick={::this.confirm}>Join Channel</button>
        </Modal.Footer>
      </Modal>
    )
  }

  _renderChannelSelect() {
    let {channels} = this.props
    let notJoinedIds = _.difference(channels.allIds, channels.ids)
    let otherChannels = notJoinedIds.map((id)=> channels.items[id])
    let options = otherChannels.map((ch)=> { return {value: ch.id, label: ch.name} })
    return (
      <Select
        name="form-field-name"
        value={this.state.joinChannelId}
        options={options}
        onChange={::this.channelChange}
        />
    )
  }

}

export default JoinChannel
