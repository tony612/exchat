import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Auth from '../../auth'
import { signIn } from '../../actions/auth'

class Channel extends Component {

  _signIn(e) {
    e.preventDefault()
    let {email, password} = this.refs
    const {dispatch} = this.props
    dispatch(signIn(email.value, password.value))
  }

  render() {
    return (
      <div style={style.container}>
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2">Email</label>
            <div className="col-sm-10">
              <input type="email" className="form-control" placeholder="Email" ref="email"></input>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2">Password</label>
            <div className="col-sm-10">
              <input type="password" className="form-control" placeholder="Password" ref="password"></input>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default" onClick={::this._signIn}>Sign in</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const style = {
  container: {
    margin: '10rem auto',
    width: '40%'
  }
}

Channel.propTypes = {
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(
  mapStateToProps
)(Channel)
