import * as types from '../constants/ActionTypes'

const initialState = {}

export default function errors(state = initialState, action) {
  switch (action.type) {
  case types.SIGN_IN_FAILURE:
  case types.SIGN_UP_FAILURE:
    return {
      ...state,
      [types.SIGN_IN]: action.error
    }
    break
  case types.SIGN_IN_SUCCESS:
  case types.SIGN_UP_SUCCESS:
    return {
      ...state,
      [types.SIGN_IN]: null
    }
    break
  default:
    return state
  }
}
