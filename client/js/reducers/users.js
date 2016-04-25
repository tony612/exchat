import * as types from '../constants/ActionTypes'

let initialState = {
  items: {},
  ids: []
}

export default function users(state = initialState, action) {
  switch (action.type) {
  case types.FETCH_USERS_SUCCESS:
    return {
      ...state,
      items: action.response.entities.users,
      ids: action.response.result
    }
    break
  default:
    return state
  }
}
