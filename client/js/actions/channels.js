import * as types from '../constants/ActionTypes'
import { API_CALL, POST, GET } from '../constants/ApiTypes'
import ExSocket from '../constants/ExSocket'
import { receivedMessage } from './messages'
import Schemas from '../store/schema'

let initChannel = function(id, store, callback) {
  let channel = ExSocket.findChannel(id, callback)
  channel.on('new_message', payload => {
    store.dispatch(receivedMessage(payload))
  })
}

export function createChannel(name) {
  return {
    type: types.CREATE_CHANNEL,
    [API_CALL]: {
      endpoint: '/channels',
      method: POST,
      data: {
        channel: {
          name: name
        }
      },
      schema: Schemas.CHANNEL,
      successCallback: function(response, store) {
        const {result} = response
        initChannel(result, store)
      }
    }
  }
}

export function fetchChannels() {
  return {
    type: types.FETCH_CHANNELS,
    [API_CALL]: {
      endpoint: '/channels',
      method: GET,
      schema: Schemas.CHANNEL_ARRAY,
      successCallback: function(response, store) {
        const {result, entities} = response
        _.forEach(result, (id, i) => {
          initChannel(id, store, ()=> {
            if (result.length - 1 === i) {
              console.log('INIT CHANNELS DONE')
              store.dispatch(initChannelsDone())
            }
          })
        })
      }
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
    return dispatch(fetchChannels())
  }
}

export function fetchMessages(channelId) {
  return {
    channelId: channelId,
    type: types.FETCH_MESSAGES,
    [API_CALL]: {
      endpoint: `/channels/${channelId}/messages`,
      method: GET,
      schema: Schemas.MESSAGE_ARRAY,
      successCallback: function(response, store) {
      }
    }
  }
}

export function changeChannel(channelName) {
  return {
    type: types.CHANGE_CHANNEL,
    channelName
  }
}
