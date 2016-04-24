import * as types from '../constants/ActionTypes'

let initialState = {
  items: {},
  ids: []
}

export default function directChannels(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_DIRECT_CHANNELS_SUCCESS:
      return {
        ...state,
        ids: action.response.result,
        items: {
          ...state.items,
          ...action.response.entities.channels
        }
      }
    break
    default:
      return state
  }
}
