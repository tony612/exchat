import * as types from '../constants/ActionTypes'
import _ from 'lodash'

let initialState = {
  // 0: channel0, 1: channel1, ...
  items: {},
  // [1, 2, 3, ...]
  // The ids of channels current user is in
  ids: [],
  allIds: [],
  directIds: [],
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
  return (currentCount || 0) + 1
}

function getChannelIdByName(channels) {
  return _.transform(channels, (result, channel, id) => {
    result[channel.name] = channel.id
  })
}

// TODO: If usernames of users change, this will not work
function getDirectChannelIdByName(channels, users) {
  return _.transform(channels, (result, channel, id) => {
    result[users[channel.userId].username] = channel.id
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
      var joinedIds = _.chain(channels).values().filter((ch)=> ch.joined).map('id').value()
      return {
        ...state,
        allIds: action.response.result,
        ids: joinedIds,
        items: {
          ...state.items,
          ...channels
        },
        isFetching: false,
        channelIdByName: {
          ...state.channelIdByName,
          ...getChannelIdByName(channels)
        }
      }
      break
    case types.FETCH_DIRECT_CHANNELS_SUCCESS:
      var channels = action.response.entities.channels
      var joinedIds = _.chain(channels).values().filter((ch)=> ch.joined).map('id').value()
      return {
        ...state,
        allDirectIds: action.response.result,
        directIds: joinedIds,
        items: {
          ...state.items,
          ...channels
        },
        channelIdByName: {
          ...state.channelIdByName,
          ...getDirectChannelIdByName(action.response.entities.channels, action.payload.users)
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
        items: {
          ...state.items,
          ...channels
        },
        allIds: [
          ...state.allIds,
          action.response.result
        ],
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
        currentChannelId: currentChannelId
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
      break
    case types.POST_MESSAGE_SUCCESS:
      return {
        ...state,
        newMessages: {
          ...state.newMessages,
          [action.payload.channelId]: ''
        }
      }
      break
    case types.MARK_MESSAGE_READ_SUCCESS:
      return {
        ...state,
        unreadMsgsCounts: {
          ...state.unreadMsgsCounts,
          [action.payload.channelId]: null
        }
      }
      break
    case types.JOIN_CHANNEL_SUCCESS:
      return {
        ...state,
        ids: [
          ...state.ids,
          action.payload.channelId
        ]
      }
      break
    case types.JOIN_DIRECT_CHANNEL_SUCCESS:
      var channel = action.response
      var channels = {[channel.id]: channel}
      return {
        ...state,
        allDirectIds: _.union(state.allDirectIds, [channel.id]),
        directIds: [
          ...state.directIds,
          channel.id
        ],
        items: {
          ...state.items,
          ...channels
        },
        channelIdByName: {
          ...state.channelIdByName,
          ...getDirectChannelIdByName(channels, action.payload.users)
        }
      }
      break
    case types.ADD_DIRECT_CHANNEL:
      var channel = action.payload.channel
      var channels = {[channel.id]: channel}
      return {
        ...state,
        allDirectIds: _.union(state.allDirectIds, [channel.id]),
        items: {
          ...state.items,
          ...channels
        },
        channelIdByName: {
          ...state.channelIdByName,
          ...getDirectChannelIdByName(channels, action.payload.users)
        }
      }
    case types.OPEN_DIRECT_CHANNEL:
      return {
        ...state,
        directIds: _.union(state.directIds, [action.payload.channelId])
      }
    case types.ADD_CHANNEL:
      var channel = action.payload.channel
      var joinedIds = channel.joined ? [channel.id] : []
      var channels = {[channel.id]: channel}
      return {
        ...state,
        allIds: _.union(state.allIds, [channel.id]),
        ids: _.union(state.ids, joinedIds),
        items: {
          ...state.items,
          ...channels
        },
        channelIdByName: {
          ...state.channelIdByName,
          ...getChannelIdByName(channels)
        }
      }
      break
    default:
      return state
  }
}
