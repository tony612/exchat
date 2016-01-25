import * as types from '../constants/ActionTypes'

const initialState = {}

export default function session(state = initialState, action) {
  switch (action.type) {
  case types.SIGN_IN_SUCCESS:
    localStorage.setItem('authToken', action.response.token)
    return state
    break
  default:
    return state
  }
}
