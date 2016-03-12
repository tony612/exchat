import * as types from '../constants/ActionTypes'
import _ from 'lodash'

let initialState = {
  // 0: channel0,
  // 1: channel1,
  // ...
  // [1, 2, 3, ...]
  ids: [],
  // { 1: [1, 2, 3]}
  msgIdsById: {},
  // {1: true, 2: false, ...}
  hasMore: {},
  initChannelsDone: false,
  // {abc: 1, ...}
  channelIdByName: {},
  currentChannelId: null,
  // {1: "New msg"}
  newMessages: {},
  // {1: [1, 2, 3]}
  unreadMsgsCounts: {}
}

function getNewUnreadCount(state, channelId) {
  const {currentChannelId, unreadMsgsCounts} = state
  let currentCount = unreadMsgsCounts[channelId]
  if (channelId !== currentChannelId) {
    return (currentCount || 0) + 1
  } else {
    return currentCount
  }
}

function getChannelIdByName(channels) {
  return _.transform(channels, (result, channel, id) => {
    result[channel.name] = channel.id
  })
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
        isFetching: false,
        channelIdByName: {
          ...state.channelIdByName,
          ...getChannelIdByName(channels)
        }
      }
      break
    case types.UPDATE_CHANNEL:
      return {
        ...state,
        unreadMsgsCounts: {
          ...state.unreadMsgsCounts,
          [action.channelId]: action.payload.unreadCount
        }
      }
    case types.INIT_CHANNELS_DONE:
      return {
        ...state,
        initChannelsDone: true
      }
      break
    case types.RECEIVED_MESSAGE:
      var payload = action.payload
      let ts = payload.ts
      let channelId = payload.channelId
      let msgIds = state.msgIdsById[channelId] || []
      return {
        ...state,
        msgIdsById: {
          ...state.msgIdsById,
          [channelId]: [...msgIds, ts]
        },
        unreadMsgsCounts: {
          ...state.unreadMsgsCounts,
          [channelId]: getNewUnreadCount(state, channelId)
        }
      }
      break
    case types.ADD_MESSAGES:
      var msgIds = action.payload.messages.map(m => m.ts)
      return {
        ...state,
        msgIdsById: {
          ...state.msgIdsById,
          [action.channelId]: [...msgIds]
        },
        hasMore: {
          ...state.hasMore,
          [action.channelId]: action.payload.hasMore
        }
      }
    case types.FETCH_MESSAGES_SUCCESS:
      var msgIds = action.response.result.messages
      return {
        ...state,
        msgIdsById: {
          ...state.msgIdsById,
          [action.channelId]: [...msgIds]
        },
        hasMore: {
          ...state.hasMore,
          [action.channelId]: action.response.hasMore
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
        ],
        channelIdByName: {
          ...state.channelIdByName,
          ...getChannelIdByName(channels)
        }
      }
      break
    case types.CHANGE_CHANNEL:
      const {channelIdByName, unreadMsgsCounts} = state
      let currentChannelId = channelIdByName[action.channelName]
      return {
        ...state,
        currentChannelId: currentChannelId,
        unreadMsgsCounts: {
          ...unreadMsgsCounts,
          [currentChannelId]: null
        }
      }
      break
    case types.CHANGE_NEW_MESSAGE:
      return {
        ...state,
        newMessages: {
          ...state.newMessages,
          [action.channelId]: action.text
        }
      }
    case types.POST_MESSAGE_SUCCESS:
      return {
        ...state,
        newMessages: {
          ...state.newMessages,
          [action.payload.channelId]: ''
        }
      }
    default:
      return state
  }
}
