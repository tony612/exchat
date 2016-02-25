import * as types from '../constants/ActionTypes'

const initialState = {
  currentUser: null
}

export default function session(state = initialState, action) {
  switch (action.type) {
  case types.SIGN_IN_SUCCESS:
  case types.SIGN_UP_SUCCESS:
    return {
      ...state,
      currentUser: action.response.user
    }
    break
  default:
    return state
  }
}
