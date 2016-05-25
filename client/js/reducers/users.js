import * as types from '../constants/ActionTypes'

let initialState = {
  items: {},
  ids: [],
  presences: {}
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
  case types.ADD_USER:
    var user = action.payload.user
    return {
      ...state,
      items: {
        ...state.items,
        [user.id]: user
      },
      ids: _.union(state.ids, [user.id])
    }
    break
  case types.SYNC_USERS_PRESENCES:
    var presences = _.mapValues(action.payload, ()=> true)
    return {
      ...state,
      presences: presences
    }
  default:
    return state
}
}
