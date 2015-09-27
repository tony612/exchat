import * as types from '../constants/ActionTypes'
import { API_CALL, POST, GET } from '../constants/ApiTypes'
import ExSocket from '../constants/ExSocket'
import { receivedMessage } from './messages'

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
      successCallback: function(response, store) {
        let items = response.data
        items.forEach(item => {
          let channel = ExSocket.findChannel(item.name, store)
          channel.on('new_message', payload => {
            store.dispatch(receivedMessage(payload.body))
          })
        })
      }
    }
  }
}

export function fetchChannelsIfNeeded() {
  return (dispatch, getState) => {
    return dispatch(fetchChannels())
  }
}
