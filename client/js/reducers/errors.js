import * as types from '../constants/ActionTypes'

const initialState = {}

export default function errors(state = initialState, action) {
  switch (action.type) {
  case types.FETCHING_FAILURE:
    return {
      ...state,
      [action.actualType]: action.error
    }
    break
  case types.FETCHING_SUCCESS:
    if (state[action.actualType]) {
      return {
        ...state,
        [action.actualType]: null
      }
    } else {
      return state
    }
    break
  case types.SIGN_IN:
  case types.SIGN_UP:
    return {
      ...state,
      [types.SIGN_IN]: null,
      [types.SIGN_UP]: null
    }
    break
  default:
    return state
  }
}
