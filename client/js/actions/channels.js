import { browserHistory } from 'react-router'
import { camelizeKeys } from 'humps'

import * as types from '../constants/ActionTypes'
import { API_CALL, POST, GET } from '../constants/ApiTypes'
import ExSocket from '../socket/ex_socket'
import { receivedMessage } from './messages'
import Schemas from '../store/schema'
import Auth from '../auth'

export function initChannel(channelData, dispatch, callback) {
  let channel = ExSocket.findChannel(channelData.id, callback)
  channel.off('new_message')
  channel.on('new_message', payload => {
    payload = camelizeKeys(payload)
    dispatch(receivedMessage(payload))
  })
}

let afterAddedChannel = function(channel, dispatch, callback) {
  initChannel(channel, dispatch, (data)=> {
    data = camelizeKeys(data)
    dispatch(updateChannel(channel.id, {unreadCount: data.unreadCount}))
    dispatch(addMessages(channel.id, data))
  })
}

export function createChannel(name) {
  return {
    type: types.CREATE_CHANNEL,
    [API_CALL]: {
      path: '/channels',
      method: POST,
      data: {
        channel: {
          name: name
        }
      },
      schema: Schemas.channel,
      successCallback: function(response, store) {
        initChannel(response.entities.channels[response.result], store.dispatch, ()=> {
          browserHistory.push(`/channels/${name}`)
          // NOTE: now route change doesn't change props in componentWillReceiveProps of Channel
          // If it works, it's not necessary to call this here
          store.dispatch(changeChannel(name))
        })
      }
    }
  }
}

export function updateChannel(id, payload) {
  return {
    channelId: id,
    type: types.UPDATE_CHANNEL,
    payload: payload
  }
}

export function fetchChannels(initDoneCallback = null) {
  if (!initDoneCallback) {
    initDoneCallback = (dispatch) => {
      console.log('INIT CHANNELS DONE')
      dispatch(initChannelsDone())
    }
  }
  let successCallback = function(response, store) {
    const {result, entities} = response
    _.forEach(result, (id, i) => {
      afterAddedChannel(entities.channels[id], store.dispatch, ()=> {
        if (result.length - 1 === i) {
          initDoneCallback(store.dispatch)
        }
      })
    })
  }
  return {
    type: types.FETCH_CHANNELS,
    [API_CALL]: {
      path: '/channels',
      method: GET,
      schema: Schemas.channelArray,
      successCallback: successCallback
    }
  }
}

export function initChannelsDone() {
  return {
    type: types.INIT_CHANNELS_DONE
  }
}

export function fetchChannelsIfNeeded() {
  return (dispatch, getState) => {
    if (!getState().channels.initChannelsDone) {
      return dispatch(fetchChannels())
    }
  }
}

// Just after channel finished joining, messages will be sent back
export function addMessages(channelId, payload) {
  return {
    channelId: channelId,
    type: types.ADD_MESSAGES,
    payload: payload
  }
}

export function fetchMessages(channelId, ts) {
  return {
    channelId: channelId,
    type: types.FETCH_MESSAGES,
    [API_CALL]: {
      path: `/channels/${channelId}/messages`,
      method: GET,
      data: {ts: ts},
      schema: {messages: Schemas.messageArray}
    }
  }
}

export function changeChannel(channelName) {
  return {
    type: types.CHANGE_CHANNEL,
    channelName
  }
}

export function changeNewMessage(channelId, text) {
  return {
    channelId,
    type: types.CHANGE_NEW_MESSAGE,
    text: text
  }
}

export function markMessageRead(channelId, message) {
  return {
    type: types.MARK_MESSAGE_READ,
    payload: {
      channelId
    },
    [API_CALL]: {
      path: `/channels/${channelId}/messages/read`,
      method: POST,
      data: {
        ts: message.ts
      }
    }
  }
}

export function joinChannel(channel) {
  return {
    type: types.JOIN_CHANNEL,
    payload: {
      channelId: channel.id
    },
    [API_CALL]: {
      path: `/channel_users`,
      method: POST,
      data: {channelId: channel.id},
      successCallback: function(_response, store) {
        browserHistory.push(`/channels/${channel.name}`)
        store.dispatch(changeChannel(channel.name))
      }
    }
  }
}

export function addChannel(channel, dispatch) {
  if (channel.userId != Auth.currentUser('id')) {
    afterAddedChannel(channel, dispatch)
  }
  return {
    type: types.ADD_CHANNEL,
    payload: {channel}
  }
}
