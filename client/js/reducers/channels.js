import * as types from '../constants/ActionTypes'

let initialState = {
  ids: [],
  msgIdsById: {},
  fetchedMsgsAtBeginning: false,
  hasMore: true
}

export default function channels(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_CHANNELS_BEGIN:
      return {
        ...state,
        isFetching: true
      }
      break
    case types.FETCH_CHANNELS_SUCCESS:
      var channels = action.response.entities.channels
      return {
        ...state,
        ids: action.response.result,
        ...channels,
        isFetching: false
      }
      break
    case types.RECEIVED_MESSAGE:
      var ts = action.ts
      var msgIds = state.msgIdsById[action.channel] || []
      return {
        ...state,
        msgIdsById: {
          ...state.msgIdsById,
          [action.channel]: [...msgIds, ts]
        }
      }
      break
    case types.FETCH_MESSAGES_SUCCESS:
      var msgIds = _.values(action.response.entities.messages).map(m => m.ts)
      return {
        fetchedMsgsAtBeginning: true,
        ...state,
        msgIdsById: {
          ...state.msgIdsById,
          [action.channel]: [...msgIds]
        }
      }
      break
    case types.CREATE_CHANNEL_SUCCESS:
      var channels = action.response.entities.channels
      return {
        ...state,
        ...channels,
        ids: [
          ...state.ids,
          action.response.result
        ]
      }
      break
    default:
      return state
  }
}
