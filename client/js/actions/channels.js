import { routeActions } from 'react-router-redux'
import { camelizeKeys } from 'humps'

import * as types from '../constants/ActionTypes'
import { API_CALL, POST, GET } from '../constants/ApiTypes'
import ExSocket from '../constants/ExSocket'
import { receivedMessage } from './messages'
import Schemas from '../store/schema'

let initChannel = function(id, store, callback) {
  let channel = ExSocket.findChannel(id, callback)
  channel.on('new_message', payload => {
    payload = camelizeKeys(payload)
    store.dispatch(receivedMessage(payload))
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
      schema: Schemas.CHANNEL,
      successCallback: function(response, store) {
        initChannel(response.result, store, ()=> {
          store.dispatch(routeActions.push(`/channels/${name}`))
          // NOTE: now route change doesn't change props in componentWillReceiveProps of Channel
          // If it works, it's not necessary to call this here
          store.dispatch(changeChannel(name))
        })
      }
    }
  }
}

export function fetchChannels() {
  let successCallback = function(response, store) {
    const {result, entities} = response
    _.forEach(result, (id, i) => {
      initChannel(id, store, (data)=> {
        store.dispatch(addMessages(id, data.messages))
        if (result.length - 1 === i) {
          console.log('INIT CHANNELS DONE')
          store.dispatch(initChannelsDone())
        }
      })
    })
  }
  return {
    type: types.FETCH_CHANNELS,
    [API_CALL]: {
      path: '/channels',
      method: GET,
      schema: Schemas.CHANNEL_ARRAY,
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
export function addMessages(channelId, messages) {
  return {
    channelId: channelId,
    type: types.ADD_MESSAGES,
    messages: messages
  }
}

export function fetchMessages(channelId) {
  return {
    channelId: channelId,
    type: types.FETCH_MESSAGES,
    [API_CALL]: {
      path: `/channels/${channelId}/messages`,
      method: GET,
      schema: Schemas.MESSAGE_ARRAY
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
