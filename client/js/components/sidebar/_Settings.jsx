import React, { PropTypes, Component } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'

import {signOut} from '../../actions/auth'
import Auth from '../../auth'

class Settings extends Component {
  _signOut(e) {
    e.preventDefault()

    const {dispatch} = this.props
    dispatch(signOut())
  }

  render() {
    const {dispatch} = this.props
    let title = Auth.currentUser('username')
    return (
      <DropdownButton bsStyle={'link'} bsClass='navbar-settings dropdown' title={title} id="settings-button">
        <MenuItem onClick={::this._signOut}>Sign Out</MenuItem>
      </DropdownButton>
    )
  }
}

Settings.propTypes = {
  dispatch: React.PropTypes.func
}

export default Settings
