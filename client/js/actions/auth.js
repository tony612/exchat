import { routeActions } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { API_CALL, POST, GET } from '../constants/ApiTypes'

export function signIn(email, password) {
  return {
    type: types.SIGN_IN,
    [API_CALL]: {
      path: '/sign_in',
      method: POST,
      data: {
        email, password
      },
      successCallback: (response, store) => {
        localStorage.setItem('authToken', response.token)
        store.dispatch(routeActions.replace('/'))
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
      successCallback: (response, store) => {
        localStorage.setItem('authToken', response.token)
        store.dispatch(routeActions.replace('/'))
      }
    }
  }
}

export function signOut() {
  return (dispatch, getState) => {
    localStorage.removeItem('authToken')
    dispatch(routeActions.replace('/login'))
  }
}
