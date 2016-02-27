import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Auth from '../../auth'
import { signIn } from '../../actions/auth'
import { signUp } from '../../actions/auth'
import { SIGN_IN, SIGN_UP } from '../../constants/ActionTypes'
import ErrorMessage from '../shared/ErrorMessage'

class SignIn extends Component {
  _signIn(e) {
    e.preventDefault()
    let {email, password} = this.refs
    const {dispatch} = this.props
    dispatch(signIn(email.value, password.value))
  }

  _signUp(e) {
    e.preventDefault()
    let {email, password} = this.refs
    const {dispatch} = this.props
    dispatch(signUp(email.value, password.value))
  }

  render() {
    return (
      <div style={style.container}>
        <h1 style={style.title}>Exchat</h1>
        <ErrorMessage error={this.props.error}></ErrorMessage>
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2">Email</label>
            <div className="col-sm-10">
              <input type="email" className="form-control" placeholder="Email" ref="email"></input>
              <span className="help-block">A fake but well-formed email is ok. (No email confirmation)</span>
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
              <button type="submit" className="btn btn-default" onClick={::this._signIn}>Sign In</button>{' '}
              <button type="submit" className="btn btn-primary" onClick={::this._signUp}>Sign Up</button>
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
  },
  title: {
    height: '5rem'
  }
}

function mapStateToProps(state) {
  return {
    error: state.errors[SIGN_IN] || state.errors[SIGN_UP]
  }
}

export default connect(
  mapStateToProps
)(SignIn)
