import * as types from '../constants/ActionTypes'

let initialState = {
  items: []
}

export default function channels(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_CHANNELS_BEGIN:
      return {
        ...state,
        isFetching: true
      }
    case types.FETCH_CHANNELS_SUCCESS:
      return {
        ...state,
        items: action.response.data,
        isFetching: false
      }
    default:
      return state
  }
}
