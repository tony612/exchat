import React, { PropTypes, Component } from 'react'

import {signOut} from '../actions/auth'

class Settings extends Component {
  _signOut(e) {
    e.preventDefault()

    const {dispatch} = this.props
    dispatch(signOut())
  }

  render() {
    const {dispatch} = this.props
    return (
      <button className="btn btn-default" onClick={::this._signOut}>
        Sign out
      </button>
    )
  }
}

Settings.propTypes = {
  dispatch: React.PropTypes.function
}

export default Settings
