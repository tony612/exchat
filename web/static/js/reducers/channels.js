import * as types from '../constants/ActionTypes'

let initialState = {
  ids: [],
  msgIdsById: {}
}

export default function channels(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_CHANNELS_BEGIN:
      return {
        ...state,
        isFetching: true
      }
    case types.FETCH_CHANNELS_SUCCESS:
      let channels = action.response.entities.channels
      return {
        ...state,
        ids: action.response.result,
        ...channels,
        isFetching: false
      }
    case types.RECEIVED_MESSAGE:
      let ts = action.ts
      const msgIds = state.msgIdsById[action.channel] || []
      const newState = {
        ...state,
        msgIdsById: {
          ...state.msgIdsById,
          [action.channel]: [...msgIds, ts]
        }
      }
      return newState
      break;
    default:
      return state
  }
}
