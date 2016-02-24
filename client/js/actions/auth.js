import { browserHistory } from 'react-router'

import * as types from '../constants/ActionTypes'
import { API_CALL, POST, GET } from '../constants/ApiTypes'

import Auth from '../auth'

export function signIn(email, password) {
  return {
    type: types.SIGN_IN,
    [API_CALL]: {
      path: '/sign_in',
      method: POST,
      data: {
        email, password
      },
      skipAuth: true,
      successCallback: (response, store) => {
        Auth.login(response)
        browserHistory.replace('/')
      }
    }
  }
}

export function signUp(email, password) {
  return {
    type: types.SIGN_UP,
    [API_CALL]: {
      path: '/sign_up',
      method: POST,
      data: {
        email, password
      },
      skipAuth: true,
      successCallback: (response, store) => {
        Auth.login(response)
        browserHistory.replace('/')
      }
    }
  }
}

export function signOut() {
  return (dispatch, getState) => {
    Auth.logout()
    browserHistory.replace('/login')
  }
}
