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
        console.log('successCallback')
        store.dispatch(routeActions.push('/'))
      }
    }
  }
}
