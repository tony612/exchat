import React, { PropTypes, Component } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'

import {signOut} from '../../actions/auth'

class Settings extends Component {
  _signOut(e) {
    e.preventDefault()

    const {dispatch} = this.props
    dispatch(signOut())
  }

  render() {
    const {dispatch, currentUser} = this.props
    let title = currentUser && currentUser.username
    return (
      <DropdownButton bsStyle={'link'} bsClass='navbar-settings dropdown' title={title} id="settings-button">
        <MenuItem onClick={::this._signOut}>Sign Out</MenuItem>
      </DropdownButton>
    )
  }
}

Settings.propTypes = {
  dispatch: PropTypes.func,
  currentUser: PropTypes.object
}

export default Settings
